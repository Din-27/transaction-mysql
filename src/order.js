const pool = require('../config/config')

exports.createOrder = async(req, res) => {
    const {nama, warna, id, co, validasi} = req.body
    await pool.query('start transaction', async function(err) {
        if (err) { throw err; }
        try {
            await pool.query(`select * from detail_order where nama='${nama}' and warna='${warna}' and id=${id} and status='SIAP KIRIM'`, async (err, result) => {
                if(result.length > 0){
                    res.status(400).send({
                        status : 'Data sudah ada dan siap kirim'
                    })
                }else{
                    await pool.query(`select * from detail_order where nama='${nama}' and warna='${warna}' and id=${id} and status='MENUNGGU ADMIN'`, async (err, result) => {
                        if(err) throw err
                        if(result.length > 0){
                            if(co === ""){
                                return res.status(200).send({
                                    status : 'data sudah ada, apakah ingin checkout ?'
                                })
                            }else if(co === 'no'){
                                return res.status(200).send({
                                    status : 'silahkan order yang lain'
                                })
                            }else if(co === 'iya'){
                                if(validasi === ""){
                                    res.status(400).send({
                                        status : 'Apakah data sudah benar ? jika iya klik tombol iya'
                                    })
                                }else if(validasi === "iya"){
                                    return await pool.query(`UPDATE detail_order SET status='SIAP KIRIM' WHERE nama='${nama}' and warna='${warna}' and id=${id}`, async function(err, result) {
                                            if (err) { 
                                                await pool.query('rollback', async function() {
                                                    throw err;
                                                });
                                            }  
                                            await pool.query('commit', async function(err) {
                                            if (err) { 
                                                await pool.query('rollback', async function() {
                                                throw err;
                                                });
                                            }
                                            console.log('success update!');
                                        });
                                        res.status(200).send({
                                            status : 'Selamat anda sudah checkout'
                                        })
                                    })
                                }else if(validasi === 'no'){
                                    return res.status(200).send({
                                        status : 'silhakan order yang lain'
                                    })
                                }
                            }
                        }else{
                            if(co === ""){
                                return res.status(200).send({
                                    status : 'apakah ingin memasukan barang ke trolly ?'
                                })
                            }else if(co === "no"){
                                return res.status(200).send({
                                    status : 'silahkan order yang lain'
                                })
                            }else if(co === "iya"){
                                if(validasi === ""){
                                    res.status(400).send({
                                        status : 'Apakah data sudah benar ? jika iya klik tombol iya'
                                    })
                                }else if(validasi === 'iya'){
                                    await pool.query(`INSERT INTO detail_order (id, nama, warna, status) VALUES (0,'${nama}', '${warna}', 'MENUNGGU ADMIN')`, async function(err, result) {
                                        if (err) { 
                                            await pool.query('rollback', async function() {
                                                throw err;
                                            });
                                        }  
                                        await pool.query('commit', async function(err) {
                                        if (err) { 
                                            await pool.query('rollback', async function() {
                                            throw err;
                                            });
                                        }
                                        console.log('success in!');
                                        });
                                    })
                                    res.status(200).send({
                                        content : {
                                            id : req.body.id,
                                            nama : req.body.nama,
                                            warna : req.body.warna
                                        }
                                    })
                                }else if(validasi === 'no'){
                                    return res.status(200).send({
                                        status : 'silhakan order yang lain'
                                    })
                                }
                            }
                        }
                    });
                }
            })
        } catch (error) {
            res.status(401).send({
                status : 'GAGAL'
            })
        }
    })
}
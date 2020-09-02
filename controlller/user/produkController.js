const {toko, kategori} = require('../../model')
const mongoose = require("mongoose");

exports.filterProduk = (req, res) => {
    const {merek, warna, kategori, jenis, hargaAwal, hargaAkhir} = req.body

    const query = {}
    const $or = []

    if (merek) {
        merek.forEach(data => $or.push({_id: mongoose.Types.ObjectId(data)}))
    }

    if (warna) {
        warna.forEach(data => $or.push({"produk.warna": data}))
    }

    if (kategori) {
        query["produk.etalase"] = mongoose.Types.ObjectId(kategori)
    }

    if (jenis) {
        jenis.forEach(data => $or.push({"produk.jenis": mongoose.Types.ObjectId(data)}))
    }

    if (hargaAwal && hargaAkhir) {
        if (hargaAwal > hargaAkhir) {
            return res.status(400).json({message: "harga awal lebih gede dari harga akhir"})
        }

        query["produk.harga"] = {
            $gt: hargaAwal,
            $lt: hargaAkhir
        }
    }

    toko.aggregate([
        {$unwind: '$produk'},
        {$match: {$or, ...query}},
        {$group: {_id: '$_id', produk: {$push: '$produk'}, foto_profil: {$first: '$foto_profil'}}}
    ])
        .then(async data => {
            res.status(200).json({data, prefix: "uploads/produk"})
            Promise.all(data.map(produkData => {
                    const produkTemp = []
                    if (produkData.produk) {
                        produkData.produk.map(data => {

                        })
                    }
                }
            ))
            const produkTemp = []
            // console.log(produk)
            await Promise.all(produk.map(async data =>
                data.jenis ?
                    await kategori.find({"jenis._id": data.jenis})
                        .select("jenis.label jenis._id")
                        .lean()
                        .then(kategoriJenis => {
                            if (kategoriJenis[0].jenis) {
                                kategoriJenis[0].jenis.forEach(({_id, label}) => {
                                    if (_id.toString() == data.jenis.toString()) {
                                        data.jenis = label
                                        return produkTemp.push(data)
                                    }
                                })
                            }
                        })
                    : []
            ))
                .then(() => {
                })
                .catch(err => res.status(500).json(err))
        })
}

exports.searchProduk = (req, res) => {
    const {nama_produk} = req.body

    toko.aggregate([
        {$unwind: '$produk'},
        {$match: {"produk.nama_produk": {$regex: `(?i)${nama_produk}.*`}}},
        {$group: {_id: '$_id', produk: {$push: '$produk'}}}
    ])
        .then(data => res.status(200).json({data, prefix: "uploads/produk"}))
        .catch(err => res.status(500).json(err))
}

exports.listFilterProduk = (req, res) => {
    kategori.find()
        .lean()
        .then(data =>
            toko.find({approve: 2})
                .select("merek")
                .lean()
                .then(merek =>
                    res.status(200).json({
                        data: {kategoriJenis: data, merek},
                        prefix: {kategori: "uploads/kategori", jenis: "uploads/jenis"}
                    })
                )
                .catch(err => res.status(500).json(err))
        )
        .catch(err => res.status(500).json(err))
}

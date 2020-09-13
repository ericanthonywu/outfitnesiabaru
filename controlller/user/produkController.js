const {toko, kategori} = require('../../model')
const mongoose = require("mongoose");

exports.filterProduk = (req, res) => {
    const {merek, warna, kategori, jenis, hargaAwal, hargaAkhir, skip, limit} = req.body

    let query = {}
    const $and = []

    if (merek) {
        $and.push({$or: merek.map(id => ({_id: mongoose.Types.ObjectId(id)}))})
        // merek.forEach(data => or.push({_id: mongoose.Types.ObjectId(data)}))
    }

    if (warna) {
        $and.push({$or: warna.map(warna => ({"produk.warna": warna}))})
        // warna.forEach(data => or.push({"produk.warna": data}))
    }

    if (kategori) {
        query["produk.etalase"] = mongoose.Types.ObjectId(kategori)
    }

    if (jenis) {
        $and.push({$or: jenis.map(id => ({"produk.jenis": mongoose.Types.ObjectId(id)}))})
        // jenis.forEach(data => or.push({"produk.jenis": mongoose.Types.ObjectId(data)}))
    }

    if (hargaAwal !== '') {
        query["produk.harga"] = {
            $gte: parseInt(hargaAwal),
        }
    }
    if (hargaAkhir !== '') {
        query["produk.harga"] = {
            $lte: parseInt(hargaAkhir)
        }
    }

    if ($and.length > 0) {
        query = {$and, ...query}
    }

    toko.aggregate([
        {$unwind: '$produk'},
        {$match: query},
        {
            $lookup: {
                from: "kategoris",
                as: "produk.etalase",
                let: {pjid: "$produk.jenis"},
                pipeline: [
                    {$unwind: "$jenis"},
                    {$match: {$expr: {$eq: ["$$pjid", "$jenis._id"]}}},
                    {
                        $project: {
                            "jenis._id": 1,
                            "jenis.label": 1
                        }
                    }
                ]
            }
        },
        {$unwind: {path: "$produk.etalase"}},
        {$group: {_id: '$_id', produk: {$push: '$produk'}, foto_profil: {$first: '$foto_profil'}}},
    ])
        .then(async data => {
            res.status(200).json({data, prefix: {produk: "uploads/produk", toko: "uploads/toko"}})
            // Promise.all(data.map(produkData => {
            //         const produkTemp = []
            //         if (produkData.produk) {
            //             produkData.produk.map(data => {
            //
            //             })
            //         }
            //     }
            // ))
            // const produkTemp = []
            // // console.log(produk)
            // await Promise.all(produk.map(async data =>
            //     data.jenis ?
            //         await kategori.find({"jenis._id": data.jenis})
            //             .select("jenis.label jenis._id")
            //             .lean()
            //             .then(kategoriJenis => {
            //                 if (kategoriJenis[0].jenis) {
            //                     kategoriJenis[0].jenis.forEach(({_id, label}) => {
            //                         if (_id.toString() == data.jenis.toString()) {
            //                             data.jenis = label
            //                             return produkTemp.push(data)
            //                         }
            //                     })
            //                 }
            //             })
            //         : []
            // ))
            //     .then(() => {
            //     })
            //     .catch(err => res.status(500).json(err))
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

const {toko, kategori} = require('../../model')
const mongoose = require("mongoose");

exports.filterProduk = (req, res) => {
    const {merek, warna, kategori, jenis, hargaAwal, hargaAkhir, skip, limit} = req.body

    let query = {}
    const $and = []

    if (merek) {
        $and.push({$or: merek.map(id => ({_id: mongoose.Types.ObjectId(id)}))})
    }

    if (warna) {
        $and.push({$or: warna.map(warna => ({"produk.warna": warna}))})
    }

    if (kategori) {
        query["produk.etalase"] = mongoose.Types.ObjectId(kategori)
    }

    if (jenis) {
        $and.push({$or: jenis.map(id => ({"produk.jenis": mongoose.Types.ObjectId(id)}))})
    }

    // if (hargaAwal !== '') {
    //     query["produk.harga"] = {
    //         $gte: parseInt(hargaAwal),
    //     }
    // }
    if (hargaAkhir !== '') {
        query["produk.harga"] = {
            $lte: parseInt(hargaAkhir)
        }
    }

    if ($and.length > 0) {
        query = {$and, ...query}
    }

    toko.aggregate([
        {$match: query},
        {$unwind: '$produk'},
        {$match: query},
        {
            $lookup: {
                from: "kategoris",
                as: "produk.jenisnya",
                let: {
                    pjid: "$produk.jenis"
                },
                pipeline: [
                    {
                        $unwind: "$jenis"
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    "$$pjid",
                                    "$jenis._id"
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            "jenis._id": 1,
                            "jenis.label": 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$produk.jenisnya"
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    produk_id: "$produk._id"
                },
                root: {
                    $first: "$$ROOT"
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            foto_profil: "$root.foto_profil"
                        },
                        "$root.produk"
                    ]
                }
            }
        },
        {
            $skip: 0
        },
        {
            $limit: 20
        }
    ])
        .then(data => res.status(200).json({data, prefix: {produk: "uploads/produk", toko: "uploads/toko"}}))
        .catch(err => res.status(500).json(err))
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

const {toko, kategori} = require('../../model')

exports.filterProduk = (req, res) => {
    const {merek, warna, kategori, jenis, hargaAwal, hargaAkhir} = req.body

    const query = {}

    if (merek) {
        query["merek"] = merek
    }

    if (warna) {
        query["produk.warna"] = warna
    }

    if (kategori) {
        query["produk.kategori"] = kategori
    }

    if (jenis) {
        query["produk.jenis"] = jenis
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
        {$match: query},
        {$group: {_id: '$_id', produk: {$push: '$produk'}}}
    ])
        .then(data => res.status(200).json({data, prefix: "uploads/produk"}))
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

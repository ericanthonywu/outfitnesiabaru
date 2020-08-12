const {toko} = require('../../model')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

exports.showProduk = (req, res) => {
    toko.findById(res.userData.id)
        .select("etalase")
        .lean()
        .then(data => {
        if (data.etalase) {
            toko.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(res.userData.id)}},
                {$unwind: '$produk'},
                {
                    $match: {
                        "$or": data.etalase.map(data => ({'produk.etalase': mongoose.Types.ObjectId(data)}))
                    }
                },
                {$group: {_id: '$_id', produk: {$push: '$produk'}}}
            ]).then(data => {
                return res.status(200).json(data)
                res.status(200).json({data: data[0].produk, prefix: "uploads/produk"})
            })
                .catch(err => res.status(500).json(err))
        }else{
            res.status(200).json({data: [], prefix: "uploads/produk"})
        }
    })
}

exports.showAllTokoProduk = (req, res) => {
    toko.findById(res.userData.id).select('produk').lean()
        .then(({produk}) => res.status(200).json({data: produk, prefix: "uploads/produk"}))
        .catch(err => res.status(500).json(err))
}

exports.addProduk = async (req, res) => {
    const {etalase, nama_produk, jenis, bahan, warna, harga, link_bukalapak, link_shopee, link_tokopedia, deskripsi} = req.body
    if (!req.files) {
        return res.status(400).json({message: "Foto Produk required"})
    }

    toko.findByIdAndUpdate(res.userData.id, {
        $push: {
            produk: {
                nama_produk,
                etalase,
                jenis,
                bahan,
                warna,
                harga,
                link_bukalapak,
                link_shopee,
                link_tokopedia,
                deskripsi,
                foto_produk: await req.files.map(({filename}) => filename)
            }
        }
    }).then(() => res.status(201).json({message: "Product added"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteProduk = (req, res) => {
    const {produkId} = req.body
    toko.findById(res.userData.id).select("produk").then(({produk}) => {
        produk.forEach(({_id, foto_produk}) => {
            if (_id == produkId) {
                foto_produk.forEach(gambar => fs.unlinkSync(path.join(__dirname, "../../uploads/jenis/" + gambar)))
            }
        })
    })

    toko.findByIdAndUpdate(res.userData.id, {
        $pull: {
            produk: {_id: produkId}
        }
    }).then(() => res.status(202).json({message: "Product deleted"}))
        .catch(err => res.status(500).json(err))
}

const {banner, toko} = require("../../model");
const mongoose = require("mongoose");

exports.carrouselAdmin = (req, res) => {
    banner.find()
        .select("gambar link")
        .sort({order: -1})
        .lean()
        .then(data => res.status(200).json({data, prefix: 'uploads/banner'}))
        .catch(err => res.status(500).json(err))
}

exports.getListMerekTokoPopuler = (req, res) => {
    toko.find({
        approve: 2,
        populer: true,
    })
        .select("foto_profil username merek produk.nama_produk produk.foto_produk")
        .lean()
        .then(data => res.status(200).json({data, prefix: "uploads/produk"}))
        .catch(err => res.status(500).json(err))
}

exports.toggleFollow = (req, res) => {
    const {status, tokoId} = req.body

    switch (status) {
        case 0: // unfollow
            toko.findByIdAndUpdate(tokoId, {
                $pull: {
                    follower: res.userData.id
                }
            }).then(() => res.status(200).json({message: "Unfollow success"}))
                .catch(err => res.status(500).json(err))
            break;
        case 1: // follow
            toko.findByIdAndUpdate(tokoId, {
                $push: {
                    follower: res.userData.id
                }
            }).then(() => res.status(200).json({message: "Follow success"}))
                .catch(err => res.status(500).json(err))
            break;
        default:
            res.status(400).json({message: "Status invalid"})
    }
}

exports.getTokoById = (req, res) => {
    const {id} = req.body
    toko.findById(id)
        .select({
            _id: 0,
            username: 1,
            merek: 1,
            listMerek: 1,
            deskripsi: 1,
            follower: 1,
            email: 1,
            instagram: 1,
            whatsapp: 1,
            website: 1,
            alamat: 1,
            foto_profil: 1,
            bukalapak: 1,
            shopee: 1,
            tokopedia: 1,
            fotoktp: 1,
            banner: 1,
            approve: 1,
            populer: 1,
            etalase: 1
        })
        .lean()
        .then(async allData => {
            allData.produk = []
            if (allData.etalase.length > 0) {
                toko.aggregate([
                    {$match: {_id: mongoose.Types.ObjectId(id)}},
                    {$unwind: '$produk'},
                    {
                        $match: {
                            "$or": await allData.etalase.map(data => ({'produk.etalase': mongoose.Types.ObjectId(data)}))
                        }
                    },
                    {$group: {_id: '$_id', produk: {$push: '$produk'}}}
                ]).then(data => {
                    allData.produk = data[0].produk
                    res.status(200).json({
                        data: allData,
                        prefix: {
                            banner: "uploads/banner",
                            produk: "uploads/produk",
                            toko: "uploads/bannerToko"
                        }
                    })
                }).catch(err => res.status(500).json(err))
            }else{
                res.status(200).json({
                    data: allData,
                    prefix: {
                        banner: "uploads/banner",
                        produk: "uploads/produk",
                        toko: "uploads/bannerToko"
                    }
                })
            }
        }).catch(err => res.status(500).json(err))
}
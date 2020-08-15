const {banner, toko, kategori} = require("../../model");
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
        .populate("etalase", "label")
        .lean()
        .then(async allData => {
            allData.produk = []
            if (allData.etalase.length > 0) {
                toko.aggregate([
                    {$match: {_id: mongoose.Types.ObjectId(id)}},
                    {$unwind: '$produk'},
                    {
                        $match: {
                            "$or": await allData.etalase.map(({_id}) => ({'produk.etalase': mongoose.Types.ObjectId(_id)}))
                        }
                    },
                    {$group: {_id: '$_id', produk: {$push: '$produk'}}},
                    {
                        $lookup: {
                            "from": "kategoris",
                            "localField": "produk.jenis",
                            "foreignField": "jenis._id",
                            "as": "jenisnya"
                        }
                    }
                ]).then(async data => {
                    if (data.length > 0) {
                        // allData.produk = data[0].produk
                        const produk  = []
                        await Promise.all(data[0].produk.forEach(produkData => {
                            if (produkData.jenis) {
                                kategori.aggregate([
                                    {$unwind: '$jenis'},
                                    {$match: {'jenis._id': mongoose.Types.ObjectId(produkData.jenis)}},
                                    {
                                        $group: {
                                            _id: '$_id',
                                            label: {$push: '$jenis.label'},
                                        }
                                    }
                                ]).then(jenis => produk.push(jenis));
                            }
                        })).then(() => {
                            return res.status(200).json(produk)
                            res.status(200).json({
                                data: allData,
                                prefix: {
                                    banner: "uploads/bannerToko",
                                    produk: "uploads/produk",
                                    toko: "uploads/toko"
                                }
                            })
                        })
                    } else {
                        res.status(200).json({
                            data: allData,
                            prefix: {
                                banner: "uploads/bannerToko",
                                produk: "uploads/produk",
                                toko: "uploads/toko"
                            }
                        })
                    }
                }).catch(err => res.status(500).json(err))
            } else {
                res.status(200).json({
                    data: allData,
                    prefix: {
                        banner: "uploads/bannerToko",
                        produk: "uploads/produk",
                        toko: "uploads/toko"
                    }
                })
            }
        }).catch(err => res.status(500).json(err))
}

exports.findTokoByAlphabet = (req, res) => {
    const {alphabet} = req.body
    if (alphabet.length !== 1) {
        return res.status(400).json({message: "Invalid alphabet"})
    }
    toko.find({merek: {$regex: '^' + alphabet, $options: 'i'}})
        .select('merek foto_profil')
        .lean()
        .then(data => res.status(data.length ? 200 : 404).json({data, prefix: "uploads/toko"}))
        .catch(error => res.status(500).json(error))
}
const {banner, toko, poster} = require("../../model");
const mongoose = require("mongoose");

exports.carrouselAdmin = (req, res) => {
    banner.find()
        .select("gambar link")
        .sort({order: -1})
        .lean()
        .then(data => res.status(200).json({data, prefix: 'uploads/banner'}))
        .catch(err => res.status(500).json(err))
}

exports.poster = (req, res) => {
    poster.find().lean().then(data => res.status(200).json({data, prefix: 'uploads/poster'}))
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

/**
 * @param {any} req
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} res
 */
exports.getTokoById = (req, res) => {
    const {id} = req.body
    toko.findById(id)
        .select('etalase')
        .populate("etalase", "label")
        .lean()
        .then(async etalaseData => {
            if (!etalaseData) {
                return res.status(404).json({message: "Toko id not found"})
            }
            toko.aggregate([
                {$match: {_id: mongoose.Types.ObjectId(id)}},
                {$unwind: '$produk'},
                {
                    $match: etalaseData.etalase.length ? {
                        "$or": await etalaseData.etalase.map(data => ({'produk.etalase': mongoose.Types.ObjectId(data._id)}))
                    } : {},
                },
                {$unwind: "$produk"},
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
                {
                    $group: {
                        _id: "$_id",
                        produk: {$push: "$produk"},
                        username: {$first: "$username"},
                        merek: {$first: "$merek"},
                        listMerek: {$first: "$listMerek"},
                        deskripsi: {$first: "$deskripsi"},
                        follower: {$first: "$follower"},
                        email: {$first: "$email"},
                        instagram: {$first: "$instagram"},
                        whatsapp: {$first: "$whatsapp"},
                        website: {$first: "$website"},
                        alamat: {$first: "$alamat"},
                        foto_profil: {$first: "$foto_profil"},
                        bukalapak: {$first: "$bukalapak"},
                        shopee: {$first: "$shopee"},
                        tokopedia: {$first: "$tokopedia"},
                        fotoktp: {$first: "$fotoktp"},
                        banner: {$first: "$banner"},
                        populer: {$first: "$populer"},
                    }
                },
                {
                    $project: {
                        _id: 1,
                        produk: 1,
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
                        populer: 1,
                    }
                }
            ]).then(resultData => {
                const data = resultData[0]
                if (data) {
                    data.etalase = etalaseData.etalase

                    res.status(200).json({
                        data,
                        prefix: {
                            banner: "uploads/bannerToko",
                            produk: "uploads/produk",
                            toko: "uploads/toko"
                        }
                    })
                } else {
                    toko.findById(id).select({
                        _id: 1,
                        produk: 1,
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
                        populer: 1,
                        produk: 1
                    }).lean().then(data => res.status(200).json({
                        data: {...data, ...etalaseData},
                        prefix: {
                            banner: "uploads/bannerToko",
                            produk: "uploads/produk",
                            toko: "uploads/toko"
                        }
                    }))
                }
            })
        })
}
/**
 * @param {any} req
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} res
 */
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

/**
 * @param {any} req
 * @param {Request<P, ResBody, ReqBody, ReqQuery>|http.ServerResponse} res
 */
exports.merekPopuler = (req, res) => {
    toko.find({populer: true}).lean()
        .then(data =>
            res.status(200).json({
                data,
                prefix: {
                    profil: "uploads/toko",
                    populer: "uploads/merekPopuler"
                }
            }))
        .catch(error => res.status(500).json(error))
}

exports.showAllMerek = (req, res) => {
    toko.find({
        "produk.display": true
    })
        .select("merek produk foto_profil")
        .lean()
        .then(data => res.status(200).json({
            data, prefix: {
                toko: "uploads/toko",
                produk: "uploads/produk"
            }
        }))
        .catch(error => res.status(500).json(error))
}
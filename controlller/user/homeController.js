const {banner, toko} = require("../../model");

exports.carrouselAdmin = (req, res) => {
    banner.find()
        .select("gambar link")
        .sort({order: -1})
        .lean()
        .then(data => res.status(200).json({data, prefix: 'uploads/banner'}))
        .catch(err => res.status(500).json(err))
}

exports.getListMerekTokoPopuler = (req,res) => {
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

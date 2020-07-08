const {toko} = require('../../model')

exports.getProfile = (req, res) => {
    // toko.aggregate([
    //     {
    //         $project: {
    //             _id: 1,
    //             username: 1,
    //             merek: 1,
    //             deskripsi: 1,
    //             follower: {$size: "$follower"},
    //             email: 1,
    //             instagram: 1,
    //             whatsapp: 1,
    //             website: 1,
    //             alamat: 1,
    //             foto_profil: 1,
    //             bukalapak: 1,
    //             shopee: 1,
    //             tokopedia: 1
    //         },
    //     },
    //     {
    //         $match:{
    //             _id: res.userData.id
    //         },
    //     }
    // ]).then(data => res.status(200).json({data: data, prefix: 'uploads/toko'}))
    //     .catch(error => res.status(500).json(error))

    toko.findById(res.userData.id)
        .select('username merek deskripsi follower email instagram whatsapp website alamat foto_profil bukalapak shopee tokopedia')
        .lean()
        .then(data => res.status(200).json({data, prefix: 'uploads/toko'}))
        .catch(error => res.status(500).json(error))
}

exports.updateProfile = (req, res) => {
    const {username, merek, deskripsi, instagram, whatsapp, website, alamat, bukalapak, shopee, tokopedia} = req.body
    const updateData = {
        username,
        merek,
        deskripsi,
        instagram,
        whatsapp,
        website,
        alamat,
        bukalapak,
        shopee,
        tokopedia
    }
    if (req.file) {
        updateData.foto_profil = req.file.filename
    }
    toko.findByIdAndUpdate(res.userData.id, updateData).then(() => res.status(200).json())
        .catch(error => res.status(500).json(error))
}

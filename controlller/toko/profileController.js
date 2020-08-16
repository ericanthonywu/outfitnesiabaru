const {toko} = require('../../model')
const mongoose = require("mongoose");
const fs = require('fs')
const path = require('path')

exports.getProfile = (req, res) => {
    toko.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(res.userData.id)
            },
        },
        {
            $group: {
                _id: '$_id',
                // follower: {$size: 1}
            }
        },
        {
            $project: {
                _id: 1,
                username: 1,
                merek: 1,
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
                tokopedia: 1
            },
        },
    ]).then(data => res.status(200).json({data: data, prefix: 'uploads/toko'}))
        .catch(error => res.status(500).json(error))

    // toko.findById(res.userData.id)
    //     .select('username merek deskripsi follower email instagram whatsapp website alamat foto_profil bukalapak shopee tokopedia')
    //     .lean()
    //     .then(data => res.status(200).json({data, prefix: 'uploads/toko'}))
    //     .catch(error => res.status(500).json(error))
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
        toko.findById(res.userData.id)
            .select('foto_profil')
            .then(data => {
                if (data.foto_profil) {
                    fs.unlinkSync(path.join(__dirname, "../../uploads/toko/" + data.foto_profil))
                }
            })
        updateData.foto_profil = req.file.filename
    }
    toko.findByIdAndUpdate(res.userData.id, updateData)
        .then(() => res.status(202).json({message: "Profile updated"}))
        .catch(error => res.status(500).json(error))
}


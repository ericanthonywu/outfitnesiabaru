const {toko} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.getBanner = (req, res) => {
    toko.findById(res.userData.id)
        .select('banner')
        .lean()
        .then(data => {
                res.status(200).json({
                    data: data ? data.banner : [],
                    prefix: 'uploads/banner'
                })
            }
        )
        .catch(error => {
            res.status(500).json(error)
            console.log(error)
        })
}

exports.addBanner = (req, res) => {
    toko.findByIdAndUpdate(res.userData.id, {
        $push: {
            banner: {gambar: req.file.filename}
        }
    }).then(() => res.status(201).json({message: "Banner added"}))
        .catch(error => res.status(500).json(error))
}

exports.updateBanner = (req, res) => {
    const {bannerId} = req.body
    toko.findOne({_id: res.userData.id, "banner._id": bannerId}).select("banner.gambar banner._id").then(data => {
        data.banner.forEach(({gambar, _id: id}) => {
            if (id === bannerId && gambar) {
                fs.unlinkSync(path.join(__dirname, "../../uploads/toko/" + gambar))
            }
        })
    })
    toko.findOneAndUpdate({_id: res.userData.id, "banner._id": bannerId}, {
        $set: {
            "banner.$.gambar": req.file.filename,
        }
    })
        .then(() => res.status(202).json({message: "Banner updated"}))
        .catch(error => res.status(500).json(error))
}

exports.deleteBanner = (req, res) => {
    const {bannerId} = req.body
    toko.findOne({_id: res.userData.id, "banner._id": bannerId}).select("banner.gambar banner._id").then(data => {
        data.banner.forEach(({gambar, _id: id}) => {
            if (id === bannerId && gambar) {
                fs.unlinkSync(path.join(__dirname, "../../uploads/toko/" + gambar))
            }
        })
    })

    toko.findOneAndUpdate({_id: res.userData.id, "banner._id": bannerId}, {
        $pull: {"banner.id": bannerId}
    })
        .then(() => res.status(202).json({message: "Banner deleted"}))
        .catch(error => res.status(500).json(error))
}

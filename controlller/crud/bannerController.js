const {banner} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.showBanner = (req, res) => {
    banner.find()
        .sort({order: 1})
        .select("gambar order")
        .lean()
        .then(data => res.status(200).json({data, prefix: 'uploads/banner'}))
        .catch(err => res.status(500).json(err))
}

exports.addBanner = (req, res) => {
    const {order, link} = req.body
    if (!req.file) {
        return res.status(400).json({message: "Image needed"})
    }

    new banner({
        gambar: req.file.filename,
        order,
        link
    }).save()
        .then(() => res.status(201).json({message: "Banner added"}))
        .catch(err => {
            res.status(500).json(err)
            fs.unlinkSync(path.join(__dirname, "../../uploads/banner/" + req.file.filename))
        })
}

exports.editBanner = async (req, res) => {
    const {id, link} = req.body
    const updateData = {link}

    if (req.file) {
        updateData.gambar = req.file.filename
        await banner.findById(id)
            .select("gambar")
            .lean()
            .then(({gambar}) => {
                if (gambar) {
                    fs.unlinkSync(path.join(__dirname, "../../uploads/banner/" + gambar))
                }
            })
    }

    banner.findByIdAndUpdate(id, updateData)
        .then(() => res.status(202).json({message: "Banner Updated"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteBanner = (req, res) => {
    const {id} = req.body

    banner.findById(id).select('gambar').lean().then(({gambar}) => {
        if (gambar) {
            fs.unlinkSync(path.join(__dirname, "../../uploads/banner/" + gambar))
        }
    })
    banner.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: "Banner deleted"}))
        .catch(err => res.status(500).json(err))
}

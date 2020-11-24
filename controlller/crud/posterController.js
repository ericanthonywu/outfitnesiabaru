const {poster} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.showPoster = (req, res) => {
    poster.find()
        .populate("kategori")
        .lean()
        .then(data => res.status(200).json({data, prefix: "uploads/poster"}))
        .catch(err => res.status(500).json(err))
}

exports.addPoster = (req, res) => {
    new poster({
        gambar: req.file.filename,
        link: req.body.link,
        kategori: req.body.kategori
    }).save()
        .then(() => res.status(201).json({message: "poster created"}))
        .catch(err => res.status(500).json(err))
}

exports.editPoster = (req, res) => {
    const {id, link, kategori} = req.body
    const update = {link, kategori}

    if (req.file) {
        update.gambar = req.file.filename
        poster.findById(id).select("gambar").lean().then(data => {
            fs.unlinkSync(path.join(__dirname, "../../uploads/poster/" + data.gambar))
        })
    }

    poster.findByIdAndUpdate(id, update)
        .then(() => res.status(200).json({message: "poster updated"}))
        .catch(err => res.status(500).json(err))
}

exports.deletePoster = (req, res) => {
    const {id} = req.body
    poster.findById(id).select("gambar").lean().then(data => {
        fs.unlinkSync(path.join(__dirname, "../../uploads/poster/" + data.gambar))
    })

    poster.findByIdAndDelete(id)
        .then(() => res.status(202).json({message: "poster deleted"}))
        .catch(err => res.status(500).json(err))
}

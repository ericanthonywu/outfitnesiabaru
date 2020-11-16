const {artikel} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.showArtikel = (req, res) => {
    const {pagination = 1, limit = 10} = req.body
    if (pagination < 1) {
        return res.status(400).json({message: "pagination must be 1 or more"})
    }

    artikel.find()
        .populate("kategori")
        .lean()
        .limit(limit)
        .skip((pagination - 1) * limit)
        .then(data => res.status(200).json({message: "list artikel kategori", data: {data, prefix: "uploads/cover"}}))
        .catch(err => res.status(500).json(err))
}

exports.addArtikel = (req, res) => {
    const {judul, kategori, penulis, tulisan, hot, sinopsis} = req.body
    // if (!judul || !kategori || !penulis || !tulisan || typeof hot !== "boolean"){
    //     return res.status(400).json({message: "judul, kategori, penulis, tulisan dan hot needed"})
    // }
    new artikel({
        judul,
        kategori,
        penulis,
        tulisan,
        hot,
        sinopsis,
        cover: req.file.filename
    }).save()
        .then(() => res.status(201).json({message: "artikel added"}))
        .catch(err => res.status(500).json(err))
}

exports.editArtikel = (req, res) => {
    const {id, judul, kategori, penulis, tulisan, hot, sinopsis} = req.body
    // if (!judul || !kategori || !penulis || !tulisan || typeof hot !== "boolean"){
    //     return res.status(400).json({message: "judul, kategori, penulis, tulisan dan hot needed"})
    // }
    const updateData = {
        judul,
        kategori,
        penulis,
        tulisan,
        hot,
        sinopsis
    }

    if (req.file) {
        updateData.cover = req.file.filename
    }

    artikel.findByIdAndUpdate(id, updateData)
        .then(() => res.status(200).json({message: "artikel edited"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteArtikel = (req, res) => {
    const {id} = req.body
    artikel.findById(id).select("cover").lean()
        .then(cover =>
            fs.unlinkSync(path.join(__dirname, "../../uploads/cover/" + cover))
        )
    artikel.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: "artikel deleted"}))
        .catch(err => res.status(500).json(err))
}

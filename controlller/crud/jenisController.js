const {kategori} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.showJenis = (req, res) => {
    const {kategoriId} = req.body
    kategori.findById(kategoriId)
        .select('jenis.label jenis.gambar')
        .lean()
        .then(({jenis: data}) => res.status(200).json({data, prefix: 'uploads/jenis'}))
        .catch(err => res.status(500).json(err))
}

exports.addJenis = ({body: {label, kategoriId}, file: {filename: gambar}}, res) => {
    kategori.findByIdAndUpdate(kategoriId, {
        $push: {
            jenis: {
                label,
                gambar
            }
        }
    })
        .then(() => res.status(201).json({message: "Jenis added"}))
        .catch(err => res.status(500).json(err))
}

exports.editJenis = async (req, res) => {
    const {id, label} = req.body
    const updateData = {label}
    if (req.file.filename) {
        updateData['gambar'] = req.file.filename
        await kategori.findById(id)
            .select("gambar")
            .lean()
            .then(({gambar}) => {
                fs.unlinkSync(path.join(__dirname, "../uploads/jenis/" + gambar))
            })
    }

    kategori.findByIdAndUpdate(id, {
        $set: {
            jenis: updateData
        }
    })
        .then(() => res.status(202).json({message: "jenis Updated"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteJenis = (req, res) => {
    const {kategoriId, jenisId} = req.body
    kategori.findByIdAndUpdate(kategoriId, {$pull: {jenis: jenisId}})
        .then(() => res.status(202).json({message: "jenis deleted"}))
        .catch(err => res.status(500).json(err))
}

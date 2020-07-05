const {kategori} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.showKategori = (req, res) =>
    kategori.find()
        .select('label gambar')
        .then(data => res.status(200).json({data, prefix: 'uploads/kategori'}))
        .catch(err => res.status(500).json(err))

exports.addKategori = ({body: {label}, file: {filename: gambar}}, res) => {
    kategori.insert({label, gambar})
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json(err))
}

exports.editKategori = async (req, res) => {
    const {id, label} = req.body
    const updateData = {label}
    if (req.file.filename) {
        updateData['gambar'] = req.file.filename
        await kategori.findById(id)
            .select("gambar")
            .lean()
            .then(({gambar}) => {
                fs.unlinkSync(path.join(__dirname, "../uploads/kategori/" + gambar))
            })
    }

    kategori.findByIdAndUpdate(id, updateData)
        .then(() => res.status(202).json({message: "Kategori Updated"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteKategori = (req,res) => {
    const {id} = req.body
    kategori.findByIdAndDelete(id)
        .then(() => res.status(202).json({message: "Kategori deleted"}))
        .catch(err => res.status(500).json(err))
}

const {kategori} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.showKategori = (req, res) =>
    kategori.find()
        .select('label gambar')
        .lean()
        .then(data => res.status(200).json({data, prefix: 'uploads/kategori'}))
        .catch(err => res.status(500).json(err))

exports.addKategori = ({body: {label}, file: {filename: gambar}}, res) =>
    new kategori({label, gambar})
        .save()
        .then(() => res.status(201).json({message: "Kategori added"}))
        .catch(err => res.status(500).json(err))


exports.editKategori = (req, res) => {
    const {id, label} = req.body
    const updateData = {label}

    if (req.file) {
        updateData['gambar'] = req.file.filename
        kategori.findById(id)
            .select("gambar")
            .lean()
            .then(({gambar}) => fs.unlinkSync(path.join(__dirname, "../../uploads/kategori/" + gambar)))
    }

    kategori.findByIdAndUpdate(id, updateData)
        .then(() => res.status(202).json({message: "Kategori Updated"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteKategori = (req,res) => {
    const {id} = req.body
    kategori.findById(id)
        .select("gambar jenis")
        .lean()
        .then(data => {
            if (data || data.gambar) {
                fs.unlinkSync(path.join(__dirname, "../../uploads/kategori/" + data.gambar))
            }
            data.jenis.forEach(({gambar}) =>
                fs.unlinkSync(path.join(__dirname, "../../uploads/jenis/" + gambar))
            )
        })
    kategori.findByIdAndDelete(id)
        .then(() => res.status(202).json({message: "Kategori deleted"}))
        .catch(err => res.status(500).json(err))
}

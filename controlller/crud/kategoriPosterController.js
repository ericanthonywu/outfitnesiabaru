const {kategoriPoster} = require('../../model')

exports.showKategoriPoster = (req, res) => {
    kategoriPoster.find().lean()
        .then(data => res.status(201).json({message: "success", data}))
        .catch(err => res.status(500).json(err))
}

exports.addKategoriPoster = (req, res) => {
    const {nama} = req.body
    new kategoriPoster({nama}).save()
        .then(() => res.status(201).json({message: "success"}))
        .catch(err => res.status(500).json(err))
}

exports.editKategoriPoster = (req, res) => {
    const {id, nama} = req.body
    kategoriPoster.findByIdAndUpdate(id, {nama})
        .then(() => res.status(200).json({message: "success"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteKategoriPoster = (req,res) => {
    const {id} = req.body
    kategoriPoster.findByIdAndDelete(id)
        .then(() => res.status(202).json({message: "success"}))
        .catch(err => res.status(500).json(err))
}

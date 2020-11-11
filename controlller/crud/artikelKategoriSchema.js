const {artikelKategori} = require('../../model')

exports.showArtikelKategori = (req,res) => {
    artikelKategori.find()
        .lean()
        .then(data => res.status(200).json({message: "list artikel kategori", data}))
        .catch(err => res.status(500).json(err))
}

exports.addArtikelKategori = (req,res) => {
    const {nama} = req.body
    if (!nama){
        return res.status(400).json({message: "nama needed"})
    }
    new artikelKategori({
        nama
    }).save()
        .then(() => res.status(201).json({message: "kategori added"}))
        .catch(err => res.status(500).json(err))
}

exports.editArtikelKategori = (req,res) => {
    const {nama,id} = req.body
    if (!nama){
        return res.status(400).json({message: "nama needed"})
    }

    artikelKategori.findByIdAndUpdate(id, {nama})
        .then(() => res.status(200).json({message: "kategori edited"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteArtikelKategori = (req,res) => {
    const {id} = req.body
    artikelKategori.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: "kategori deleted"}))
        .catch(err => res.status(500).json(err))
}

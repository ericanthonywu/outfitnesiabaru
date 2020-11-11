const {artikel} = require('../../model')

exports.showArtikel = (req,res) => {
    const {pagination = 1, limit = 10} = req.body
    if (pagination < 1){
        return res.status(400).json({message: "pagination must be 1 or more"})
    }

    artikel.find()
        .populate("kategori")
        .lean()
        .then(data => res.status(200).json({message: "list artikel kategori", data}))
        .catch(err => res.status(500).json(err))
}

exports.addArtikel = (req,res) => {
    const {judul, kategori, penulis, tulisan, hot} = req.body
    if (!judul || kategori || penulis || tulisan || hot){
        return res.status(400).json({message: "judul, kategori, penulis, tulisan dan hot needed"})
    }
    new artikel({
        judul,
        kategori,
        penulis,
        tulisan,
        hot
    }).save()
        .then(() => res.status(201).json({message: "artikel added"}))
        .catch(err => res.status(500).json(err))
}

exports.editArtikel = (req,res) => {
    const {id, judul, kategori, penulis, tulisan, hot} = req.body
    if (!judul || kategori || penulis || tulisan || hot){
        return res.status(400).json({message: "judul, kategori, penulis, tulisan dan hot needed"})
    }
    artikel.findByIdAndUpdate(id, {
        judul,
        kategori,
        penulis,
        tulisan,
        hot
    })
        .then(() => res.status(200).json({message: "artikel edited"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteArtikel = (req,res) => {
    const {id} = req.body
    artikel.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: "artikel deleted"}))
        .catch(err => res.status(500).json(err))
}

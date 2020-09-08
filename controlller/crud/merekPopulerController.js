const {toko} = require('../../model')
const fs = require('fs')
const path = require('path')
exports.getListTokoMerekPopuler = (req, res) => {
    const {limit, offset} = req.body

    toko.find({
        approve: 2,
        populer: true
    })
        .select("foto_profil username merek produk.nama_produk produk.foto_produk gambar_populer")
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .lean()
        .then(data => res.status(200).json({data, prefix: {produk: "uploads/produk", populer: "uploads/merekPopuler"}}))
        .catch(err => res.status(500).json(err))
}

exports.addListTokoMerek = (req, res) => {
    const {tokoId} = req.body
    toko.findByIdAndUpdate(tokoId, {populer: true, gambar_populer: req.files.map(({filename}) => filename)})
        .then(() => res.status(200).json({message: "populer added"}))
        .catch(err => res.status(500).json(err))
}

exports.removeListTokoMerek = (req, res) => {
    const {tokoId} = req.body
    toko.findByIdAndUpdate(tokoId, {populer: false, gambar_populer: []})
        .then(() => res.status(200).json({message: "populer removed"}))
        .catch(err => res.status(500).json(err))

    toko.findById(tokoId)
        .select("gambar_populer")
        .lean()
        .then(({gambar_populer}) =>
            gambar_populer.forEach(populer =>
                fs.unlinkSync(path.join(__dirname, "../../uploads/merekPopuler/" + populer))
            )
        )
}

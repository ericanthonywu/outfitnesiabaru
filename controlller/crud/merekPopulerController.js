const {toko} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.getListTokoMerekPopuler = (req, res) => {
    const {limit, offset, populer} = req.body

    toko.find({
        approve: 2,
        populer
    })
        .select("foto_profil username merek gambar_populer")
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .lean()
        .then(data => res.status(200).json({data, prefix: {foto_profil: "uploads/toko", populer: "uploads/merekPopuler"}}))
        .catch(err => res.status(500).json(err))
}

exports.addListTokoMerek = (req, res) => {
    const {tokoId} = req.body
    toko.findByIdAndUpdate(tokoId, {populer: true})
        .then(() => res.status(200).json({message: "populer added"}))
        .catch(err => res.status(500).json(err))
}

exports.removeListTokoMerek = (req, res) => {
    const {tokoId} = req.body
    toko.findByIdAndUpdate(tokoId, {populer: false})
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

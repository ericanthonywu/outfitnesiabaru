const {toko} = require('../../model')

exports.getListTokoMerekPopuler = (req, res) => {
    const {limit, offset} = req.body

    toko.find()
        .select("foto_profil produk.nama_produk produk.foto_produk populer")
        .limit(limit)
        .skip(offset)
        .lean()
        .then(data => res.status(200).json({data, prefix: "uploads/produk"}))
        .catch(err => res.status(500).json(err))
}

exports.addListTokoMerek = (req, res) => {
    const {tokoId} = req.body
    toko.findByIdAndUpdate(tokoId, {populer: true})
        .then(() => res.status(200).json({message: "populer added"}))
        .catch(err => res.status(500).json(err))
}

exports.removeListTokoMerek = (req,res) => {
    const {tokoId} = req.body
    toko.findByIdAndUpdate(tokoId, {populer: false})
        .then(() => res.status(200).json({message: "populer added"}))
        .catch(err => res.status(500).json(err))
}
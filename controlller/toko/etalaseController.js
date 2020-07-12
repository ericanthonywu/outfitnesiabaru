const {toko, kategori} = require('../../model')

exports.getEtalaseList = async (req, res) => {
    kategori.find()
        .select('label')
        .lean()
        .then(data => {
            toko.findById(res.userData.id).select("etalase").populate("etalase","label gambar").then(({etalase}) =>
                res.status(200).json({etalaseList: data, etalaseToko: {data: etalase, prefix:"uploads/kategori"}})
            ).catch(err => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err))
}

exports.updateEtalaseList = (req, res) => {
    const {etalase} = req.body
    toko.findByIdAndUpdate(res.userData.id, {etalase})
        .then(() => res.status(202).json({message: "Etalase Updated"}))
        .catch(err => res.status(500).json(err))
}

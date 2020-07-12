const {toko} = require('../../model')
const mongoose = require('mongoose')

exports.getListMerek = (req, res) => {

    toko.findById(res.userData.id)
        .select("listMerek")
        .lean()
        .then(async ({listMerek}) => {
            const listphoto = []
            await Promise.all(listMerek.map(async data =>
                toko.aggregate([
                    {$match: {_id: mongoose.Types.ObjectId(res.userData.id)}},
                    {$unwind: '$produk'},
                    {$match: {'produk._id': mongoose.Types.ObjectId(data)}},
                    {$group: {_id: '$_id', produk: {$push: '$produk.foto_produk'}}}
                ]).then(foto => listphoto.push(foto[0].produk[0][0]))
            )).then(() => {
                res.status(200).json({
                    data: listphoto,
                    prefix: 'uploads/produk'
                })
            })
        })
        .catch(err => res.status(500).json(err))
}

exports.addMerek = (req, res) => {
    const {produkId} = req.body
    toko.findByIdAndUpdate(res.userData.id, {
        $push: {
            listMerek: produkId
        }
    }).then(() => res.status(201).json({message: "Data Created"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteMerek = (req, res) => {
    const {produkId} = req.body
    toko.findByIdAndUpdate(res.userData.id, {
        $pull: {
            listMerek: produkId
        }
    }).then(() => res.status(202).json({message: "Data Deleted"}))
        .catch(err => res.status(500).json(err))
}

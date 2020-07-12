const {kategori} = require('../../model')
const fs = require('fs')
const path = require('path')

exports.showJenis = (req, res) => {
    const {kategoriId} = req.body
    kategori.findById(kategoriId)
        .select('jenis.label jenis.gambar jenis._id')
        .lean()
        .then(({jenis: data}) => res.status(200).json({data, prefix: 'uploads/jenis'}))
        .catch(err => res.status(500).json(err))
}

exports.addJenis = ({body: {label, kategoriId}, file: {filename: gambar}}, res) => {
    kategori.findByIdAndUpdate(kategoriId, {
        $push: {
            jenis: {
                label,
                gambar
            }
        }
    })
        .then(() => res.status(201).json({message: "Jenis added"}))
        .catch(err => res.status(500).json(err))
}

exports.editJenis = (req, res) => {
    const {kategoriId, jenisId, label} = req.body
    const updateData = {"jenis.$.label": label}
    if (req.file) {
        updateData['jenis.$.gambar'] = req.file.filename
        kategori.findOne({_id: kategoriId, "jenis._id": jenisId})
            .select("gambar")
            .lean()
            .then(data => {
                if (data || data.gambar) {
                    fs.unlinkSync(path.join(__dirname, "../../uploads/jenis/" + data.gambar))
                }
            })
    }

    kategori.findOneAndUpdate({_id: kategoriId, "jenis._id": jenisId}, {
        $set: updateData
    })
        .then(() => res.status(202).json({message: "jenis Updated"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteJenis = (req, res) => {
    const {kategoriId, jenisId} = req.body
    kategori.findOne({_id: kategoriId, "jenis._id": jenisId})
        .select("gambar")
        .lean()
        .then(data => {
            if (data || data.gambar) {
                fs.unlinkSync(path.join(__dirname, "../../uploads/jenis/" + data.gambar))
            }
        })
    kategori.findByIdAndUpdate(kategoriId, {
        $pull: {
            jenis: {_id: jenisId}
        }
    })
        .then(() => res.status(202).json({message: "jenis deleted"}))
        .catch(err => res.status(500).json(err))
}

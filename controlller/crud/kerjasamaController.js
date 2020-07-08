const {toko} = require('../../model')

exports.getToko = (req, res) => {
    const {limit, offset} = req.body

    toko.find()
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .lean()
        .then(data => res.status(200).json({data, prefix: "uploads/KTPtoko"}))
        .catch(err => res.status(500).json(err))
}

exports.toogleStatusToko = (req, res) => {
    const {status, tokoId} = req.body
    if (!tokoId) {
        return res.status(400).json({message: "Toko ID Needed"})
    }

    if (status != 1 && status != 2) {
        return res.status(400).json({message: "Status must be 1 or 2"})
    }

    toko.findByIdAndUpdate(tokoId, {
        approve: status
    }).then(() => res.status(202).json({message: "Status Updated!"}))
        .catch(err => res.status(500).json(err))
}

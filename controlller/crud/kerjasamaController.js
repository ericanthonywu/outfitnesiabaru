const {toko} = require('../../model')

exports.getToko = (req, res) => {
    const {limit, offset} = req.body
    const query = toko.find()

    if (limit !== 'all') {
        query.skip(limit).offset(offset)
    }

    query.then(data => res.status(200).json({data, prefix: "uploads/KTPtoko"}))
        .catch(err => res.status(500).json(err))
}

exports.toogleStatusToko = (req, res) => {
    const {status, tokoId} = req.body
    if (!tokoId) {
        return res.status(400).json({message: "Toko ID Needed"})
    }

    if (status !== 1 || status !== 2) {
        return res.status(400).json({message: "Status must be 1 or 2"})
    }

    toko.findByIdAndUpdate(tokoId, {
        approve: status
    }).then(() => res.status(200).json())
        .catch(err => res.status(500).json(err))
}

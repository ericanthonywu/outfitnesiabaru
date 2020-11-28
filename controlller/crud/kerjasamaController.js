const {toko} = require('../../model')

exports.getToko = (req, res) => {
    const {limit, offset, approve = null} = req.body

    const query = {}

    if (approve !== null) {
        if (approve < 0 || approve > 2) {
            return res.status(400).json({message: "Approve must between 1-3"})
        } else {
            query.approve = approve
        }
    }

    toko.find(query)
        .select("merek alamat email instagram whatsapp fotoktp pilihan populer")
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

    if (status != 1 && status != 2 && status != 0) {
        return res.status(400).json({message: "Status must be 0 or 1 or 2"})
    }

    toko.findByIdAndUpdate(tokoId, {
        approve: status
    }).then(() => res.status(202).json({message: "Status Updated!"}))
        .catch(err => res.status(500).json(err))
}

exports.deleteTokoById = (req,res) => {
    const {tokoId} = req.body
    toko.findByIdAndDelete(tokoId)
        .then(() => res.status(202).json({message: "Toko Deleted!"}))
        .catch(err => res.status(500).json(err))
}

exports.tooglePilihan = (req,res) => {
    const {tokoId, pilihan} = req.body
    toko.findByIdAndUpdate(tokoId, {pilihan})
        .then(() => res.status(202).json({message: "Pilihan toko Updated!"}))
        .catch(err => res.status(500).json(err))
}

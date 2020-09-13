const {tentangKami} = require("../../model");

exports.updateTentangKami = (req,res) => {
    const {id, paragraf, html} = req.body

    tentangKami.findByIdAndUpdate(id,{paragraf, html})
        .then(() => res.status(200).json({message: "Tentang kami updated"}))
        .catch(err => res.status(500).json({err}))
}

exports.addTentangKami = (_,res) => {
    new tentangKami({
        paragraf: "lorem",
        html: "lorem",
    }).save().then(data => res.status(200).json({data}))
        .catch(err => res.status(500).json({err}))
}

exports.getTentangKami = (req,res) => {
    tentangKami.findOne()
        .lean()
        .then(data => res.status(200).json({data}))
        .catch(err => res.status(500).json({err}))
}

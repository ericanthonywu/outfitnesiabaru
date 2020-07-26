const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    const {token, role} = req.headers
    if (!token) return res.status(400).json({message: "Token auth required at header:token"})
    jwt.verify(token, process.env.JWTSECRETTOKEN, (err, data) => {
        if (err) {
            res.status(419).json(err)
            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    fs.unlinkSync(path.join(__dirname, `../uploads/${req.dest}/${req.files[i].filename}`))
                }
            } else if (req.file) {
                fs.unlinkSync(path.join(__dirname, `../uploads/${req.dest}/${req.file.filename}`))
            }
            return;
        }

        if (data.role !== role){
            return res.status(401).json({role: "isn't match"})
        }

        res.userData = data;
        next()
    })
}

const {user: User, admin: Admin, toko: Toko} = require('../model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.loginAdmin = (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"})
    }
    Admin.findOne({username}).select("username password")
        .lean()
        .then(data => {
            if (!data) {
                return res.status(404).json({message: "Username not found"})
            }
            bcrypt.compare(password, data.password).then(check => {
                if (!check) {
                    return res.status(403).json({message: "Password isn't correct"})
                }
                jwt.sign({id: data._id, username: data.username}, process.env.JWTSECRETTOKEN, {}, (err, token) => {
                    if (err) {
                        return res.status(500).json(err)
                    }
                    res.status(200).json({
                        message: "Login Success",
                        data: {
                            id: data._id,
                            token
                        }
                    })
                })
            }).catch(err => res.status(500).json(err))
        }).catch(err => res.status(500).json(err))
}

exports.loginUser = (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"})
    }

    User.findOne({username}).select("username password").lean().then(data => {
        if (!data) {
            return res.status(404).json({message: "Username not found"})
        }
        bcrypt.compare(password, data.password).then(check => {
            if (!check) {
                return res.status(403).json({message: "Password isn't correct"})
            }
            jwt.sign({id: data._id, username: data.username}, process.env.JWTSECRETTOKEN, {}, (err, token) => {
                if (err) {
                    return res.status(500).json(err)
                }
                res.status(200).json({
                    message: "Login Success",
                    data: {
                        id: data._id,
                        token
                    }
                })
            })
        }).catch(err => res.status(500).json(err))
    }).catch(err => res.status(500).json(err))
}

exports.registerUser = (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"})
    }

    new User({
        username,
        password: bcrypt.hashSync(password, 10)
    }).save()
        .then(() => res.status(201).json())
        .catch(err => res.status(500).json(err))
}

exports.loginToko = (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"})
    }

    Toko.findOne({username}).select("username password")
        .lean()
        .then(data => {
            if (!data) {
                return res.status(404).json({message: "Username not found"})
            }
            bcrypt.compare(password, data.password).then(check => {
                if (!check) {
                    return res.status(403).json({message: "Password isn't correct"})
                }
                jwt.sign({id: data._id, username: data.username}, process.env.JWTSECRETTOKEN, {}, (err, token) => {
                    if (err) {
                        return res.status(500).json(err)
                    }
                    res.status(200).json({
                        message: "Login Success",
                        data: {
                            id: data._id,
                            token
                        }
                    })
                })
            }).catch(err => res.status(500).json(err))
        }).catch(err => res.status(500).json(err))
}

exports.registerToko = (req, res) => {
    const {password, merek, alamat, whatsapp, instagram, line} = req.body
    bcrypt.hash(password, 10).then(password => {
        new Toko({
            password,
            merek,
            alamat,
            whatsapp,
            instagram,
            line,
            fotoktp: req.file.filename
        }).save()
            .then(() => res.status(201).json())
            .catch(err => res.status(500).json(err))
    })
}


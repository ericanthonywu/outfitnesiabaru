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

exports.migrateAdmin = (req, res) => {
    new Admin({
        username: "superadmin",
        password: bcrypt.hashSync('admin')
    }).save().then(() => res.status(200).json())
        .catch(err => res.status(500).json(err))
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
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({message: "Username and password required"})
    }

    Toko.findOne({email}).select("username password approve")
        .lean()
        .then(data => {
            if (!data) {
                return res.status(404).json({message: "Email not found"})
            }
            bcrypt.compare(password, data.password).then(check => {
                if (!check) {
                    return res.status(403).json({message: "Password isn't correct"})
                }

                switch (data.approve) {
                    case 0:
                        return res.status(403).json({message: "Your Toko hasn't been approved yet"})
                    case 1:
                        return res.status(403).json({message: "Toko has been rejected"})
                    case 2:
                        return jwt.sign({id: data._id, username: data.username}, process.env.JWTSECRETTOKEN, {}, (err, token) => {
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
                    default:
                        return res.status(403).json({message: "Toko status unknown"})
                }
            }).catch(err => res.status(500).json(err))
        }).catch(err => res.status(500).json(err))
}

exports.registerToko = (req, res) => {
    const {password, merek, alamat, whatsapp, instagram, line, email} = req.body
    bcrypt.hash(password, 10).then(password => {
        new Toko({
            password,
            merek,
            alamat,
            whatsapp,
            instagram,
            line,
            email,
            fotoktp: req.file.filename
        }).save()
            .then(() => res.status(201).json({message: "Register successfull! Waiting for admin's approval"}))
            .catch(err => res.status(500).json(err))
    })
}


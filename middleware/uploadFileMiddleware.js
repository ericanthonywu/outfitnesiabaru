const multer = require('multer')
const path = require('path')

exports.uploadKTPToko = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "KTPtoko";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

exports.gambarJenis = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "jenis";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

exports.gambarKategori = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "kategori";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

exports.gambarBanner = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "banner";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

exports.gambarProduk = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            req.dest = "produk";
            cb(null, path.join(__dirname, `../uploads/${req.dest}`))
        },
        filename: (req, file, cb) =>
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname.trim())
    }),
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

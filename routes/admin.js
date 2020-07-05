const express = require('express');
const {showJenis, addJenis, editJenis, deleteJenis} = require("../controlller/crud/jenisController");
const {showKategori, addKategori, editKategori, deleteKategori, } = require("../controlller/crud/kategoriController");
const {authMiddleware} = require("../middleware/authMiddleware");
const {loginAdmin} = require("../controlller/authController");
const router = express.Router();

router.post('/login', loginAdmin)

router.post('/showKategori', authMiddleware, showKategori)
router.post('/addKategori', authMiddleware, addKategori)
router.put('/editKategori', authMiddleware, editKategori)
router.post('/deleteKategori', authMiddleware, deleteKategori)

router.post('/showJenis', authMiddleware, showJenis)
router.post('/addJenis', authMiddleware, addJenis)
router.put('/editJenis', authMiddleware, editJenis)
router.post('/deleteJenis', authMiddleware, deleteJenis)


router.post('/')

module.exports = router;

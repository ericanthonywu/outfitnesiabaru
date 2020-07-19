const express = require('express');
const {getListTokoMerekPopuler, addListTokoMerek, removeListTokoMerek} = require("../controlller/crud/merekPopulerController");
const {gambarJenis, gambarKategori, gambarBanner} = require("../middleware/uploadFileMiddleware");
const {showJenis, addJenis, editJenis, deleteJenis} = require("../controlller/crud/jenisController");
const {showKategori, addKategori, editKategori, deleteKategori,} = require("../controlller/crud/kategoriController");
const {showBanner, addBanner, editBanner, deleteBanner} = require("../controlller/crud/bannerController");
const {authMiddleware} = require("../middleware/authMiddleware");
const {toogleStatusToko, getToko} = require("../controlller/crud/kerjasamaController");
const {loginAdmin, migrateAdmin} = require("../controlller/authController");
const router = express.Router();

router.post('/login', loginAdmin)
router.get('/migrateAdmin', migrateAdmin)

router.get('/showKategori', authMiddleware, showKategori)
router.post('/addKategori', authMiddleware, gambarKategori.single('gambar'), addKategori)
router.put('/editKategori', authMiddleware, gambarKategori.single('gambar'), editKategori)
router.post('/deleteKategori', authMiddleware, deleteKategori)

router.post('/showJenis', authMiddleware, showJenis)
router.post('/addJenis', authMiddleware, gambarJenis.single('gambar'), addJenis)
router.put('/editJenis', authMiddleware, gambarJenis.single('gambar'), editJenis)
router.post('/deleteJenis', authMiddleware, deleteJenis)

router.get('/showBanner', authMiddleware, showBanner)
router.post('/addBanner', authMiddleware, gambarBanner.single('gambar'), addBanner)
router.put('/editBanner', authMiddleware, gambarBanner.single('gambar'), editBanner)
router.post('/deleteBanner', authMiddleware, deleteBanner)

router.post('/getToko', authMiddleware, getToko)
router.post('/toogleStatusToko', authMiddleware, toogleStatusToko)

router.post('/getListTokoMerekPopuler', authMiddleware, getListTokoMerekPopuler)
router.post('/addListTokoMerek', authMiddleware, addListTokoMerek)
router.post('/removeListTokoMerek', authMiddleware, removeListTokoMerek)

module.exports = router;

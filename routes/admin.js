const express = require('express');
const {gambarJenis, gambarKategori} = require("../middleware/uploadFileMiddleware");
const {toogleStatusToko, getToko} = require("../controlller/crud/kerjasamaController");
const {showJenis, addJenis, editJenis, deleteJenis} = require("../controlller/crud/jenisController");
const {showKategori, addKategori, editKategori, deleteKategori,} = require("../controlller/crud/kategoriController");
const {authMiddleware} = require("../middleware/authMiddleware");
const {loginAdmin, migrateAdmin} = require("../controlller/authController");
const router = express.Router();

router.post('/login', loginAdmin)
router.get('/migrateAdmin', migrateAdmin)

router.post('/showKategori', authMiddleware, showKategori)
router.post('/addKategori', authMiddleware, gambarJenis.single('gambar'), addKategori)
router.put('/editKategori', authMiddleware, editKategori)
router.post('/deleteKategori', authMiddleware, deleteKategori)

router.post('/showJenis', authMiddleware, showJenis)
router.post('/addJenis', authMiddleware, gambarJenis.single('gambar'), addJenis)
router.put('/editJenis', authMiddleware, editJenis)
router.post('/deleteJenis', authMiddleware, deleteJenis)

router.post('/getToko', authMiddleware, getToko)
router.post('/toogleStatusToko', authMiddleware, toogleStatusToko)

module.exports = router;

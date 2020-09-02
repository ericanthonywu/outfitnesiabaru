const express = require('express');
const {getListMerek, addMerek, deleteMerek} = require("../controlller/toko/merekController");
const {gambarProduk} = require("../middleware/uploadFileMiddleware");
const {addProduk, showProduk, showAllTokoProduk, deleteProduk} = require("../controlller/toko/produkController");
const {getEtalaseList, updateEtalaseList, getListJenisByKategori} = require("../controlller/toko/etalaseController");
const {gambarProfilToko, gambarBannerToko} = require("../middleware/uploadFileMiddleware");
const {authMiddleware} = require("../middleware/authMiddleware");
const {updateProfile, getProfile} = require("../controlller/toko/profileController");
const {getBanner, addBanner, updateBanner, deleteBanner} = require("../controlller/toko/bannerController");
const {registerToko} = require("../controlller/authController");
const {uploadKTPToko} = require('../middleware/uploadFileMiddleware')
const router = express.Router();

router.post('/register', uploadKTPToko.single('foto_ktp'), registerToko)

router.get('/getProfile', authMiddleware, getProfile)
router.post('/updateProfile', authMiddleware, gambarProfilToko.single('foto_profil'), updateProfile)

router.get("/getBanner", authMiddleware, getBanner)
router.post("/addBanner", authMiddleware, gambarBannerToko.single("gambar"), addBanner)
router.put("/updateBanner", authMiddleware, gambarBannerToko.single("gambar"), updateBanner)
router.post("/deleteBanner", authMiddleware, deleteBanner)

router.get('/getEtalaseList', authMiddleware, getEtalaseList)
router.put('/updateEtalaseList', authMiddleware, updateEtalaseList)
router.post('/getListJenisByKategori', authMiddleware, getListJenisByKategori)

router.get('/showProduk', authMiddleware, showProduk)
router.post('/deleteProduk', authMiddleware, deleteProduk)
router.get('/showAllTokoProduk', authMiddleware, showAllTokoProduk)
router.post('/addProduk', authMiddleware, gambarProduk.array('gambar',10), addProduk)
router.put('/editProduk', authMiddleware, editProduk)

router.get('/getListMerek', authMiddleware, getListMerek)
router.post('/addMerek', authMiddleware, addMerek)
router.post('/deleteMerek', authMiddleware, deleteMerek)

module.exports = router;

const express = require('express');
const {gambarProduk} = require("../middleware/uploadFileMiddleware");
const {addProduk, showProduk, showAllTokoProduk, deleteProduk} = require("../controlller/toko/produkController");
const {getEtalaseList, updateEtalaseList} = require("../controlller/toko/etalaseController");
const {gambarProfilToko, gambarBannerToko} = require("../middleware/uploadFileMiddleware");
const {authMiddleware} = require("../middleware/authMiddleware");
const {updateProfile, getProfile} = require("../controlller/toko/profileController");
const {getBanner, addBanner, updateBanner} = require("../controlller/toko/bannerController");
const {loginToko, registerToko} = require("../controlller/authController");
const {uploadKTPToko} = require('../middleware/uploadFileMiddleware')
const router = express.Router();

router.post('/login', loginToko)
router.post('/register', uploadKTPToko.single('foto_ktp'), registerToko)

router.get('/getProfile', authMiddleware, getProfile)
router.post('/updateProfile', authMiddleware, gambarProfilToko.single('foto_profil'), updateProfile)

router.get("/getBanner", authMiddleware, getBanner)
router.post("/addBanner", authMiddleware, gambarBannerToko.single("gambar"), addBanner)
router.put("/updateBanner", authMiddleware, gambarBannerToko.single("gambar"), updateBanner)

router.get('/getEtalaseList', authMiddleware, getEtalaseList)
router.put('/updateEtalaseList', authMiddleware, updateEtalaseList)

router.get('/showProduk', authMiddleware, showProduk)
router.post('/deleteProduk', authMiddleware, deleteProduk)
router.get('/showAllTokoProduk', authMiddleware, showAllTokoProduk)
router.post('/addProduk', authMiddleware, gambarProduk.array('gambar',5), addProduk)

module.exports = router;

const express = require('express');
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

module.exports = router;

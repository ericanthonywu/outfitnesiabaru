const express = require('express');
const {gambarProfilToko} = require("../middleware/uploadFileMiddleware");
const {authMiddleware} = require("../middleware/authMiddleware");
const {updateProfile, getProfile} = require("../controlller/toko/profileController");
const {loginToko, registerToko} = require("../controlller/authController");
const {uploadKTPToko} = require('../middleware/uploadFileMiddleware')
const router = express.Router();

router.post('/login', loginToko)
router.post('/register', uploadKTPToko.single('foto_ktp'), registerToko)

router.post('/getProfile', authMiddleware, getProfile)
router.post('/updateProfile', authMiddleware, gambarProfilToko.single('foto_profil'), updateProfile)

module.exports = router;

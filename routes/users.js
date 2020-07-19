const express = require('express');
const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");
const {loginUser, registerUser} = require("../controlller/authController");
const {filterProduk, searchProduk, listFilterProduk} = require("../controlller/user/produkController");
const {carrouselAdmin, toggleFollow, getListMerekTokoPopuler} = require("../controlller/user/homeController");

router.post('/login', loginUser)
router.post('/register', registerUser)

router.post('/searchProduk', searchProduk)
router.post('/filterProduk', filterProduk)
router.get('/listFilterProduk', listFilterProduk)
router.get('/carrouselAdmin', carrouselAdmin)
router.get('/getListMerekTokoPopuler', getListMerekTokoPopuler)

router.post('/toogleFollow', authMiddleware, toggleFollow)

module.exports = router;

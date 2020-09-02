const express = require('express');
const {merekPopuler} = require("../controlller/user/homeController");
const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");
const {registerUser} = require("../controlller/authController");
const {filterProduk, searchProduk, listFilterProduk} = require("../controlller/user/produkController");
const {carrouselAdmin, toggleFollow, getListMerekTokoPopuler, getTokoById, findTokoByAlphabet, poster} = require("../controlller/user/homeController");

router.post('/register', registerUser)

router.post('/searchProduk', searchProduk)
router.post('/filterProduk', filterProduk)
router.get('/listFilterProduk', listFilterProduk)
router.get('/carrouselAdmin', carrouselAdmin)
router.get('/getListMerekTokoPopuler', getListMerekTokoPopuler)
router.post('/getTokoById', getTokoById)
router.get('/findTokoByAlphabet', findTokoByAlphabet)
router.get('/merekPopuler', merekPopuler)
router.get('/poster', poster)

router.post('/toogleFollow', authMiddleware, toggleFollow)

module.exports = router;

const express = require('express');
const {addTentangKami} = require("../controlller/crud/tentangKamiController");
const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");
const {registerUser} = require("../controlller/authController");
const {filterProduk, searchProduk, listFilterProduk} = require("../controlller/user/produkController");
const {
    carrouselAdmin,
    toggleFollow,
    getListMerekTokoPopuler,
    getTokoById,
    findTokoByAlphabet,
    poster,
    merekPopuler,
    showAllMerek,
    tokoPilihan,
    searchMerekByNama,
    tentangKami
} = require("../controlller/user/homeController");

router.post('/register', registerUser)

router.post('/searchProduk', searchProduk)
router.post('/filterProduk', filterProduk)
router.get('/listFilterProduk', listFilterProduk)
router.get('/carrouselAdmin', carrouselAdmin)
router.get('/getListMerekTokoPopuler', getListMerekTokoPopuler)
router.post('/getTokoById', getTokoById)
router.post('/findTokoByAlphabet', findTokoByAlphabet)
router.get('/merekPopuler', merekPopuler)
router.get('/poster', poster)
router.get('/showAllMerek', showAllMerek)
router.post('/toogleFollow', authMiddleware, toggleFollow)
router.get("/tokoPilihan", tokoPilihan)
router.post("/searchMerekByNama", searchMerekByNama)
router.get("/tentangKami", tentangKami)
// router.get("/addTentangKami", addTentangKami)

module.exports = router;

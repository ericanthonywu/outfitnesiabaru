const express = require('express');
const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");
const {loginUser, registerUser} = require("../controlller/authController");
const {filterProduk, searchProduk, listFilterProduk, carrouselAdmin} = require("../controlller/user/produkController");

router.post('/login', loginUser)
router.post('/register', registerUser)

router.post('/searchProduk', searchProduk)
router.post('/filterProduk', filterProduk)
router.get('/listFilterProduk', listFilterProduk)
router.get('/carrouselAdmin', carrouselAdmin)


module.exports = router;

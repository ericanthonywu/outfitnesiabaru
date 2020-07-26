const express = require('express');
const {authMiddleware} = require("../middleware/authMiddleware");
const {loginUserAndToko,checkToken} = require("../controlller/authController");
const router = express.Router();


router.post('/login', loginUserAndToko);
router.post('/checkToken', authMiddleware, checkToken);

module.exports = router;

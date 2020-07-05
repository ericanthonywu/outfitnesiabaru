const express = require('express');
const {loginToko, registerToko} = require("../controlller/authController");
const router = express.Router();

router.post('/login', loginToko)
router.post('/register', registerToko)

module.exports = router;

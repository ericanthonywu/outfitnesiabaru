const express = require('express');
const {loginToko, registerToko} = require("../controlller/authController");
const {uploadKTPToko} = require('../middleware/uploadFileMiddleware')
const router = express.Router();

router.post('/login', loginToko)
router.post('/register', uploadKTPToko.single('foto_ktp') , registerToko)


module.exports = router;

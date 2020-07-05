const mongoose = require('mongoose');

require('dotenv').config({path: ".env"})

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(_ => mongoose.connection.db.on('error', console.error.bind(console, 'connection error:')))
    .catch(err => console.log(err));

const adminSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, select: false},
}, {timestamps: true});

exports.admin = mongoose.model("admin", adminSchema);

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, select: false},
}, {timestamps: true});

exports.user = mongoose.model("user", userSchema);

const bannerSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true},
    order: {type: Number, required: true},
}, {timestamps: true});

exports.banner = mongoose.model("banner", bannerSchema);

const tokoSchema = new mongoose.Schema({
    username: {type: String, trim: true, unique: true},
    password: {type: String, required: true, select: false},
    merek: String,
    deskripsi: String,
    follower: [{type: mongoose.Schema.Types.ObjectID, ref: 'user'}],
    email: {type: String, trim: true, unique: true},
    instagram: String,
    whatsapp: String,
    website: String,
    alamat: String,
    foto_profil: String,
    bukalapak: String,
    shopee: String,
    tokopedia: String,
    fotoktp: String,
    approve: {type: Number, default: 0}, // 0: pending, 1: reject, 2: approve
}, {timestamps: true});

exports.toko = mongoose.model("toko", tokoSchema);

const kategoriSchema = new mongoose.Schema({
    label: String,
    gambar: String,
    jenis: [{
        label: String,
        gambar: String,
    }]
}, {timestamps: true});

exports.kategori = mongoose.model("kategori", kategoriSchema);

const produkSchema = new mongoose.Schema({
    nama_produk: String,
    kategori: String,
    jenis: String,
    bahan: String,
    warna: String,
    deskripsi: String,
    foto_produk: [String],
    show_status: Boolean
}, {timestamps: true});

exports.produk = mongoose.model("produk", produkSchema);

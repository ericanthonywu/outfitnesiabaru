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
    email: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, select: false},
    foto_profil: {String}
}, {timestamps: true});

exports.user = mongoose.model("user", userSchema);

const bannerSchema = new mongoose.Schema({
    gambar: {type: String, required: true, trim: true, unique: true},
    link: {type: String, required: true, trim: true},
    // order: {type: Number, required: true, unique: true},
}, {timestamps: true});

exports.banner = mongoose.model("banner", bannerSchema);

const posterSchema = new mongoose.Schema({
    gambar: {type: String, required: true, trim: true, unique: true},
    link: {type: String, required: true, trim: true},
    // order: {type: Number, required: true, unique: true},
}, {timestamps: true});

exports.poster = mongoose.model("poster", posterSchema);

const produkSchema = new mongoose.Schema({
    nama_produk: String,
    etalase: {type: mongoose.Schema.Types.ObjectID, ref: 'kategori'},
    kategori: {type: mongoose.Schema.Types.ObjectID, ref: 'kategori'},
    jenis: {type: mongoose.Schema.Types.ObjectID, ref: 'kategori.jenis'},
    bahan: String,
    warna: String,
    deskripsi: String,
    foto_produk: [String],
    harga: Number,
    link_bukalapak: String,
    link_shopee: String,
    link_tokopedia: String,
    display: {type: Boolean, default: false},
}, {
    weights: {
        nama_produk: 5,
    },
    timestamps: true
})

const tokoSchema = new mongoose.Schema({
    username: {type: String, trim: true},
    password: {type: String, required: true, select: false},
    merek: String,
    listMerek: [{type: mongoose.Schema.Types.ObjectID, ref: 'produk'}],
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
    banner: [{
        gambar: {type: String, required: true, trim: true},
        // order: {type: Number, required: true},
    }],
    produk: [produkSchema],
    etalase: [{type: mongoose.Schema.Types.ObjectID, ref: 'kategori'}],
    // etalase: [{
    //     kategori: {type: mongoose.Schema.Types.ObjectID, ref: 'kategori'},
    //     order: {Number}
    // }],
    approve: {type: Number, default: 0}, // 0: pending, 1: reject, 2: approve
    populer: {type: Boolean, default: false},
    gambar_populer: [String],
}, {timestamps: true});

exports.toko = mongoose.model("toko", tokoSchema);

const jenisSchema = new mongoose.Schema({
    label: String,
    gambar: String,
}, {timestamps: true})

const kategoriSchema = new mongoose.Schema({
    label: String,
    gambar: String,
    jenis: [jenisSchema]
}, {timestamps: true});

exports.kategori = mongoose.model("kategori", kategoriSchema);

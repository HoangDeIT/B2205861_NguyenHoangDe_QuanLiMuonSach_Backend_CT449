const config = {
    app: {
        port: process.env.PORT || 3000
    },
    db: {
        uri: process.env.MONGODB_URI || 'mongodb+srv://hoangde102004:fALPRizaqfWUwgVH@cluster0.nm0s7nt.mongodb.net/QuanLyMuonSach'
    }
}
module.exports = config
const mongoose = require('mongoose')
const shortId = require('shortid')

const shortenedUrlSchema = new mongoose.Schema({
    unshortened:{
        type: String,
        required: true
    },
    shortened: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks:{
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model('ShortenedUrl', shortenedUrlSchema)
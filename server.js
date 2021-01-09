const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortenedUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req,res) => {
    const shortenedUrls = await ShortUrl.find()
    res.render('index', { shortenedUrls: shortenedUrls })
})

app.post('/shortenedURLs', async (req,res) => {
    await ShortUrl.create({ unshortened: req.body.unshortenedURL })
    res.redirect('/')
})
app.listen(process.env.PORT || 5000);


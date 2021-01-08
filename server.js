const express = require('express')
const mongoose = require('mongoose')
const ShortenedUrl = require('./models/shortenedUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req,res) => {
    const shortenedUrls = await ShortenedUrl.find()
    res.render('index', { shortenedUrls: shortenedURLs })
})

app.post('/shortenedURLs', async (req,res) => {
    await ShortenedUrl.create({ unshortened: req.body.unshortenedURL })
    res.redirect('/')
})
app.listen(process.env.PORT || 5000);


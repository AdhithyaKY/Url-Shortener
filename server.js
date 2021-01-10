const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortenedUrl')
const app = express()
const bcrpyt = require('bcrypt')

const users = []

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Adhithya' })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login'), (req, res) =>{
    
}

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    try {
        //console.log("hello")
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        //console.log(users)
        res.redirect('/register')
    }
    //console.log(users)
    
})

app.get('/url-shortener', async (req,res) => {
    const shortenedUrls = await ShortUrl.find()
    res.render('urlShortener.ejs', { shortenedUrls: shortenedUrls })
})

app.post('/shortenedURLs', async (req,res) => {
    await ShortUrl.create({ unshortened: req.body.unshortenedURL })
    res.redirect('/url-shortener')
})

app.get('/:shortenedUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortened: req.params.shortenedUrl }) 
    if (shortUrl == null) return res.sendStatus(404)
    console.log(shortUrl)
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.unshortened)
})
app.listen(process.env.PORT || 5000);


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortenedUrl')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email  => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)


const users = []

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
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
        res.redirect('/register')
    }
    console.log(users)
    
})

app.get('/url-shortener', checkAuthenticated, async (req,res) => {
    const shortenedUrls = await ShortUrl.find()
    res.render('urlShortener.ejs', { shortenedUrls: shortenedUrls })
})

app.post('/shortenedURLs', checkAuthenticated, async (req,res) => {
    await ShortUrl.create({ unshortened: req.body.unshortenedURL })
    res.redirect('/url-shortener')
})

app.get('/:shortenedUrl', checkAuthenticated, async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ shortened: req.params.shortenedUrl }) 
    if (shortUrl == null) return res.sendStatus(404)
    console.log(shortUrl)
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.unshortened)
})

app.delete('/logout', (req,res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }

    return res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }else{
        return next()
    }
}

app.listen(process.env.PORT || 5000);


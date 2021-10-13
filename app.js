const express= require('express')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')
var path = require('path')
const router = require('./router')

let sessionOptions = session({
    secret: "bananas are good",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 8, httpOnly: true}
})

app.use(flash())
app.use(sessionOptions)

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app
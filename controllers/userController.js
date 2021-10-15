const User = require('../models/User')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

exports.register = function(req, res) {
    let user = new User(req.body)
    user.register().then(item => {
        req.session.user = {
            username: user.data.username,
            email: user.data.email,
            _id: user.data._id
        }
        req.session.save(() => {
            res.redirect('/')
        })
    }).catch(err => {
        req.flash('errors', err)
        req.session.save(() => {
            res.redirect('/')
        })
    })
}

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(() => {
        req.session.user = {
            username: user.data.username,
            email: user.data.email
        }
        req.session.save(() => {
            res.redirect('/')
        })
    }).catch(item => {
        console.log("failed")
        req.flash('errors', item)
        req.session.save(() => {
            res.redirect('/log-in')
        })
    })
}

exports.logout = function(req, res) {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

exports.showProfile = function(req, res) {
    User.findPosts(req.params.username).then((item) => {
        res.render('profile', { user: req.params.username, posts: item })
    })
}

//--------------------------------API--------------------------------


//Just authentication, not pushed into DB
exports.apiRegisterJWT = function(req, res) {
    console.log(req.body)
    let user = new User(req.body)
    user.apiReg().then(item => {
        res.json(jwt.sign({ username: item.username }, process.env.SECRET, { expiresIn: '1h' }))
    }).catch(err => {
        let newArray = err.map((item) => {
            return item[0]
        })
        res.status(500).send({ errors: newArray })
    })
}

exports.apiLogin = function(req, res) {
    let user = new User(req.body)
    user.login().then(() => {
        res.send("success")
    }).catch(err => {
        console.log(err)
        res.status(500).send({ message: "Invalid Username/Password" })
    })
}

exports.apiUsers = function(req, res) {
    User.getUsers().then((item) => {
        res.send(item)
    }).catch(() => {
        res.send("failed")
    })
}

exports.apiUser = async function(req, res) {
    User.getUser(req.params.username).then((user) => {
        res.json(user)
    }).catch(() => {
        res.status(500).send({ error: "Not found" })
    })
}

exports.apiRegister = function(req, res) {
    let user = new User(req.body)
    user.register().then(item => {
        const ok = true
        res.status(201).send({ jwt: jwt.sign({ item }, process.env.SECRET, { expiresIn: '1h' }), user: item, ok })
    }).catch(err => {
        const ok = false
        res.status(500).send({err, ok})
    })
}

const User = require('../models/User')

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
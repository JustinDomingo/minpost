const Post = require("../models/Post")

exports.create = function(req, res) {
    let post = new Post(req.body.text, req.session.user.username)
    post.create().then(() => {
        req.flash('success', "New post created.")
        req.session.save(() => {
           res.redirect('/') 
        })
    }).catch((err) => {
        req.flash('errors', err)
        req.session.save(() => {
            res.redirect('/') 
         })
    })
}

exports.getData = function(req, res) {
    Post.fetchData().then(item => {
        res.json(item)
    }).catch(() => {
        res.send("404")
    })
}

exports.deleteOne = function(req, res) {
    Post.delete(req.body._id, req.body.author, req.session.user.username).then(() => {
        res.json("Post deleted")
    }).catch((err) => {
        res.status(500).send({ error: err })
    })
}

exports.editOne = function(req, res) {
    Post.update(req.body._id, req.body.updateText, req.body.author, req.session.user.username).then(() => {
        res.json(req.body.updateText)
    }).catch((err) => {
        req.flash('errors', err)
        req.session.save(() => {
            res.redirect('/') 
         })
    })
}

exports.isOwnPost = function(req, res) {
    Post.checkPost(req.body.author, req.session.user.username).then(() => {
        res.json("success")
    }).catch(() => {
        res.status(500).send({ error: "Error" })
    })
}
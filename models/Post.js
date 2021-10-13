const mongoose = require('mongoose')
const { post } = require('../router')

const postSchema = new mongoose.Schema({
    body: String,
    author: String,
    date: Date,
})
const PostModel = mongoose.model('Post', postSchema)

let Post = function(data, user) {
    this.data = data
    this.username = user
    this.errors = []
}

Post.prototype.validate = function() {
    if (this.data == "") {this.errors.push("Field cannot be left blank")}
}

Post.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.validate()
        if (!this.errors.length) {
            const post = new PostModel({
                body: this.data,
                author: this.username,
                date: new Date()
            })
            post.save((err) => {
                resolve(err)
            })
        } else {
            reject(this.errors)
        }
    })
}

Post.fetchData = function() {
    return new Promise(async (resolve, reject) => {
        let array = await PostModel.find()
        array.map(item => item)
        resolve(array)
    })
}

Post.delete = function(id, author, sessionUser) {
    return new Promise(async (resolve, reject) => {
        if (author == sessionUser) {
            await PostModel.findOneAndDelete({ _id: id }).then(() => {
                resolve()
            }).catch(() => {
                reject("404")
            })
        } else {
            reject("You can only delete your own posts.")
        }
    })
}

Post.update = function(id, newBody, author, sessionUser) {
    return new Promise(async (resolve, reject) => {
        if (author == sessionUser) {
            await PostModel.findOneAndUpdate({ _id: id }, { body: newBody }).then(() => {
                resolve()
            }).catch(() => {
                reject("404")
            })
        } else {
            reject("You can only edit your own posts.")
        }
    })
}

Post.checkPost = function(author, sessionUser) {
    return new Promise((resolve, reject) => {
        if (author == sessionUser) {
            resolve()
        } else {
            reject("You can only edit your own posts.")
        }
    })
}

module.exports = Post
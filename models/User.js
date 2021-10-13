const bcrypt = require("bcryptjs")
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

const ValidUser = mongoose.model("User", userSchema)

const postSchema = new mongoose.Schema({
    body: String,
    author: String,
    date: Date,
})

// constructor
let User = function (data) {
    this.data = data
    this.errors = []
    this.usernameErrors = []
    this.emailErrors = []
    this.passwordErrors = []
}

User.prototype.authentication = function() {
    return new Promise(async (resolve, reject) => {
        if (this.data.username == "") {this.usernameErrors.push("You must provide a username")}
        if (this.data.email == "") {this.emailErrors.push("You must provide an email")}
        if (this.data.password == "") {this.passwordErrors.push("You must provide a password")}
        if (!validator.isEmail(this.data.email)) {this.emailErrors.push("You must provide a valid email address")}
        if (!validator.isAlphanumeric(this.data.username, 'en-US')) {this.usernameErrors.push("Your username must not contain special characters")}
        if (this.data.username.length < 3) {this.usernameErrors.push("Your username must be between 3-20 characters long")}
        if (this.data.username.length > 20) {this.usernameErrors.push("Your username must be between 3-20 characters long")}
        if (this.data.password.length < 8) {this.passwordErrors.push("Your password must be at least 8 characters")}
        let user = await ValidUser.findOne({username: this.data.username}) //looks for a doc with a username and email that matches the input
        if (user) {
            this.usernameErrors.push("Username is already taken")
        }
        let email = await ValidUser.findOne({email: this.data.email})
        if (email) {
            this.emailErrors.push("Email is already in use")
        }
        if (this.usernameErrors.length || this.emailErrors.length || this.passwordErrors.length) {
            this.errors.push(this.usernameErrors, this.emailErrors, this.passwordErrors)
            resolve()
        } else {
            resolve()
        }
    })
}

User.prototype.login = function() {
    return new Promise(async (resolve, reject) => {
        this.data = {
            username: this.data.username,
            email: this.data.email,
            password: this.data.password
        }
        let user = await ValidUser.findOne({username: this.data.username})
        if (user && bcrypt.compareSync(this.data.password, user.password)) {
            resolve("Logged in.")
        } else {
            this.errors.push("Invalid Username/Password")
            reject(this.errors)
        }
    })
}


User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        await this.authentication() // method contains async operations
        if (!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            const validUser = new ValidUser({
                username: this.data.username,
                email: this.data.email,
                password: this.data.password
            })
            validUser.save().then().catch(err => console.log(err))
            resolve(validUser)
        } else {
            reject(this.errors)
        }
    })
}

User.findPosts = function(username) {
    return new Promise(async (resolve, reject) => {
        let posts = await mongoose.model('Post').find({ author: username })
        resolve(posts)
    })
}

module.exports = User
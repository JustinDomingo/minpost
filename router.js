const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

router.get('/', function(req, res) {
    if (req.session.user) {
        res.render('homepage', {message: req.flash('success'), errors: req.flash('errors'), username: req.session.user.username})
    } else {
        res.render('register', {errors: req.flash('errors')})
    }
})
router.get('/log-in', function(req, res) {
    res.render('login', {error: req.flash('errors')})
})
router.get('/user/:username', userController.showProfile)

router.post('/check-post', postController.isOwnPost)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//CRUD routes
router.post('/create', postController.create)
router.post('/delete-item', postController.deleteOne)
router.post('/edit-item', postController.editOne)

//API Routes
router.get('/api/data', postController.getData)


module.exports = router
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
        console.log(err)
    } else {
        let app = require('./app')
        console.log("Connected")
        app.listen(process.env.PORT)
    }
})
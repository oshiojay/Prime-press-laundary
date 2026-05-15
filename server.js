require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const PORT = process.env.PORT


const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to database')
    app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`)
})
}).catch((err) => {
    console.log('error connecting to database', err.message)
})

require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const PORT = process.env.PORT
const swaggerUi = require('swagger-ui-express')
const swagger = require('./swagger')
const cors = require('cors')


const router = require('./route/admin')
const bookingRouter = require('./route/booking')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/apisDocs', swaggerUi.serve, swaggerUi.setup(swagger))

app.use('/api/v1', router)
app.use('/api/v1', bookingRouter)

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to database')
    app.listen(PORT, () => {
    console.log(`app is running on port: ${PORT}`)
})
}).catch((err) => {
    console.log('error connecting to database', err.message)
})

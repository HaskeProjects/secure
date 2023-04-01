const express = require('express')
const App = express()
const cors = require('cors')
require('dotenv').config()
const path = require('path')
require('./lib/db')()
App.use(cors({
    origin:'http://localhost:3000',
    optionSuccessStatus:201
 }))
const PORT = process.env.PORT || 330
App.use(express.urlencoded({ extended: true }))
App.use('/public',express.static(path.join(__dirname, "public")))
App.use(express.json())

App.get('/', (req,res)=>{return res.json({message:"Connect Yay"})})

App.use('/es', require('./routes/estates.routes'))
App.use('/chair', require('./routes/chairman.routes'))
App.use('/re', require('./routes/residents.routes'))
App.use('/vi', require('./routes/visitors.routes'))
App.use('/sec', require('./routes/security.routes'))

App.listen(PORT, (err)=>{
    if(err) throw err
    console.log("\u001b[34m connected successfully on "+PORT)
})
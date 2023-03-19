const express = require('express')
const App = express()
const cors = require('cors')
require('dotenv').config()
require('./lib/db')()
const PORT = 330 || process.env.PORT
App.use(cors())
App.use(express.json())

App.get('/', (req,res)=>{return res.json({message:"Connect Yay"})})

App.use('/es', require('./routes/estates.routes'))
App.use('/chair', require('./routes/chairman.routes'))

App.listen(PORT, (err)=>{
    if(err) throw err
    console.log("\u001b[34m connected successfully on "+PORT)
})
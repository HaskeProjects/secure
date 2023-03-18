const express = require('express')
const App = express()
const cors = require('cors')
require('dotenv').config()
const PORT = 330 || process.env.PORT
cors()

App.get('/',(req,res)=>{return res.json({message:"Connect Yay"})})


App.listen(PORT, (err)=>{
    if(err) throw err
    console.log(green, "connected successfully on "+PORT)
})
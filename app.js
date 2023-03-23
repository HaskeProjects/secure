const express = require('express')
const App = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config()
require('./lib/db')()
const PORT = process.env.PORT || 3210
App.use(cors({
    origin:['http://localhost:3000'], 
    credentials:true,
    optionSuccessStatus:200
 }))
App.use(express.urlencoded({ extended: false }))
App.use(express.json())
App.use(cookieParser())
App.use(session({
    secret: 'gurudev',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  }))

App.get('/', (req,res)=>{return res.json({message:"Connect Yay"})})

App.use('/es', require('./routes/estates.routes'))
App.use('/chair', require('./routes/chairman.routes'))
App.use('/re', require('./routes/residents.routes'))
App.use('/vi', require('./routes/visitors.routes'))
App.use('/sec', require('./routes/security.routes'))

App.get('/logout', function (req, res) {
    req.session.user = null
    req.session.secuser = null
    req.session.repid = null
    req.session.save(function (err) {
      if (err) next(err)
      return req.session.regenerate(function (err) {
        if (err) console.log(err)
        res.json({message:"success"})
      })
    })
  })

App.listen(PORT, (err)=>{
    if(err) throw err
    console.log("\u001b[34m connected successfully on "+PORT)
})
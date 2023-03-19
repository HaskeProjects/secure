const Chair = require('../models/chairmen.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getAllChair = (req, res) => {
    const data = Chair.find().lean()
    return res.json(data)
}

// const createNewChair = async(req, res) => {
//     const {name, esId, number} = req.body
//     const estate = new Chair({name, esId, number})
//     const data = await estate.save()
//     return res.json(data)
// }

const ChairmanLogin = async(req, res) => {

    const {user, password} = req.body
    if(![user, password].every(Boolean)) return res.status(404).json({type:"incompleteinfo", message: 'user login credentials required'})
    const regex = /^(\w+)[@](\w+)[.](\w+)$/
    const numregex = /^[0-9]{9,10}$/
    const tester = regex.test(user) ? {email: user} : numregex.test(parseInt(user)) ? {number: user} : {number: 000}
    console.log(tester)
    const found = await Chair.findOne(tester).exec()
    
    if(!found) return res.status(404).json({message: "not found"})

    const match = await bcrypt.compare(password, found.password)
    if(match){  
        const accessToken = jwt.sign(
            {username: found.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'}
        )
        return res.status(201).json({data:match, accessToken}) 
    }
    else{
        return res.status(404).json({type:"wrongpass"})
    }
}

const changeChair = async(req, res) => {
    const {newChairName, newChairNumber, chId} = req.body 
    if (!chId) return res.status(403)
    const found = await Chair.findOne({_id: chId}).exec()
    found.name = newChairName
    found.number = newChairNumber
    const resp = await found.save()
    return res.json(resp)
}

module.exports = {getAllChair, ChairmanLogin, changeChair}
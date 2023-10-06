const Resident = require('../models/residents.model')
const sendSMS = require('../utils/sms')
const randomizer = require('randomstring')
const jwt = require('jsonwebtoken')
const visitorsModel = require('../models/visitors.model')
const estatesModel = require('../models/estates.model')
const testval = require('../utils/testval')
const dependantsModel = require('../models/dependants.model')
const residentsModel = require('../models/residents.model')

const getAllEstateRecidents = async(req, res) => {
    const esId = req.user
    const {skip, limit} = req.params
    const resp = await Resident.find({esId: esId}).lean().skip(skip).limit(limit||10)
    const count = await Resident.find({esId: esId}).count()
    return res.json({resp, count})
}

const EditRe = async(req,res) => {
    const {firstname, lastname, resId, apartment, number} = req.body
    const found = await Resident.findOne({_id: resId})
    if (!found) return res.status(404).json({message:'not found'})
    found.firstname = firstname
    found.lastname = lastname
    found.number = number
    found.apartment = apartment
    const resp = await found.save()
    return res.status(201).json(resp)
}

const requestRat = async(req, res) => {
    
}

const verifyRat = async(req, res) => {
    const {number} = req.params
    const {code} = req.body
    const found = await Resident.findOne({number: number}).lean()
    if (!found) return res.status(404).json({message: 'Not found'})
    if(!found.crat || found.crat !== code.toUpperCase()) return res.status(401).json({message: 'Incorrect code'})
   
    const accessToken = jwt.sign(
        {userr: found._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30m'}
    )
    
    return res.status(201).json({id: '', accessToken, role:2003})

}

const getResidentVisitors = async(req, res) => {
    const id = req.user
    const result = await visitorsModel.find({resId: id}).lean()
    return res.status(201).json(result)
}

const createNewRe = async(req, res) => {
    const {firstname, lastname, esId, apartment, number} = req.body
    const token = randomizer.generate({length:4, charset: 'hex',capitalization: 'uppercase'})+randomizer.generate({length:1,charset: 'alphabetic',capitalization: 'uppercase'})+randomizer.generate({length:1,charset: 'number',capitalization: 'uppercase'})
    const resident = new Resident({firstname, lastname, esId, apartment, number, crat:token})
    const mes = `From PROTECTPRO: This is your Resident Pass ${token}. You will need it always to book your visitor into the estate. Please keep it safe and do not disclose it to anyone. www.PROTECTPRO.ng`
    await sendSMS(number, mes)
    const resp = await resident.save()
    return res.status(201).json({...resp, token})
}

const getSingleRe = async(req, res) =>{
    const id = req.user
    const result = await Resident.findOne({_id: id}).lean()
    return res.status(201).json(result)
}


const deleteRe = async(req,res) => {
    const {number} = req.params
    const found = await Resident.findOne({_id: number})
    if (!found) return res.status(404).json({message: 'not found'})
    const resp = await Resident.deleteOne({_id: number})
    return res.status(201).json(resp)
}

const getDependants = async(req,res) =>{
    const id = req.user
    try{
        const dependants = await dependantsModel.find({resId: id}).lean()
        return res.status(201).json(dependants)
    }catch(e){
        res.status(500).json(e)
    }
}

const addDependants = async (req, res) => {
    const id = req.user;
    const { firstname, lastname, number } = req.body; // Assuming phoneNumber is in the request body
  
    try {
      const user = await residentsModel.findById(id);
      if (!user) {
        return res.sendStatus(403);
      }
  
      const token =
        randomizer.generate({ length: 4, charset: 'hex', capitalization: 'uppercase' }) +
        randomizer.generate({ length: 1, charset: 'alphabetic', capitalization: 'uppercase' }) +
        randomizer.generate({ length: 1, charset: 'number', capitalization: 'uppercase' });
  
      const dependant = new dependantsModel({
        firstname,
        lastname,
        resId: id,
        accessToken: token,
        number, // Save the phone number
      });
  
      await dependant.save();
  
      // Send an SMS to the dependant
      const message = `PROTECTPRO: Hello ${firstname} ${lastname}, your access token is ${token}`;
      await sendSMS(number, message);
  
      return res.status(201).json(dependant);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  

const updateDependant = async (req, res) => {
    const { id } = req.params; // Assuming the dependant's ID is passed in the URL
    const { firstname, lastname } = req.body;
  
    try {
      // Check if the dependant exists
      const dependant = await dependantsModel.findById(id);
  
      if (!dependant) {
        return res.status(404).json({ error: "Dependant not found" });
      }
  
      // Update the dependant's information
      dependant.firstname = firstname;
      dependant.lastname = lastname;
  
      await dependant.save();
  
      return res.status(200).json(dependant);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  const deleteDependant = async (req, res) => {
    const { id } = req.query; // Assuming the dependant's ID is passed in the URL
    
    try {
      // Check if the dependant exists
      const dependant = await dependantsModel.findById(id);
  
      if (!dependant) {
        return res.status(404).json({ error: "Dependant not found" });
      }
  
      // Delete the dependant
      await dependantsModel.deleteOne({_id: id});
  
      return res.sendStatus(204); // 204 No Content indicates successful deletion
    } catch (error) {
        console.log(error)
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  
module.exports = {getAllEstateRecidents, getDependants, updateDependant, deleteDependant, getResidentVisitors, verifyRat, createNewRe, deleteRe, requestRat, getSingleRe, EditRe, addDependants}

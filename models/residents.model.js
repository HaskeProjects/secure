const mongoose = require('mongoose')
const reSchema = new mongoose.Schema({
        firstname: {type:String, required:true},
        lastname: {type:String, required:true}, 
        esId: {type: mongoose.Types.ObjectId},
        apartment: {type:String, required: true},
        number: {type:Number, require:true}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})



module.exports = mongoose.model('residents', reSchema)
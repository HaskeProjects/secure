const mongoose = require('mongoose')
const chSchema = new mongoose.Schema({
        firstname: {type:String, required:true},
        lastname: {type:String, required:true},
        esId: {type: mongoose.Types.ObjectId},
        number: {type:Number, require:true},
        password: {type:String, required: true},
        email: {type:String, required: true}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})



module.exports = mongoose.model('chairmens', chSchema)
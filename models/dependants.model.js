const mongoose = require('mongoose')
const deSchema = new mongoose.Schema({
        firstname: {type:String, required:true},
        lastname: {type:String, required:true}, 
        resId: {type: mongoose.Types.ObjectId, required: true},
        accessToken: {type:String, required: true},
        number: {type:Number, required: false}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})



module.exports = mongoose.model('dependants', deSchema)
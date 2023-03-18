const mongoose = require('mongoose')
const chSchema = new mongoose.Schema({
        name: {type:String, required:true},
        esId: {type: mongoose.Types.ObjectId},
        number: {type:Number, require:true}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})



module.exports = mongoose.model('chairmens', chSchema)
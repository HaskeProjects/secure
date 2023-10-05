const mongoose = require('mongoose')
const visitorsModel = require('./visitors.model')
const dependantsModel = require('./dependants.model')
const reSchema = new mongoose.Schema({
        firstname: {type:String, required:true},
        lastname: {type:String, required:true}, 
        esId: {type: mongoose.Types.ObjectId, required: true},
        apartment: {type:String, required: true},
        number: {type:Number, require:true},
        crat: {type:String, default: null}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})

reSchema.pre('remove', async function(next){
        const id = this._id
        await visitorsModel.deleteMany({resId:id})
        await dependantsModel.deleteMany({resId:id})
        next()
})



module.exports = mongoose.model('residents', reSchema)
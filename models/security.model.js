const mongoose = require('mongoose')
const seSchema = new mongoose.Schema({
        name: {type:String, required:true},
        user:{type:String, required:true},
        password: {type:String, required: true},
        esId: {type: mongoose.Types.ObjectId},
        image: {type:String, default:'un'}
},{
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}
})
seSchema.virtual('estate', {
        ref:'estates',
        foreignField: '_id',
        localField: 'esId',
        justOne:true
})


module.exports = mongoose.model('securitys', seSchema)
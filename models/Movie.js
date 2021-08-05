const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const MovieSchema=new Schema({
    title:{
        type:String,
        required:true,
        maxLength:15,
        minLength:1
    },
    category:{
        type:String,
        maxLength:30,
        minLength:3
    },
    country:{
        type:String,
        maxLength:20,
        minLength:2

    },
    year:Number,
    imdb_score:{
        type:Number,
        max:10,
        min:0
    },
    director_id:Schema.Types.ObjectId,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('movie',MovieSchema);
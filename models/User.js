const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        maxLength:25,
        minLength:5,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minLength:5

    }
})


module.exports=mongoose.model('user',UserSchema);
const mongoose=require('mongoose');

module.exports=()=>{
    mongoose.connect('mongodb+srv://movieapiadmin:admin123@cluster0.l7lij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true});
    mongoose.connection.on('open',()=>{
        console.log('MongoDB bağlantısı sağlandı');
    })
    mongoose.connection.on('error',(err)=>{
        console.log('MongoDB Bağlantısı kurulamadı',err);
    });

    mongoose.Promise=global.Promise;
}
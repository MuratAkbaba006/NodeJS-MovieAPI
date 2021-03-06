const express = require('express');
const router = express.Router();

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const User=require('../models/User');
/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next)=> {

  const {username,password}=req.body;

  bcrypt.hash(password,10).then((hash)=>{
    
    const user=new User({
      username,
      password:hash
    })
  
    const promise=user.save();
    promise.then((data)=>{
      res.json(data)
    }).catch((err)=>{
      res.json(err);
    })

  })
});

router.post('/authenticate',(req,res)=>{
  const {username,password} = req.body;

  User.findOne({
    username
  },(err,user)=>{
    if(err)
    throw err;

    if(!user){
      res.json({
        status:false,
        message:'Authentication failed,user not found'
      })
    }else{
      //eğer o username'e sahip bir kullancı varsa parola
      //bilgisinin kontrolü
      bcrypt.compare(password,user.password).then((result)=>{
        if(!result){
          res.json({
            status:false,
            message:'Authentication failed, password is wrong'
          })
        }else{
          const payload={
            username,

          };
          const token=jwt.sign(payload,req.app.get('api_secret_key'),{
            expiresIn:720 
          })
          //burada verilen ilk parametre payload,
          //ikinci parametre secret key değeri
          //üçüncü parametrede ise expiresIn:diyerek
          //dakika cinsinden tokenin ne kadar süre geçerli olacağı
          res.json({
            status:true,
            token:token
          })

        }

      })

    }
  })
})

module.exports = router;

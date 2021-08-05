const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const Director=require('../models/Director');

router.post('/',(req,res,next)=>{
    const director=new Director(req.body);

    const promise=director.save();
    promise.then((director)=>{
        res.json(director)
    }).catch((err)=>{
        res.json(err);
    })

})

router.get('/',(req,res)=>{
    const promise=Director.aggregate([
        {
            $lookup:{
                from:'movies',
                localField:'_id',
                foreignField:'director_id',
                as:'data'
            }
        },
        {
            $unwind:{
                path:'$data',
                preserveNullAndEmptyArrays:true
                //preserveNullAndEmptyArrays ile hali hazırda yönettiği
                //film olmayan yönetmenleride görüntülenmesi sağlandı
            }
        },
        {
            $group:{
                _id:{
                    _id:'$_id',
                    name:'$name',
                    surname:'$surname',
                    bio:'$bio',
                    
                },
                movies:{
                    $push:'$data'
                }
            }
        },
        {
            $project:{
                _id:'$_id_id',
                name:'$_id.name',
                surname:'$_id.surname',
                movies:'$movies'
            }
        }
    ]);

    promise.then((directors)=>{
        res.json(directors)
    }).catch((err)=>{
        res.json(err)
    })
})


router.get('/:director_id',(req,res)=>{
    const directorId=req.params.director_id;
    const promise=Director.aggregate([
        {
            $match:{
                '_id':mongoose.Types.ObjectId(directorId)
            }
        },
        {
            $lookup:{
                from:'movies',
                localField:'_id',
                foreignField:'director_id',
                as:'data'
            }
        },
        {
            $unwind:{
                path:'$data',
                preserveNullAndEmptyArrays:true
                //preserveNullAndEmptyArrays ile hali hazırda yönettiği
                //film olmayan yönetmenleride görüntülenmesi sağlandı
            }
        },
        {
            $group:{
                _id:{
                    _id:'$_id',
                    name:'$name',
                    surname:'$surname',
                    bio:'$bio',
                    
                },
                movies:{
                    $push:'$data'
                }
            }
        },
        {
            $project:{
                _id:'$_id_id',
                name:'$_id.name',
                surname:'$_id.surname',
                bio:'$_id.bio',
                movies:'$movies'
            }
        }
    ]);

    promise.then((directors)=>{
        res.json(directors)
    }).catch((err)=>{
        res.json(err)
    })
})


router.put('/:director_id',(req,res,next)=>{
    const directorId=req.params.director_id;
    const promise=Director.findByIdAndUpdate(
        directorId,
        req.body,
        {
            new:true
        });
    promise.then((director)=>{
        if(!director)
            next({message:'The director was not found',code:1})

        res.json(director)    
    }).catch((err)=>{
        res.json(err);
    })    
})

router.delete('/:director_id',(req,res,next)=>{
    const directorId=req.params.director_id;
    const promise=Director.findByIdAndRemove(directorId);

    promise.then((director)=>{
        if(!director)
            next({message:'The director was not found',code:1})

        res.json(director);
    }).catch((err)=>{
        res.json(err);
    })
})


module.exports=router
const express = require('express');
const router = express.Router();

const Movie=require('../models/Movie');

router.get('/',(req,res)=>{
  const promise=Movie.aggregate([
    {
      $lookup:{
        from:'directors',
        localField:'director_id',
        foreignField:'_id',
        as:'director'
      }
    },
    {
      $unwind:'$director'
    }
  ]);
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  })

})

router.post('/', (req, res, next) =>{

  const movie=new Movie(req.body);
  //req.body diyerek post isteğinin içinde ne varsa
  //göndermiş olduk

  const promise=movie.save();
  promise.then((data)=>{
    res.json(data)
  }).catch((err)=>{
    res.json(err);
  })

});

router.get('/top10',(req,res,next)=>{
  const promise=Movie.find({}).sort({imdb_score:-1}).limit(10);
  promise.then((movies)=>{
    if(!movies)
    next({message:'The movie was not found',code:99});

    res.json(movies)
  }).catch((err)=>{
    res.json(err);
  })

})

router.get('/:movie_id',(req,res,next)=>{
  const movieId=req.params.movie_id;
  const promise=Movie.findById(movieId);
  promise.then((movie)=>{
    if(!movie)
      next({message:'The Movie was not found',code:99});

    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  })
})

router.put('/:movie_id',(req,res,next)=>{
  const movieId=req.params.movie_id;
  const promise=Movie.findByIdAndUpdate(
    movieId,
    req.body,
    {
      new:true
    });
    //burada new parametresi olarak bize gönderilen cevabın
    //güncellenmiş olan veri olmasını sağladık
  promise.then((movie)=>{
    if(!movie)
    next({message:'The Movie was not found',code:99});

    res.json(movie)
  }).catch((err)=>{
    res.json(err)
  })
})

router.delete('/:movie_id',(req,res,next)=>{
  const movieId=req.params.movie_id;
  const promise=Movie.findByIdAndRemove(movieId);

  promise.then((movie)=>{
    if(!movie)
      next({message:'The movie  was not found',code:99});

      res.json({status:1});
  }).catch((err)=>{
    res.json(err);
  })
})


//Between

router.get('/between/:start_year/:end_year',(req,res)=>{
  const {start_year,end_year} = req.params;
  const promise=Movie.find({
    year:{
      "$gte":parseInt(start_year),
      "$lte":parseInt(end_year)
      //gte -> büyük eşit
      //lte -> küçük eşit
    }
  });

  promise.then((data)=>{
    res.json(data)
  }).catch((err)=>{
    res.json(err);
  })
})


module.exports = router;

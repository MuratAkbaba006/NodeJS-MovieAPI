const chai=require('chai');
const chaiHttp=require('chai-http');
const should=chai.should();
const server=require('../app');
const mocha=require('mocha');

const describe=mocha.describe;

chai.use(chaiHttp);

let token,movieId;

describe('/api/movies tests ',()=>{
    before((done)=>{
        chai.request(server).post('/authenticate').send({
            username:"Murat",
            password:"raysel123"
        }).end((err,res)=>{
            token=res.body.token;
            done();
        })
    })

    //before ile teste başlanmadan önce yapılmasını
    //istediğimiz işlemleri yapabiliriz.örneğin burada
    //token bilgisini almak için kullandık.

    describe('/GET movies',()=>{
        it('it should GET all the movies',(done)=>{
            chai.request(server).get('/api/movies')
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('array');
                //dönen cevap bir array olmalı
                done();
            })
        })
    })

    describe('/POST movies',()=>{
        it('it should POST a movie',(done)=>{
            chai.request(server).post('/api/movies')
            .set('x-access-token',token)
            .send({
                title:'Test Title',
                category:'test',
                year:2021,
                imdb_score:9.9,
                director_id:'610aadadb1279a16a0b06edd'

            })
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                
                res.body.should.have.property('title');
                res.body.should.have.property('category');
                res.body.should.have.property('year');
                res.body.should.have.property('imdb_score');
                res.body.should.have.property('director_id');
                
                movieId=res.body._id;

                done();
            })
        })
    })

    describe('/api/movies/:id check',()=>{
        it('it should show a movie by the given id',(done)=>{
            
            chai.request(server).get(`/api/movies/${movieId}`)
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('category');
                res.body.should.have.property('year');
                res.body.should.have.property('imdb_score');
                res.body.should.have.property('director_id');
                res.body.should.have.property('_id').eql(movieId);
                done();
            })
        })
    })

    describe('/api/movies/:id PUT',()=>{
        it('it should update a movie by the given id',(done)=>{
            chai.request(server).put(`/api/movies/${movieId}`)
            .set('x-access-token',token)
            .send({
                title:'Test Title(Updated)',
                category:'test(Updated)',
                year:2021,
                imdb_score:9.9,
                director_id:'610aadadb1279a16a0b06edd'
            })
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title').eql(res.body.title);
                res.body.should.have.property('category').eql(res.body.category);
                res.body.should.have.property('year').eql(res.body.year);
                res.body.should.have.property('imdb_score').eql(res.body.imdb_score);
                res.body.should.have.property('director_id').eql(res.body.director_id);
                res.body.should.have.property('_id').eql(movieId).eql(res.body._id);
                done();

            })
        })
    })

    describe('/api/movies/:id DELETE',()=>{
        it('it should delete a movie by the given id',(done)=>{
            chai.request(server).delete(`/api/movies/${movieId}`)
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(1);
                
                done();
            })
        })
    })
})
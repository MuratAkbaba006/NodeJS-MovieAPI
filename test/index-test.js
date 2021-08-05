const chai=require('chai');
const chaiHttp=require('chai-http');
const should=chai.should();
const server=require('../app');
const mocha=require('mocha');

const decribe=mocha.describe;

chai.use(chaiHttp);

decribe('Node Server',()=>{
    it('(GET /) Anasayfayı döndürür',(done)=>{
        chai.request(server).get('/').end((err,res)=>{
            res.should.have.status(200);
            done();
        })
    })
})

//describe ilk parametre olarak neyle ilgili test yazıyoruz
//bilgisini alır.
//descibe altında birden fazla it() olabilir.Bu it() metodu
//testi ifade eder ikinci parametre oalrak bir callback fonksiyon
//alır ve bu fonksiyondaki done parametresi done() şeklinde kullanılırsa
//test başarılı olmuş anlamına gelir.

/* chai.request(server).get('/') diyerek servisin yani app.js'nin 
kök dizinine bir get isteği atmış olduk devamında ise 
res.should.have.status(200) diyerek bu isteğe karşılık
dönen cevabın 200 durum koduna sahip olması gerektiğini
belirttik eğer bu cevap 200 durum koduna sahipse done() diyerek
başarılı olduğunu belirttik.

*/
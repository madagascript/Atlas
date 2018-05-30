
// uso: 
// nodemon server.js AtlasUrl port
const express = require('express');
const bodyParser = require('body-parser')
const mongo = require('mongodb') 
const app = express();
const MongoClient = mongo.MongoClient;
const url = process.argv[2]
const port = process.argv[3] ? process.argv[3] : 3000
const fs = require('fs');
const {exec} = require('child_process');

// exec('df -h', (error, stdout, stderr) => { console.log(`stdout: ${stdout}`); })

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/img', (request, response) => {
  let html = ''  
  fs.readdirSync('./public/diapos/').forEach(file => {
    html += `
    <a href="/diapos/${file}" target="_blank">
      <img src="/diapos/${file}" height="100" width="150">
    </a>
    `    

  })
  response.send(html)
});


// Aplicación para corregir exámenes:
// el server recibe en request.query para que el form sea más fácil
function corrige(pattern, response, index){
  // los 2 parámetros son arrays
  let total = { puntuacion: 0, correctas: 0, incorrectas: 0, blanco: 0, errores: []}    
  pattern.forEach( (val, key) => {         
    let numPregunta = index + key + 1
    if ( response[key] == val ){ total.correctas += 1 }
    else {
      if ( response[key] == '-' ){ total.blanco += 1 }
      else { total.errores.push(`error en pregunta: ${numPregunta}`);  total.incorrectas += 1}
    }
  });
  total.puntuacion = total.correctas - (total.incorrectas * 0.25)
  return total;
}

function getUf(uf, cb){  
  // getUf('uf1465', (data) => { console.log(data) });
  MongoClient.connect(url, function(err, client) { 
    client.db('ifcd0112').collection('ufs')
    .findOne({ nombre: uf}, (err, data) => { cb(data) })    
    client.close()
  });
}

app.get('/corregir', (request, response) => {  
  // http://localhost:3000/corregir?uf1=1234a678-0&uf2=1234567890...

  let uf1 = Array.from('aaaaaaaaaa'), uf2 = Array.from('bbbbbbbbbb'), uf3 = Array.from('aaaaabbbbb');
  console.log(uf1,uf2,uf3)
  let examenUf1 = Array.from(request.query.uf1), 
      examenUf2 = Array.from(request.query.uf2),
      examenUf3 = Array.from(request.query.uf3);
  let respUf1 = corrige(uf1, examenUf1, 0)
  let respUf2 = corrige(uf2, examenUf2, 10)
  let respUf3 = corrige(uf3, examenUf3, 20)
  response.send({
    uf1: respUf1,
    uf2: respUf2,
    uf3: respUf3
  })

});


// Aplicación de admin con MongoDb Atlas
app.get('/:db/:collection', function (request, response) {
  
  MongoClient.connect(url, function(err, client) {       
    client.db(request.params.db).collection(request.params.collection)
    .find()    
    .sort({})
    .toArray( (err, results)=>{
      console.log(err)
      response.send(JSON.stringify(results));
    });    
    client.close()
  });

})

app.get('/:db/:collection/:_id', (request, response, next) => {  
  
  MongoClient.connect(url, function(err, client) {
    console.log(request.params)    
    client.db(request.params.db).collection(request.params.collection).findOne(
      { _id: new mongo.ObjectID(request.params._id)},
      (err, data) => {                 
        response.send(data) 
      }   
    );    
    client.close()
    
  });  
});

app.post('/updateMany', (request, response) => {  
  console.log('actualizando colección: ', request.body) 
  let db = request.body.db; delete request.body.db;
  let collection = request.body.collection; delete request.body.collection;      
  MongoClient.connect(url, function(err, client) {
    client.db(db).collection(collection).deleteMany({});
    client.db(db).collection(collection).insertMany(          
      request.body.array,       
      (err, data) => { 
      response.send(data);
    }); 
    client.close()
  });  
})

app.post('/update', (request, response) => {   
  console.log('actualizando objeto: ', request.body) 
  let id = request.body._id; delete request.body._id;    
  let db = request.body.db; delete request.body.db;
  let collection = request.body.collection; delete request.body.collection;      
  MongoClient.connect(url, function(err, client) {
    client.db(db).collection(collection).update(
      { _id: new mongo.ObjectID(id)}, 
      request.body, 
      {upsert: true}, 
      (err, data) => { 
      response.send(data);
    }); 
    client.close()
  });  
});

app.post('/delete', (request, response) => {    
  console.log(request.body)
  let id = request.body._id; delete request.body._id;    
  let db = request.body.db; delete request.body.db;
  let collection = request.body.collection; delete request.body.collection;      
  MongoClient.connect(url, function(err, client) {
    client.db(db).collection(collection).deleteOne(
      { _id: new mongo.ObjectID(id)},
      (err, data) => { 
      response.send(data);
    }); 
    client.close();
  });  
});

app.post('/:db/:collection', (request, response) => {
// se usa para ordenar datos desde localhost:3000/admin/
  MongoClient.connect(url, function(err, client) { 
    console.log(request.body)
    client.db(request.params.db).collection(request.params.collection)    
    .find(request.body.find)
    .sort(request.body.sort)
    .toArray( (err, results) => { 
      // console.log(`insertando en: ${request.params.db}, collection: ${request.params.collection}`)
      // console.log(results)
      response.send(results); });
    client.close()
  });
  
})
// fin Atlas

app.get('/info', (req, res) => {    
  MongoClient.connect(url, function(err, client) { 
    client.db('ifcd0112').collection('ufs').find()
    .toArray( (e,d) =>  res.send(d) )
    // .find({}, ( err, data ) => {
    //   res.send(data)
    // });
  });
  
});

app.get('/dbs', (req, res) => {
// mongo show databases
  MongoClient.connect(url, function(err, client) {
    const adminDb = client.db().admin();
    adminDb.listDatabases(function(err, dbs) {
      console.log(dbs.databases)     
      res.send(dbs.databases)
    });    
  });
});

app.get('/colls', (req, res) => {
  // show collections  
  MongoClient.connect(url, function(err, client) {    
    client.db(req.query.db).listCollections().toArray( (e,d) =>  res.send(d) );
  });
})

app.post('/test', (req, res) => {
  fs.appendFile('/home/ras/evaluacion.txt', JSON.stringify(req.body), function (err) {
    if (err) throw err;
    console.log(req.body)
    res.send(req.body)    
  });
});

app.get('/mongo', (req, res) => {
  console.log( url );
  res.send({ok: true, msg: 'enviados datos de Atlas a consola'})
})

app.listen(port, function() {
  console.log(`server ok en puerto ${port}`)
})


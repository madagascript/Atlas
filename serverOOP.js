class App {
  constructor(){}
  static showCollection(req, res){
    mongoCli.db(req.params.db).collection(req.params.collection).find().sort({})
    .toArray( (err, results) => { res.send(results) });  
  }
  static showDocument(req, res){
    // los ObjectId de Mongo son string de 24 caracteres Hexadecimales, 
    // si no mide 24, no hay que buscar porque petaría el server;
    if ( request.params.id.length !== 24 ) { response.send({}) }
    else {
      mongoCli.db(request.params.db).collection(request.params.collection)
      .findOne({ _id: new mongo.ObjectId(request.params.id) }, (err, results) => { response.send(results)} )  
    }
  }
}


//Iniciar server: nodemon server.js mongodb+srv://curso:ifcd0112@cluster0-6m3ok.mongodb.net
const express = require('express');
const bodyParser = require('body-parser')
const mongo = require('mongodb') 
const app = express();
const MongoClient = mongo.MongoClient;
const url = process.argv[2]
const port = process.argv[3] ? process.argv[3] : 3000
var mongoCli = null;

MongoClient.connect(url, function(err, client) {    
  mongoCli = client
 });

app.get( '/:db/:collection', App.showCollection )
app.get('/:db/:collection/:id', App.showDocument )

app.listen(port, function() {
  console.log(`server ok en puerto ${port}`)
})


class App {
  constructor(){}
  static showCollection(req, res){
    mongoCli.db(req.params.db).collection(req.params.collection).find().sort({})
    .toArray( (err, results) => { res.send(results) });  
  }
  static showDocument(req, res){
    // los ObjectId de Mongo son string de 24 caracteres Hexadecimales, 
    // si no mide 24, no hay que buscar porque petaría el server al crear el ObjectId();
    if ( req.params.id.length !== 24 ) { res.send({}) }
    else {
      mongoCli.db(req.params.db).collection(req.params.collection)
      .findOne({ _id: new mongo.ObjectId(req.params.id) }, (err, results) => { res.send(results)} )  
    }
  }
  static server(req, res){
    res.download('serverOOP.js');
  }
}

const express = require('express');
const mongo = require('mongodb') 
const app = express();
const url = process.argv[2]
const port = process.argv[3] ? process.argv[3] : 3000
var mongoCli = null;

mongo.MongoClient.connect(url, (err, client) => mongoCli = client );

app.get( '/:db/:collection', App.showCollection )
app.get('/:db/:collection/:id', App.showDocument )
app.get('/server', App.server )

app.listen(port, function() {
  console.log(`server ok en puerto ${port}`)
})


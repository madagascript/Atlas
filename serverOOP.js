function connError(res) {
  console.log('error de conexión a Atlas, con esta URL: ', url);
  res.send({ ok: false, message: 'Express no puede conectar con Atlas, espera un momento, por favor' })
}

function logIp(req, msg, data){
  console.log('------------------------------->')
  console.log('new request at', new Date().toLocaleString());
  console.log(msg, req.socket.remoteAddress)
  console.log(data)
}
class App {
  constructor(){ }
  static showCollection(req, res){
    logIp(req, 'App.showCollection() from IP:', {});
    if ( !mongoCli ){ connError(res) } else {
      mongoCli.db(req.params.db).collection(req.params.collection).find().sort({}).toArray( (err, results) => { 
        res.send(results ? results : err)
      });
    }  
  }

  static findSort(req, res){
    logIp(req, 'App.findSort() from IP:', {});
    if ( !mongoCli ){ connError(res) } else {      
      mongoCli.db(req.body.db).collection(req.body.collection)
      .find(req.body.find)
      .sort(req.body.sort).toArray( (err, results) => { 
        res.send(results ? results : err)
      });
    }  
  }

  static showDocument(req, res){
    logIp(req, 'App.showDocument() from IP:', req.body);
    if (!mongoCli){ connError(res) } else {    
      // los ObjectId de Mongo son string de 24 caracteres Hexadecimales, 
      // si no mide 24, no hay que buscar porque petaría el server al crear el ObjectId();
      if ( req.params.id.length !== 24 ) { res.send({}) }
      else {
        mongoCli.db(req.params.db).collection(req.params.collection)
        .findOne(
          { _id: new mongo.ObjectId(req.params.id) }, 
          (err, results) => { 
            res.send(results ? results : err);
          });  
      }
    }
  }  
  static server(req, res){
    logIp(req, 'App.server() from IP:', {});
    res.download('serverOOP.js');
  }
  static _update(req, res){
    logIp(req, 'App._update() from IP:', req.body);
    let id = ( req.body._id && req.body._id.length == 24 ) ? new mongo.ObjectID(req.body._id) : new mongo.ObjectID()
    // hace update si recibe _id en body, e insert en otro caso:    
    delete req.body._id
    if ( !mongoCli ){ connError(res) } else { 
      mongoCli.db(req.params.db).collection(req.params.collection).replaceOne(
        { _id: id}, req.body, {upsert: true},
        (err, data) => { res.send(data ? data : err) }
      );
    }
  }
  static _delete(req, res){    
    logIp(req, 'App._delete() from IP:', req.params);
    // console.log(`deleting: ${JSON.stringify(req.params)}`)
    if ( !mongoCli ){ connError(res) } else { 
      mongoCli.db(req.params.db).collection(req.params.collection)
      .deleteOne({ _id: new mongo.ObjectID(req.params.id) }, (err, data) => { res.send( data ? data : err) });
    }
  }
  static getDbs(req, res){
    logIp(req, 'App.getDbs() from IP:', {});
    if ( !mongoCli ){ connError(res) } else { 
      const adminDb = mongoCli.db().admin();
      adminDb.listDatabases(function(err, data) { res.send(data ? data.databases : err) });   
    } 
  }
  static getCollections(req, res){
    logIp(req, 'App.getCollections() from IP:', req.query);
    if ( !mongoCli ){ connError(res) } else { 
      mongoCli.db(req.query.db).listCollections().toArray( (e,d) =>  res.send(d ? d : e) );    
    }
  }
  static insertMany(req, res){
    logIp(req, 'App.updateMany() from IP:', req.query);
    if ( !mongoCli ){ connError(res) } else { 
      mongoCli.db(req.params.db).collection(req.params.collection).deleteMany({});
      mongoCli.db(req.params.db).collection(req.params.collection).insertMany( req.body, (err, data) => res.send( data ? data : err ));
    }
  }

}

const express = require('express');
const mongo = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const url = process.argv[2];
const port = process.argv[3] ? process.argv[3] : 3000
var mongoCli = null;

mongo.MongoClient.connect(url, (err, client) => mongoCli = client );

app.use(bodyParser.json());
app.use( express.static('public') );
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
  res.header('Content-Type', 'application/json');
  next();
});

app.get( '/:db/:collection', App.showCollection ); // curl http://localhost:3000/domingo/posts
app.post( '/:db/:collection', App._update ); // curl -X POST http://localhost:3000/domingo/posts -d '{}'
app.put('/:db/:collection', App.insertMany );

app.delete( '/:db/:collection/:id', App._delete ); // curl -X DELETE http://localhost:3000/domingo/posts/5b5993710668260c701655d4 
app.get('/:db/:collection/:id', App.showDocument ); // curl http://localhost:3000/domingo/posts/5b5993710668260c701655d4

app.post('/findSort', App.findSort ); 

app.get('/server', App.server ); 
app.get('/dbs', App.getDbs );
app.get('/colls', App.getCollections ); // curl localhost:3000/colls?db=test
app.get('/test', (req, res) => {})

app.listen(port, function() {
  console.log(`iniciado server en puerto ${port} a las ${new Date()}`)
})




/* 
arquitectura:

a) el estado de la ventana en cada momento representa el estado de cosas sobre el que quiero interactuar;
las clases y métodos se intentan llamar sin parámetros para que obtengan la información necesaria de los valores de pantalla;

b) el server no ve el request.body en peticiones $.get(), así que $.post() si hay que enviar datos en body

*/



const defaultDb = 'curso', defaultCollection = 'alumnos'


/* clases de la aplicación */
class App{
  constructor(){
    $('#db').text(defaultDb);
    $('#collection').text(defaultCollection)
    new MongoDb().list()
  }
}

class MongoDoc {
  constructor(){    
    this.db = $('#db').text();
    this.collection = $('#collection').text();
  }
  setProp(){    
    let cliente = JSON.parse($('#cliente').text())
    cliente[$('#nombreProp').text()] = $('#newPropValue').val();
    $('#cliente').text( JSON.stringify(cliente) )
  }
  showProp(){
    $('#edicionProps').show();
    $('#newPropValue').val( $( "#sel2 option:selected" ).text() );
    $('#nombreProp').text( $('#sel2').val() )
  }
  show(){
    this._id = $('#sel1').val()
    this.db = $('#db').text();
    this.collection = $('#collection').text();    
    let url = `/${this.db}/${this.collection}/${this._id}`
    $('#edicionProps').hide()
    $('#cliente').css({ color: 'red'});
    $.getJSON( url, data => {       
      $('#cliente').text( JSON.stringify(data, undefined, 2) );
      $('#cliente').css({ color: 'green'});
      if ( data.html ) {  
        $('#showHtml').html( atob(data.html) )
        $('#textHtml').val( atob(data.html) )
        // $('#showHtml').html( data.html )
        // $('#textHtml').text( data.html )
      } else {
        $('#showHtml').html('')
        $('#textHtml').val('')
      }
      // showProps(data);
      this.showProps()
      // $('#sel2').change()
    });
  }
  showProps(){
    let items = [];
    let obj = JSON.parse($('#cliente').text())
    $.each( obj, function( key, val ) {    
      if ( key != '_id') { 
        let str = `<option value="${key}">${val}</option>`;
        items.push( str ); 
      }  
    });
    $('#sel2').html(items.join(''));    
    $('#sel2').change();
  }
  delete(){
    // datos: db, coll, _id
    this._id = $('#sel1').val()
    $.post( '/delete', this, ( data ) => { 
      new MongoDb(this.db, this.collection).list()
     });  
  }
  update(){
    let obj = JSON.parse( $('#cliente').text() )
    obj.db = this.db; obj.collection = this.collection            
    $.ajax({
      type: 'POST',
      url: '/update',
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',
      data: JSON.stringify(obj),
      async: true,
      success: (data) => { new MongoDb().list() }
    });
  } 
}

class MongoDb {
  constructor(){
    this.db = $('#db').text() ? $('#db').text() : defaultDb;
    this.collection = $('#collection').text() ? $('#collection').text() : defaultCollection;
  }
  list(){        
    let url = `/${this.db}/${this.collection}`;      
    let data = {
      find: JSON.parse($('#strFind').text()),
      sort: JSON.parse($('#strSort').text())
    } 
    console.log(data)
    // activar orden según esté el checkbox y la cadena de búsqueda:
    if ( document.getElementById('sortBy').checked ) {      
      // let body = JSON.parse( $('#strSort').text() )
      // $.post( url, body, data => this.makeSelector(data) );
      $.ajax({
        type: 'POST',
        url: url,
        beforeSend: (request) => {
          request.setRequestHeader("Content-Type", "application/json");
        },
        dataType: 'json',
        data: JSON.stringify(data),
        async: true,
        success: (data) => { this.makeSelector(data)   }
      });
    } 
    else {        
      $.getJSON( url, data => this.makeSelector(data) );      
    }
  }
  makeSelector(data){
    let items = [];
    $.each( data, function( key, val ) {      
      let str = `<option value="${val._id}">${key+1}.- ${val.nombre} - ${val._id} </option>`
      items.push( str );
    });      
    $('#sel1').html(items.join(''));
    new MongoDoc().show();
  }

}

/* Prototipos */
class ProtoLink {
  constructor(){
    this.nombre ='nombre del enlace';
    this.url = 'http://';
    this.setCollection('blog','links');
    this.draw();
  }
  setCollection(db, collection){
    $('#db').text(db);
    $('#collection').text(collection);
  }
  draw(){
    $('#cliente').text( JSON.stringify(this) );
    new MongoDoc().showProps()
  }
}

function changeTextHtml(){  
  $('#showHtml').html( $('#textHtml').val() )
  let doc = JSON.parse( $('#cliente').text() )
  doc.html = btoa($('#textHtml').val())
  $('#cliente').text( JSON.stringify(doc))
}

/*
pruebas y cosas para explicación:

*/

function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log('respuesta ok:', this.responseText)     
    }
  };
  xhttp.open("GET", "https://api.ipify.org?format=json", true);
  xhttp.send();
}

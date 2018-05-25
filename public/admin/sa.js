class App {
  constructor(){
    // console.log('App constructor ');
    // inicializar eventos:
    $('#databases').on('change', () => {      
      let db = $('#databases').val()
      this.changeDatabase(db)      
    });
    $('#collections').on('change', () => {      
      //hacer un find de todo
      this.changeCollection()
    });
    // llenar el select primera vez
    this.getDatabases(this.dbs2select)
    
    
    
  }
  
  getDatabases(callback){
    $.ajax({
      type: 'GET',
      url: '/dbs',
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',      
      async: true,
      success: (d) => { callback(d) }
    });
  }

  dbs2select(data){    
    let destino = $('#databases'), html = ''
    destino.html(html);
    data.forEach(element => {
      html += `<option value="${element.name}">${element.name} - ${element.sizeOnDisk / 1024}</option>`
    });
    destino.html(html);
    destino.change()
  }

  colls2select(data){    
    let destino = $('#collections'), html = ''
    destino.html(html);
    data.forEach(element => {
      console.log(element)
      html += `<option value="${element.name}">${element.name}</option>`
    });
    destino.html(html);
    destino.change();
  }

  changeDatabase(dbname){
    this.db = dbname;
    $.ajax({
      type: 'GET',
      url: `/colls?db=${this.db}`,
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',      
      async: true,
      success: (d) =>  this.colls2select(d)
    });
  }

  changeCollection(){
    let url = `/${$('#databases').val()}/${$('#collections').val()}`
    $('#out').css({ color: 'white'})
    $.ajax({
      type: 'GET',
      url: url ,
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',      
      async: true,
      success: (d) =>  {
        this.collection = $('#collections').val()
        $('#out').text( JSON.stringify(d, undefined, 2)).css({ color: 'black'})
        // $('#out').css({ color: 'black'})
      }
    })
  }

  sendData(){
    let data = {
      db: $('#databases').val(),
      collection: $('#collections').val(),
      array: JSON.parse( $('#out').text() )
    }    
    $('#out').css({ color: 'white'})
    $.ajax({      
      type: 'POST',
      url: '/updateMany' ,
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',      
      data: JSON.stringify(data),
      async: true,
      success: (d) =>  {
        $('#databases').change();
        $('#collections').change();
        $('#out').css({ color: 'black'})
        console.log(d)
      }
    });
    console.log(this)
  }

}


var app = new App()
$(document).on("keypress", function (e) {
  // AltGr-s muestra el botón  
  console.log(e.which)
  if ( e.which == 223 ) {
    $('#guardar').toggle()
  }  
});
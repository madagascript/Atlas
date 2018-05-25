
/* 
a) listar respuestas de un módulo fijo

*/
var db = 'domingo', 
    collection = 'email',
    url = `/${db}/${collection}`


/* clases de la aplicación */
class App{
  constructor(){  }
  pushForm(){
    let newEmail = {
      db: db,
      collection: collection,
      email: formAlumno.elements['email'].value,
      nombre: formAlumno.elements['nombre'].value,
      apellidos: formAlumno.elements['apellidos'].value,
      fecha: new Date().toLocaleString()
    }
    // formAlumno.elements['email'].value
    $.ajax({
      type: 'POST',
      url: '/update',
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',      
      data: JSON.stringify(newEmail),
      async: true,
      success: (data) => { 
        $('#mensaje').text('email enviado, gracias').css('color', 'green')
        $('#formAlumno').hide()
       } 
    });    
    console.log( newEmail )    

  }
}

function depaso(){
  let newEmail = {
    email: formAlumno.elements['email'].value,
    nombre: formAlumno.elements['nombre'].value,
    fecha: new Date().toLocaleString()
  }
  // formAlumno.elements['email'].value
  console.log( newEmail )
}
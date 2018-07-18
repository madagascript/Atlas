
/* 
a) listar respuestas de un módulo fijo

*/
var db = 'ifcd0112', 
    collection = 'examenes-mod2',
    url = `/${db}/${collection}`

$('#db').text(db); $('#collection').text(collection);    
/* clases de la aplicación */
class App{
  constructor(){  }
  getExamenes(){    
    let db = $('#db').text(), collection = $('#collection').text(), url = `/${db}/${collection}`
    $.getJSON(url, (data) => { this.showExamenes(data)})
  }
  showExamenes(data){
    let html = ''
    data.forEach(element => {
      let title = `      
      \r\nuf1: ${element.uf1.puntuacion} - (ok: ${element.uf1.correctas}, ko: ${element.uf1.incorrectas}, -: ${element.uf1.blanco})
      \r\nuf2: ${element.uf2.puntuacion} - (ok: ${element.uf2.correctas}, ko: ${element.uf2.incorrectas}, -: ${element.uf2.blanco})      
      \r\nuf3: ${element.uf3.puntuacion} - (ok: ${element.uf3.correctas}, ko: ${element.uf3.incorrectas}, -: ${element.uf3.blanco})      
      `
      html += `<li title="${title}" onclick="">${element.nombre} - ${element.dni} [${element.fecha}] (${element._id})</li>
      <code style="color: red">${JSON.stringify(element.uf1.errores)}</code>
      <code style="color: red">${JSON.stringify(element.uf2.errores)}</code>
      <code style="color: red">${JSON.stringify(element.uf3.errores)}</code>`
    });
    $('#lista').html(html)
  }
}

var app = new App();
setInterval( v  =>  {
  new App().getExamenes()
  }, 30000)
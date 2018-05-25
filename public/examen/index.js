// al cambiar de módulo hay que cambiar collection de momento
const db = 'ifcd0112', collection = 'examenes-mod1'

class App {  
  constructor(){  }

  readTest(){        
    let allTest = ''    
    for (let index = 0; index < 30; index++) {
      let selector = `input[name=p${index}]:checked`
      switch ($(selector).val()) {
        case undefined:
        allTest += '-'
          break;      
        default:
        allTest += $(selector).val()      
          break;
      }
    }    
    let uf1 = allTest.substr(0,10)
    let uf2 = allTest.substr(10,10)
    let uf3 = allTest.substr(20,10)    
    return { 'uf1': uf1, 'uf2': uf2, 'uf3': uf3 }    
  }

  pushTest(data){    
    $.ajax({
      type: 'POST',
      url: '/update',
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',      
      data: JSON.stringify(data),
      async: true,
      success: (data) => { 
        $('#mensaje').text('examen enviado, revisa los resultados').css('color', 'green')
       } // de momento no enseño la nota a los alumnos, sólo se graba en Mongo
    });
  }

  corrigeTest(){
    let test = this.readTest()
    let uf1 = test.uf1
    let uf2 = test.uf2
    let uf3 = test.uf3
    let query = `?uf1=${test.uf1}&uf2=${test.uf2}&uf3=${test.uf3}`
    $('#mensaje').text('enviando examen al server').css('color', 'red')
    $.ajax({
      type: 'GET',
      url: '/corregir' + query,
      beforeSend: (request) => {
        request.setRequestHeader("Content-Type", "application/json");
      },
      dataType: 'json',      
      async: true,
      success: (data) => { 
        data.dni = $('#dni').val()
        data.nombre = $('#alumno').val()
        data.fecha = new Date().toLocaleString()
        data.db = db
        data.collection = collection // cambiar la collection en cada módulo
        this.pushTest(data) 
      }
    });
  }


}


// let p0 = $('input[name="p0"]:checked').val()
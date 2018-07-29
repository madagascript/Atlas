class App {

  constructor(){
    this.urlRoot = 'http://localhost:3000/';
    this.urlDataBases = 'http://localhost:3000/dbs';
    this.urlCollections = 'http://localhost:3000/colls?db=';
  }

  getDbs(s, h){
    h.get(this.urlDataBases).then( resp => s.databases = resp.data  )
  }

  getCollections(s, h){
    h.get(this.urlCollections + s.database).then( resp => s.collections = resp.data )
  }

  showCollection(s, h){
    let url = this.urlRoot + `${s.database}/${s.collection}`
    h.get( url ).then( resp => s.documents = resp.data )
  }
}


var app = new App();
angular.module('ejemplos', [])
.controller('c1', function($scope, $http) {      
    app.getDbs($scope, $http);
    $scope.changeDb = function(){ app.getCollections($scope, $http) }
    $scope.changeCollection = function(){ app.showCollection($scope, $http) }
})

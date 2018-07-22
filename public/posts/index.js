class App {
  constructor(){}
}



  var app = new App();
  angular.module('posts', [])
  .controller('c1', function($scope, $http) {      
      $scope.html = 'hola'
  })


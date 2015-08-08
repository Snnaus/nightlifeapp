'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.city = '';
    $scope.findBars = function(city){
      if(city){
        $http.post('/api/bars/search/'+city, { location: city, category_filter: "bars" }).success(function(results){
          console.log(results);
        });
      }
    };
  });

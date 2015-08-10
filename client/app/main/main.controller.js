'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $modal) {
    $scope.city = '';
    $scope.activeBars = [];
    $scope.searched = false;
    $scope.findBars = function(city){
      var actBars = [];
      if(city){
        var rawBars = [], activeBars = {};
        $http.post('/api/bars/search/'+city, { location: city, category_filter: "bars" }).success(function(results){
          rawBars = JSON.parse(results);
        }).then(function(){
          $http.post('/api/bars/check', { "location.city" : city }).success(function(bars){
          bars.forEach(function(bar){
            activeBars[bar.yelpID] = bar;
          });}).then(function(){
            actBars = rawBars.businesses.map(function(bar){
            if(activeBars === {}){
              if(activeBars.keys.indexOf(bar.id) !== -1){
                return activeBars[bar.id];
              }
            } else{
              return {
                name: bar.name,
                yelpID: bar.yelpID,
                location: bar.location,
                patrons: []
              };
            }
        });
            $scope.activeBars = actBars;
            $scope.searched = true;
        });
        });
        
        
      }
    };
    
    $scope.openModal = function(){
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'app/account/login/modalLogin.html',
        controller: 'LoginCtrl',
        size: 'lg'
      });
    };
  });

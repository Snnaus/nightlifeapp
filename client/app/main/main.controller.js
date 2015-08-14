'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, $modal, Auth, $interval) {
    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.isAdmin = Auth.isAdmin();
    $scope.getCurrentUser = Auth.getCurrentUser();
    
    
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
          $http.get('/api/bars').success(function(bars){
            bars = bars.filter(function(bar){ return rawBars.businesses.map(function(bar){return bar.id}).indexOf(bar.yelpID) !== -1});
            bars.forEach(function(bar){
              activeBars[bar.yelpID] = bar;
            });}).then(function(){
              actBars = rawBars.businesses.map(function(bar){
                if(Object.keys(activeBars).indexOf(bar.id) !== -1){
                  return activeBars[bar.id];
                } else{
                  return {
                    name: bar.name,
                    yelpID: bar.id,
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
    
    var openModal = function(){
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'app/account/login/modalLogin.html',
        controller: 'LoginCtrl',
        size: 'lg'
      });
      
      modalInstance.result.then(function(){
        $scope.isLoggedIn = Auth.isLoggedIn();
        $scope.isAdmin = Auth.isAdmin();
        $scope.getCurrentUser = Auth.getCurrentUser();
      });
    };
    
    $scope.joinBar = function(bar, user, actBars){
      if(!user._id){
        openModal();
      } else{
        user.bars.push(bar.yelpID);
        $http.post('api/users/update/'+user._id, { bars: user.bars });
        if(bar.patrons.length > 0){
          bar.patrons.push({
            name: user.name,
            userID: user._id
          });
          $http.put('api/bars/'+bar._id, { patrons: bar.patrons });
        }else{
          bar.patrons.push({
            name: user.name,
            userID: user._id
          });
          $http.post('api/bars/', bar).success(function(newBar){
            actBars[actBars.map(function(neobar){ return neobar.yelpID }).indexOf(newBar.yelpID)] = newBar;
          });
      }
    };
  };
  
    $scope.leaveBar = function(bar, user){
      var index = bar.patrons.map(function(patron){
        return patron.userID;
      }).indexOf(user._id);
      var garbage = bar.patrons.splice(index, 1);
      var userIndex = user.bars.indexOf(bar.yelpID);
      garbage = user.bars.splice(userIndex, 1);
      $http.post('/api/users/update/'+user._id, { bars: user.bars });
      if(bar.patrons.length){
        $http.put('/api/bars/'+bar._id, { patrons: bar.patrons });
      }else{
        //console.log(bar);
        $http.delete('/api/bars/'+bar._id);
      }
    };
    
    $scope.checkGo = function(bar, user){
      if(!user){
        return true;
      } else{
        var check = bar.patrons.map(function(pat){
          return pat.userID;
        }).indexOf(user._id);
        return check === -1;
      }
    };
    
    var checkLogin = function(){
      $scope.isLoggedIn = Auth.isLoggedIn();
      $scope.isAdmin = Auth.isAdmin();
      $scope.getCurrentUser = Auth.getCurrentUser();
    };
    
    var timer = $interval(checkLogin, 250);
    $scope.$on('$destroy', function(){
      $interval.cancel(timer);
    });
});
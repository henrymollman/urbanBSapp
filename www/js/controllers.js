angular.module('starter.controllers', ['starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('LobbyCtrl', function($scope, $stateParams, $http) {

  $http.get('http://urbanbs.herokuapp.com/listGames')
    .success(function(data, status, headers, config) {
      $scope.games = data;
    })
    .error(function(data, status, headers, config) {
      console.log(data);
    });

     

})

.controller('CreateCtrl', function($scope, $stateParams, $http, Game, Players, facebook) {

  $scope.invitedPlayers = {};
  $scope.gameObj = {};

  $scope.createGame = function() {

      var req = {
        method: 'POST',
         url: 'http://urbanbs.herokuapp.com/addGame',
         headers: {
           'Content-Type': 'application/json',
         },

         data: {"name": $scope.gameObj.gameName, "gameId": 0, "players": $scope.invitedPlayers, "currentQuestion": "null", 
                "round": 0, "roundLimit": $scope.gameObj.roundLimit, "dealer": "null"}
        }

        console.log(req.data)

      $http(req)
        .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        console.log('success http post')
      }).
      error(function(data, status, headers, config) {
      console.log('error http post')

      });
    };


  $scope.getPlayers = function() {
      $http.get('http://urbanbs.herokuapp.com/listUsers')
      .success(function(data, status, headers, config) {
        $scope.playerList = data;
        console.log($scope.playerList);
      })
      .error(function(data, status, headers, config) {
        console.log(error)
      });
    };

    $scope.invitePlayer = function(fbId) {
      $scope.playerList.forEach(function(player) {
        if (player.fbId === fbId) {
          $scope.invitedPlayers[fbId] = player;
        }
      });
    };

   

    $scope.getPlayers();
    

})

.controller('GameCtrl', function($scope, $stateParams, $http, Game, Players, facebook){

  var url = 'http://urbanbs.herokuapp.com/listGames/';

  $scope.invitations = [];

  // side menu needed for inviting player during game
  $scope.invitePlayer = Game.invitePlayer;

  // set index of game from hyperlink clicked in lobby
  var index = +[$stateParams['gameId']];

  // initially load page with available games
   $http.get(url)
    .success(function(data, status, headers, config) {

      $scope.gameData = data[index];
      $scope.getQuestion()
      // $scope.getInvites();
    })
    .error(function(data, status, headers, config) {
      console.log(error)
  });


    $scope.getQuestion = function() {
      console.log($scope.gameData)
      $http.get('http://urbanbs.herokuapp.com/currentQuestion')
        .success(function(data, status, headers, config) {
          $scope.gameData.currentQuestion = data;
          console.log(localStorage);
    })
    .error(function(data, status, headers, config) {
      console.log(error)
  });

    },

      $scope.getInvites = function() {
      
      var url = 'http://urbanbs.herokuapp.com/invites'
      console.log('inviting players')
      $http.get(url)
        .success(function(data, status, headers, config) {
          console.log(data)
          var invites = [];
          data.forEach(function(player) {
            invites.push(player)
          });

          $scope.invitations = invites;
        })

        .error(function(data, status, headers, config) {
          console.log('error')
        });
    };

    $scope.voteTrue = function() {
      console.log(localStorage);
      console.log($scope.gameData);
      var id = localStorage.gameId;
      $scope.gameData.players[id].answer = true;
    }

    $scope.voteFalse = function() {
      console.log(localStorage);
      console.log($scope.gameData);
      var id = localStorage.gameId;
      $scope.gameData.players[+id].answer = false;
    }

})



  .directive('dealerView', function() {
    return {
      templateUrl: 'templates/dealer.html'
    };
  })


  .controller('LoginCtrl', function ($scope, $state, facebook) {
    $scope.fbLogin = facebook.fbLogin;

    $scope.getLoginStatus = facebook.getLoginStatus;
    $scope.getCookie = function (c_name) {
      console.log(localStorage);
    if (typeof localStorage != "undefined") {
    //    return localStorage.getItem(c_name);
    console.log(localStorage);
    }
    // else {
    //     var c_start = document.cookie.indexOf(c_name + "=");
    //     if (document.cookie.length > 0) {
    //         if (c_start !== -1) {
    //             return getCookieSubstring(c_start, c_name);
    //         }
    //     }
    //     return "";
    // }
}
    
  });
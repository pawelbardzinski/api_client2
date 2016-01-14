app.controller('sessionsController', ['$scope', '$http', '$timeout', '$cookies', function($scope, $http, $timeout, $cookies) {
  var url = "http://localhost:3000/api/v1"
  var userData = $cookies.get('userData')
  $scope.newList = {}

  if (userData) {
    $scope.userData = JSON.parse(userData);
  }
  verifyIfSignedIn = function() {
    if ($scope.userData && $scope.userData.auth_token) {
      $scope.fetchLists();
      $scope.userSignedIn = true;
    }
  }

  $scope.logIn = function() {
    var resolved = function(response) {
      $cookies.put('userData', JSON.stringify(response.data), {
        path: '/'
      })
      $scope.userData = response.data;
      $scope.userSignedIn = true;
      $scope.errorMessage = "";
      $scope.fetchLists();
    }
    var rejected = function(response) {
      $scope.errorMessage = "Username or password is invalid";
    }

    var data = {
      email: $scope.email,
      password: $scope.password
    }
    var requestUrl = url + "/sessions";
    return $http.post(requestUrl, data).then(resolved, rejected);
  }

  $scope.logOut = function() {
    var resolved = function(response) {
      $cookies.remove('userData', {
        path: '/'
      })
      $scope.userSignedIn = false;
    }
    var rejected = function(response) {
      $cookies.remove('userData', {
        path: '/'
      })
      $scope.userSignedIn = false;
    }

    var data = {
      email: $scope.email,
      password: $scope.password
    }

    var req = {
      method: 'DELETE',
      url: url + "/sessions",
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }
    $http(req).then(resolved, rejected);
  }

  $scope.fetchLists = function() {
    var resolved = function(response) {
      $scope.lists = response.data
    }
    var rejected = function(response) {}

    var req = {
      method: 'GET',
      url: url + "/users/" + $scope.userData.id + "/lists",
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  }

  deleteFromList = function(id) {
    _.detect($scope.lists, function(list) {
      if (list.id == id) {
        return $scope.lists.splice($scope.lists.indexOf(list), 1);
      }
    })
  }

  $scope.destroy = function(id) {
    deleteFromList(id)
    var resolved = function(response) {}
    var rejected = function(response) {
      if (response.status == 401) {
        $scope.logOut();
        $scope.errorMessage = "Sorry but your session expired, you have been logged out";
      }
    }

    var req = {
      method: 'DELETE',
      url: url + "/users/" + $scope.userData.id + "/lists/" + id,
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  }

  $scope.updateListDescription = function(data, list) {
    var resolved = function(response) {}
    var rejected = function(response) {
      if (response.status == 401) {
        $scope.logOut();
        $scope.errorMessage = "Sorry but your session expired, you have been logged out";
      }
    }

    var req = {
      method: 'PUT',
      url: url + "/users/" + $scope.userData.id + "/lists/" + list.id,
      data: {
        description: data,
        title: list.title
      },
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  };


  $scope.updateListTitle = function(data, list) {
    var resolved = function(response) {}
    var rejected = function(response) {
      if (response.status == 401) {
        $scope.logOut();
        $scope.errorMessage = "Sorry but your session expired, you have been logged out";
      }
    }

    var req = {
      method: 'PUT',
      url: url + "/users/" + $scope.userData.id + "/lists/" + list.id,
      data: {
        description: list.description,
        title: data
      },
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  };

  $scope.createList = function() {
    var resolved = function(response) {
      $scope.lists.push(response.data)
      $scope.newList = {};
    }
    var rejected = function(response) {
      $scope.logOut();
      $scope.errorMessage = "Sorry but there was a problem with saving data and we had to log you out";
    }

    var req = {
      method: 'POST',
      url: url + "/users/" + $scope.userData.id + "/lists/",
      data: {
        description: $scope.newList.description,
        title: $scope.newList.title
      },
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  }

  $scope.$on('session-expired', function(event, args) {
    $cookies.remove('userData', {
      path: '/'
    })
    $scope.userSignedIn = false;
  });

  verifyIfSignedIn();
}]);

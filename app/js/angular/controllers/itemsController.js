app.controller('itemsController', ['$scope', '$http', '$timeout', '$state', '$cookies', '$rootScope', function($scope, $http, $timeout, $state, $cookies, $rootScope) {
  var url = "http://localhost:3000/api/v1"
  var userData = $cookies.get('userData')
  var listId = $state.params.listId;

  $scope.newItem = {}

  if (userData) {
    $scope.userData = JSON.parse(userData);
  }
  verifyIfSignedIn = function() {
    if ($scope.userData && $scope.userData.auth_token) {
      $scope.fetchItems();
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
      $scope.fetchItems();
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
       $rootScope.$broadcast('session-expired');
      $scope.userSignedIn = false;
    }
    var rejected = function(response) {
      $cookies.remove('userData', {
        path: '/'
      })
       $rootScope.$broadcast('session-expired');
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


  $scope.fetchItems = function() {
    var resolved = function(response) {
      $scope.items = response.data;
    }
    var rejected = function(response) {}

    var req = {
      method: 'GET',
      url: url + "/users/" + $scope.userData.id + "/lists/" + listId + "/items",
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  }

  deleteFromItems = function(id) {
    _.detect($scope.items, function(item) {
      if (item.id == id) {
        return $scope.items.splice($scope.items.indexOf(item), 1);
      }
    })
  }

  $scope.destroy = function(id) {
    deleteFromItems(id)
    var resolved = function(response) {}
    var rejected = function(response) {
      if (response.status == 401) {
        $scope.logOut();
        $scope.errorMessage = "Sorry but your session expired, you have been logged out";
      }
    }

    var req = {
      method: 'DELETE',
      url: url + "/users/" + $scope.userData.id + "/lists/" + listId + "/items/" + id,
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  }

  $scope.updateItemState = function(data, item) {
    var resolved = function(response) {}
    var rejected = function(response) {
      if (response.status == 401) {
        $scope.logOut();
        $scope.errorMessage = "Sorry but your session expired, you have been logged out";
      }
    }

    var req = {
      method: 'PUT',
      url: url + "/users/" + $scope.userData.id + "/lists/" + listId + "/items/" + item.id,
      data: {
        state: data,
        title: item.title
      },
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  };


  $scope.updateItemTitle = function(data, item) {
    var resolved = function(response) {}
    var rejected = function(response) {
      if (response.status == 401) {
        $scope.logOut();
        $scope.errorMessage = "Sorry but your session expired, you have been logged out";
      }
    }

    var req = {
      method: 'PUT',
      url: url + "/users/" + $scope.userData.id + "/lists/" + listId + "/items/" + item.id,
      data: {
        description: item.state,
        title: data
      },
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  };

  $scope.createItem = function() {
    var resolved = function(response) {
      $scope.items.push(response.data)
      $scope.newItem = {};
    }
    var rejected = function(response) {
      $scope.logOut();
      $scope.errorMessage = "Sorry but there was a problem with saving data and we had to log you out";
    }

    var req = {
      method: 'POST',
      url: url + "/users/" + $scope.userData.id + "/lists/" + listId + "/items",
      data: {
        state: $scope.newItem.state,
        title: $scope.newItem.title
      },
      headers: {
        'Authorization': $scope.userData.auth_token
      }
    }

    $http(req).then(resolved, rejected);
  }

  verifyIfSignedIn();

}]);

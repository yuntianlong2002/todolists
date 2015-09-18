
angular.module('todoApp', ["firebase"])
  .controller('TodoListController', function TodoListController($scope, $rootScope, $firebaseArray) {

    var url = 'https://recurring2do.firebaseio.com';
	  var fireRef = new Firebase(url);
	  // Bind the todos to the firebase provider.
	  $scope.todos = $firebaseArray(fireRef);
    $scope.newTodo = '';
	var uid = -1;

    $scope.addTodo = function() {
      var newTodo = $scope.newTodo.trim();
		  if (!newTodo.length) {
			     return;
		  }
		  $scope.todos.$add({
			     title: newTodo,
			     completed: false,
           finishtime: 'Mon Jan 01 1900'
		  });
		  $scope.newTodo = '';
		console.log($rootScope.display_name);
    };

	$scope.login = function() {
		fireRef.authWithOAuthPopup("facebook", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
			console.log("new version!");
		    console.log(authData.facebook.id);
			console.log(authData.facebook.displayName);
			uid = authData.facebook.id;
			$rootScope.display_name = authData.facebook.displayName;
		  }
		}, {
		  scope: "email" // the permissions requested
		});
	}
	
	$scope.iflogin = function() {
		if(!$rootScope.display_name)
			return "Login";
		return $rootScope.display_name;
	}

    $scope.remaining = function() {
      var count = 0;
      var d = new Date();
      $scope.todos.forEach(function (todo) {
        count += todo.completed ? 0 : 1;
        if (todo.finishtime != d.toDateString()) {
          todo.completed = false;
        }
      });
      return count;
    };

    $scope.finish = function(todo) {
      var d = new Date();
      if (!todo.completed) {
          todo.completed = true;
      } else {
          todo.completed = false;
      }
      todo.finishtime = d.toDateString();
      $scope.todos.$save(todo);
    };

    $scope.removeTodo = function (todo) {
		    $scope.todos.$remove(todo);
	  };

    $scope.archive = function() {
      $scope.todos.forEach(function (todo) {
			if (todo.completed) {
				$scope.removeTodo(todo);
			   }
		  });
    };

  });

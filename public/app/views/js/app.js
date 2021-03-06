angular.module('userService', [])
.factory('User', function($http) {
// create a new object
var userFactory = {};
// get a single user
userFactory.get = function(id) {
return $http.get('/api/users/' + id);
};
// get all users
userFactory.all = function() {
return $http.get('/api/users/');
};
// create a user
userFactory.create = function(userData) {
return $http.post('/api/users/', userData);
};
// update a user
userFactory.update = function(id, userData) {
return $http.put('/api/users/' + id, userData);
};
// delete a user
userFactory.delete = function(id) {
return $http.delete('/api/users/' + id);
};
// return our entire userFactory object
return userFactory;
}); 

angular.module('authService', [])
// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Auth', function($http, $q, AuthToken) {
// create auth factory object
var authFactory = {};
// handle login
// handle logout
// check if a user is logged in
// get the user info
// return auth factory object
return authFactory;
})
// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================
.factory('AuthToken', function($window) {
var authTokenFactory = {};
// get the token
// set the token or clear the token
return authTokenFactory;
})




// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', function($q, AuthToken) {
	var interceptorFactory = {};
	// attach the token to every request
	// redirect if a token doesn't authenticate
	return interceptorFactory;
	})

// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================
.factory('AuthToken', function($window) {
	var authTokenFactory = {};
	// get the token out of local storage
	authTokenFactory.getToken = function() {
	return $window.localStorage.getItem('token');
	};

	// function to set token or clear token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage
	authTokenFactory.setToken = function(token) {
	if (token)
	$window.localStorage.setItem('token', token);
	else
	 $window.localStorage.removeItem('token');
	};
	return authTokenFactory;
	})


	// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Auth', function($window, $http, $q, AuthToken) {
	// create auth factory object
	var authFactory = {};
	var usernameLocal;
	var userData ={};
	
	// log a user in
	authFactory.login = function(username, password) {
	// return the promise object and its data
	usernameLocal = username;
	return $http.post('/api/authenticate', {
	username: username,
	password: password
	})
	.success(function(data) {
	 AuthToken.setToken(data.token);		
	return data;
	});
	};
	// log a user out by clearing the token
	authFactory.logout = function() {
	// clear the token
	AuthToken.setToken();
	};

	// check if a user is logged in
	// checks if there is a local token
	authFactory.isLoggedIn = function() {
	if (AuthToken.getToken())
	return true;
	else
	return false;
	};

	authFactory.getToken = function() {
		return AuthToken.getToken();
	}
	// get the logged in user

	// return auth factory object
	return authFactory;
	}) 

// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', function($q, $location, AuthToken) {
	var interceptorFactory = {};
	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {
	// grab the token
	var token = AuthToken.getToken();
	// if the token exists, add it to the header as x-access-token
	if (token)
	config.headers['x-access-token'] = token;
	return config;
	};
	 // happens on response errors
	interceptorFactory.responseError = function(response) {
	 // if our server returns a 403 forbidden response
	if (response.status == 403) {
		AuthToken.setToken();
$location.path('/login');
}

// return the errors from the server as a promise
return $q.reject(response);
};
return interceptorFactory;
});




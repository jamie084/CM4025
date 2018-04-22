// inject the stuff service into our main Angular module
angular.module('loginService', ['authService', 'userService'])

// create a controller and inject the Stuff factory
.controller('userController', function($scope, Auth) {
		var vm = this;
		vm.isLoggedIn = Auth.isLoggedIn();
		vm.error = false;
		vm.credentials = { username: '', password: ''};   
		//vm.username = "test";   


		// get all the stuff
		vm.btn_LoginOnClientclick = function(username, password){
			// var data = {
			// 	username: 'changedUser'
			// };
		

			Auth.login(vm.credentials.username, vm.credentials.password)									
			
			// promise object
			.success(function(data) {
				console.log(Auth.getToken())
				console.log("username ass " + vm.credentials.username)
				
				if (Auth.isLoggedIn()){
					window.location.href = '/';
					vm.username = username;
				}
				else{
					vm.message = data.message;
					vm.error = true;
				}				
			 })		
			 .error(function(data) {
				vm.message = "An error occured, please try again later"
				vm.error = true;
			 });
			
		} //end of btnLogin



		vm.btn_LogOutOnClientClick = function(){
			Auth.logout();
			window.location.href = '/login';						
		}

})

.controller('regController', function($http, Auth){
	
	var vm = this;	
	//controls the bootsrap error panel
	vm.error = false;
	vm.credentials = { username: '', password: '', icon: 1, user_id: ''};
	
//	$scope.firstName = vm.credentials.username;

	
	vm.btn_RegisterOnClientClick = function(){
		//post request to do communicate with the api
		vm.credentials.user_id = getHash(vm.credentials.username);
		$http.post('api/users', vm.credentials).then(successCallback, errorCallback);					
	}

	function getHash(input){
        var hash = 0, len = input.length;
        for (var i = 0; i < len; i++) {
          hash  = ((hash << 5) - hash) + input.charCodeAt(i);
          hash |= 0; // to 32bit integer
        }
        return hash;
	  }
	  	

	//on success function
	function successCallback(result){		
		//if the new user created
		if (result.data.message == "User created!"){
			//automatically logs in the user, and redirects to home pahe
			Auth.login(vm.credentials.username, vm.credentials.password)			
				.success(function(data) {
					
					if (data.success = true){						
						window.location.href = '/';
					}
				});
		}
		else {
			//bootstrap error panel msg & ctrl
			vm.message = result.data.message
			vm.error  = true;			
		}

	};

	function errorCallback(result){
		vm.message = "An error occured, please try again later"
		vm.error = true;
	}
})

;


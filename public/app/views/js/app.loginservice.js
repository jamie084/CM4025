// inject the stuff service into our main Angular module
angular.module('loginService', ['authService', 'userService'])
// create a controller and inject the Stuff factory
.controller('userController', function(Auth) {
		var vm = this;

		vm.error = false;
		vm.credentials = { username: '', password: ''};           

		// get all the stuff
		vm.btn_LoginOnClientclick = function(){
		
			Auth.login(vm.credentials.username, vm.credentials.password)
			// promise object
			.success(function(data) {
				if (Auth.isLoggedIn()){
					window.location.href = '/';
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
	vm.credentials = { username: '', password: ''};

	
	vm.btn_RegisterOnClientClick = function(){
		//post request to do communicate with the api
		$http.post('api/users', vm.credentials).then(successCallback, errorCallback);					
	}

	//on success function
	function successCallback(result){
		
		//if the new user created
		if (result.data.success == true){
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


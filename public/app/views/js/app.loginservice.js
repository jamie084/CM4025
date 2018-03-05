// inject the stuff service into our main Angular module
angular.module('loginService', ['authService'])
// create a controller and inject the Stuff factory
.controller('userController', function(Auth) {
		var vm = this;

		vm.credentials = { username: '', password: ''};
      // alert("loaded " + Auth.isLoggedIn());
      console.log(Auth.isLoggedIn());

		// get all the stuff
		vm.btn_LoginOnClientclick = function(){

			
			Auth.login(vm.credentials.username, vm.credentials.password)
			// promise object
			.success(function(data) {
				if (Auth.isLoggedIn()){
					window.location.href = '/';
				}				
				//alert(JSON.stringify(data));
			// bind the data to a controller variable
			// this comes from the stuffService
	 });		
		} //end of btnLogin

		vm.btn_LogOutOnClientClick = function(){
			Auth.logout();
			window.location.href = '/login';						
		}

})
.controller('logController', function(Auth){
    //alert("loginController")
    console.log("logincontroller")
    var vm = this;
    vm.message = 'Look! I am an loginservice.';
    if (!Auth.isLoggedIn()){
        window.location.href = '/login';
	   }
})


;


angular.module('routerApp', ['routerRoutes', 'loginService',  'gameService', 'ngAnimate', 'chat'])


// create the controller and inject Angular's 
// this will be the controller for the ENTIRE site
.controller('mainController', function() {

	var vm = this;	

  	// create a bigMessage variable to display in our view
   	vm.bigMessage = 'A smooth sea never made a skilled sailor.';

})

// home page specific controller
.controller('homeController', function($http, Auth) {

	var vm = this;	
	counter = 1;
	vm.isLeftDisabled = true;
	vm.user = {}
	vm.isSuccess = false;
	
	console.log();

	// function successCallback(result){
	// 	console.log(result)
	// }

	// function errorCallback(result){

	// }



    this.load = function() {
		console.log("load")

		setUser();
		//console.log(token)
	}
	//get the logged in username based on the token inforation
	function setUser(){
		var token =  {token: Auth.getToken()}
		$http({
			url: 'api/me', 
			method: "GET",
			params: {token: Auth.getToken()}
		 }).then(successCallback, errorCallback);
	//$http.get('api/me', token).then(successCallback, errorCallback);	
	function successCallback(result){

		if ( typeof result.data.username != 'undefined'){
			$http.get('api/users/username:' + result.data.username, token).then(successCallback, errorCallback);
			function successCallback(result){
				vm.user = result.data[0]                       
				console.log(result);
				return vm.user;
			}
			function errorCallback(result){
				return null;
			}
			return vm.user;
		}
	 }     
	 function errorCallback(result){
		 console.log( result)
		 return null;
	 }
	}

	this.left = function(){

		counter -=1;
		if (counter == 1){
			vm.isLeftDisabled = true;
		}
		vm.isRightDisabled = false;		
		changeImgSrc(counter)
	}
	this.right = function(){
		console.log(vm.user)
		counter +=1;
		if (counter == 3){
			vm.isRightDisabled = true;
		}
		vm.isLeftDisabled = false;
		changeImgSrc(counter)
	}

	this.update = function(){
		console.log(vm.user)
		var header =  { "x-access-token": Auth.getToken()}   
        $http.put('api/users/' + vm.user._id, vm.user, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
				vm.isSuccess = true;
              //  updateCounters(result.data.updateValue)
            }

            function errorCallback(result){
                console.log(result)
            } 
	}

	function changeImgSrc(value){
		vm.user.icon = value;
		var img = ""
		switch(value){
			case 1:
				img = "homer";
				break;
				case 2:
				img = "bart";
				break;
			case 3:
				img= "lisa"
				break;
		}

		document.getElementById("imgIcon").src="/app/img/" + img + ".png";
	}

	
	//document.getElementById("imgIcon").src="../template/save.png";
	
})

// about page controller
.controller('aboutController', function() {

	var vm = this;

    	vm.message = 'Look! I am an about page.';
})

// about page controller
.controller('loginController', function() {

	var vm = this;

    	vm.message = 'Look! I am LOGIN.';
})
// contact page controller
.controller('contactController', function() {

	var vm = this;

    	vm.message = 'Contact us! JK. This is just a demo.';
})

.controller('selectGameController', function($http, Auth){
	var vm = this;
	vm.message = 'select a game to play';

	vm.games = [];

	$http({
		url: 'api/games/', 
		method: "GET",
		params: {token: Auth.getToken()}
	 }).then(successCallback, errorCallback);	              
	//on success function
	 function successCallback(result){
		 console.log(result.data[0])
	   for (var i=0; i < result.data.length; i++){
		   vm.games.push({
			name: result.data[i].name,
			players: result.data[i].players.length,
			_id: result.data[i]._id,			
		});
	   }

	  //console.log(mapArray)
	   return this.mapArray;
	 }     
	 function errorCallback(result){
		 // vm.message = "An error occured, please try again later"
		 // vm.error = true;
	 }
	

})

// contact page controller
.controller('registerController', function() {

	var vm = this;

		vm.message = 'register contrll';

		
		
});
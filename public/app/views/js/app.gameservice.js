
angular.module('gameService', ['loginService'])
// contact page controller
.controller('gameController', function($http, Auth, $scope) {
    var vm = this;
    //this.donutCounter = 0;
    var counter = 0
    var ctx;
    var defSrc = "/app/img/";
    var mapSrc = defSrc + "map/";
    var treasureSrc = mapSrc + "TreasureChest/";

    var imgBackground = new Image(50,50);
    imgBackground.src = defSrc + "background-simpson.jpg";
    var imgHomer = new Image(220,360);
    imgHomer.src = defSrc + "homer.png";
    var imgBart = new Image(723,1105);
    imgBart.src= defSrc + "bart.png";
    var imgDonut = new Image(20,20);
    imgDonut.src = defSrc + "donut.png";
    var imgGround05 = new Image(128,128);
    imgGround05.src = mapSrc + "ground05.png";
    var imgTreasureChest = new Image(128,128);
    imgTreasureChest.src = treasureSrc + "chestFull.png"
   // var imgGround07 = new Image(100,100);
    var mapArrayDefault = [[0,2,3,4,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,3254570,0,0,0,0],[0,2,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0]]
    var mapArray = [];
    var positionX = 350;
    var positionY = 400;
    var positionDonuts;

    //change to this
    //var userId;  
 
    var intervalId;

    this.donutCounter = 0;
    

    var donuts =0;
    var _id = getAllUrlParams()._id;
    
    this.message = 'Contact us! JK. This is just a demo.' + this.donutCounter;

    function getUserHash() {
        token =  {token: Auth.getToken()}
        //get the logged in username based on the token inforation
        $http.get('api/me', token).then(successCallback, errorCallback);	
        function successCallback(result){
 
            if ( typeof result.data.username != 'undefined'){
            //generate an integer type of userid based on the unique username
            vm.userId = getHash(result.data.username);
            console.log(vm.userId)
            //get the user object and assign to a global var
            $http.get('api/users/username:' + result.data.username, token).then(successCallback, errorCallback);
                function successCallback(result){
                    vm.user = result.data[0]                       
                    vm.username = vm.user.username;
                    vm.donutMessage = vm.user.donuts;
                    getMapArray();
                   
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


    function getMapArray(){
        
        console.log("url id " + _id)
        $http({
            url: 'api/games/' + _id, 
            method: "GET",
            params: {token: Auth.getToken()}
         }).then(successCallback, errorCallback);	              
        //on success function
         function successCallback(result){

           vm.mapArray = result.data.map;

           drawMap(result.data.map);
           return this.mapArray;
         }     
         function errorCallback(result){
             // vm.message = "An error occured, please try again later"
             // vm.error = true;
         }
    }

    function getCtx(){
        var c = document.getElementById('myCanvas');  
        return c.getContext("2d");
    }

 
    this.load = function() {
        var img = document.getElementById("homer");
        ctx= getCtx();
        ctx.stroke();

        getUserHash();
       
           var refreshRate = 4000;    // time in millisec
           intervalId =  window.setInterval(function () {
               getMapArray(); 
               vm.donutMessage = donuts;             
            }, refreshRate);

            //stop the refreshing of the canvas
              $scope.$on('$destroy', function() {              
                window.clearInterval(intervalId);
              });

    }



    function getHash(input){
        var hash = 0, len = input.length;
        for (var i = 0; i < len; i++) {
          hash  = ((hash << 5) - hash) + input.charCodeAt(i);
          hash |= 0; // to 32bit integer
        }
        return hash;
      }

    

    function drawMap(mapArray){
        ctx = getCtx();
        var x =0;
        var y=0;
        
        for (i=0; i < mapArray.length; i++){
            for (j=0; j <mapArray[i].length; j++){
                ctx.drawImage(imgGround05, x,y,50,50)
                if (mapArray[i][j] == 1){
                    ctx.drawImage(imgDonut, x+10, y+10, 30,30)
                }
                else if (mapArray[i][j] == 2) {
                    ctx.drawImage(imgTreasureChest, x+10, y+10, 30,30)
                }
                else if (mapArray[i][j] == vm.userId) {
                    if (vm.user.icon == 1) {
                    ctx.drawImage(imgHomer, x+10, y+10, 30,30)
                    }
                    else if (vm.user.icon == 2) {
                        ctx.drawImage(imgBart, x+10, y+10, 30,30)
                    }
                    
                }
                
                y +=50;
            }
            y= 0;
            x += 50;
            ctx.drawImage(imgGround05, positionX, positionY,30,30);  
        }
       
        

    }

    updateCounters = function(value) {
        
        if (value == 1){
            this.donutCounter +=1;
            donuts +=1;   
                          
        }
        else if (value == 2){
           
            $(".modal-body #treasure").text( "testValue" );
            $("#myModal").modal()
        }           
        return null;
    }

    updateLabels = function(){
        this.message = vm.user.username;
    }

    function updateGameDB(strMovement){
        console.log(vm.mapArray)
        vm.game = { name: 'zsotika', players: ["5a8ab9b69b10d304a8a3eff0"], map: vm.mapArray, movement: strMovement, userId: vm.userId};
        var header =  { "x-access-token": Auth.getToken()}      
        $http.put('api/games/' + _id, vm.game, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
                updateCounters(result.data.updateValue)
            }

            function errorCallback(result){
                console.log(result)
            }      
    }

    this.spawn = function(){
        updateGameDB("spawn")
    }

    this.forward = function() {
        updateGameDB("forward")     
    }

    this.back = function() {
        updateGameDB("back");
    }

    this.left = function () {
        updateGameDB("left");            
    }

    this.right = function() {
        updateGameDB("right");   
    }

    this.getGame = function(){
        // var vm = this;

        // $http.get('api/games/5aa67fc352cb9c2821d71b7d').then(successCallback, errorCallback);	
   	    // //on success function
	    // function successCallback(result){
        //    console.log( result.data.map);
        // }     
        // function errorCallback(result){
        //     console.log("fail " + result)
        //     // vm.message = "An error occured, please try again later"
        //     // vm.error = true;
        // }
    }


    this.gameTest = function() {
        var vm = this;        
        vm.game = { name: 'zsotika', players: ["5a8ab9b69b10d304a8a3eff0"], map: mapArrayDefault, movement: "forward", userId: vm.userId};
        var header =  { "x-access-token": Auth.getToken()}
        $http.put('api/games/5ad62ca1eddfed27bc3a8caa', vm.game, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
                console.log("success update");
                console.log(result);
            }

            function errorCallback(result){
                console.log("fail " + result)
            }     
    }

    //https://www.sitepoint.com/get-url-parameters-with-javascript/
    function getAllUrlParams(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
      
        // we'll store the parameters here
        var obj = {};
      
        // if query string exists
        if (queryString) {
      
          // stuff after # is not part of query string, so get rid of it
          queryString = queryString.split('#')[0];
      
          // split our query string into its component parts
          var arr = queryString.split('&');
      
          for (var i=0; i<arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');
      
            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function(v) {
              paramNum = v.slice(1,-1);
              return '';
            });
      
            // set parameter value (use 'true' if empty)
            var paramValue = typeof(a[1])==='undefined' ? true : a[1];
      
            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();
      
            // if parameter name already exists
            if (obj[paramName]) {
              // convert value to array (if still string)
              if (typeof obj[paramName] === 'string') {
                obj[paramName] = [obj[paramName]];
              }
              // if no array index number specified...
              if (typeof paramNum === 'undefined') {
                // put the value on the end of the array
                obj[paramName].push(paramValue);
              }
              // if array index number specified...
              else {
                // put the value at that index number
                obj[paramName][paramNum] = paramValue;
              }
            }
            // if param name doesn't exist yet, set it
            else {
              obj[paramName] = paramValue;
            }
          }
        }
      
        return obj;
      }
      
});
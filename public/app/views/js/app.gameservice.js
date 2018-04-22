
angular.module('gameService', ['loginService'])
// contact page controller
.controller('gameController', function($http, Auth, $scope) {
    var vm = this;

    var counter = 0
    var ctx;
    //Img sources
    var defSrc = "/app/img/";
    var mapSrc = defSrc + "map/";
    var treasureSrc = mapSrc + "TreasureChest/";

    //img declarations
    var imgBackground = new Image(50,50);
    imgBackground.src = defSrc + "background-simpson.jpg";
    var imgHomer = new Image(220,360);
    imgHomer.src = defSrc + "homer.png";
    var imgBart = new Image(723,1105);
    imgBart.src= defSrc + "bart.png";
    var imgLisa = new Image(300,488);
    imgLisa.src = defSrc + "lisa.png";
    var imgBurns = new Image(170,440);
    imgBurns.src = defSrc  + "burns.png";
    var imgDonut = new Image(20,20);
    imgDonut.src = defSrc + "donut.png";
    var imgGround05 = new Image(128,128);
    imgGround05.src = mapSrc + "ground05.png";
    var imgGround07 = new Image(128,128);
    imgGround07.src = mapSrc + "ground07.png";
    var imgGround08 = new Image(128,128);
    imgGround08.src = mapSrc + "ground08.png";
    var rocky03 = new Image(128,128);
    rocky03.src = mapSrc + "rocky03.png";
    var tinygrass = new Image(128,128);
    tinygrass.src = mapSrc + "tiny grass.png";
    var stone01 = new Image(128,128);
    stone01.src = mapSrc + "stone01.png";
    var imgTreasureChest = new Image(128,128);    
    imgTreasureChest.src = treasureSrc + "chestFull.png"
    var imgTree02 = new Image(128,128);
    imgTree02.src = mapSrc + "tree02.png"
    var imgMushroom02 = new Image(128,128);
    imgMushroom02.src = mapSrc + "mushroom02.png"
    var imgBeer = new Image(128,128);
    imgBeer.src = defSrc + "beer.png"

   //only used for testing and init set up
    var mapArrayDefault = [[0,2,3,4,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,3254570,0,0,0,0],[0,2,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0]]
 //   var basemap = [[0,2,2,2,0,0,0,0,0],[0,1,1,0,0,0,0,0,0],[0,1,1,0,1,0,0,0,0],[0,1,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0]]
    vm.basemap =  [];
    vm.mapArray = [];

    var positionDonuts;
    var intervalId;

    //this.donutCounter = 0;
    

    var donuts =0;
    var beers = 0;
    var exp = 0;

    var _id = getAllUrlParams()._id;
    
    this.message = 'Contact us! JK. This is just a demo.';

    this.load = function() {
        var img = document.getElementById("homer");
        ctx= getCtx();
        ctx.stroke();

        getUserHash();
        var refreshRate = 500;    // time in millisec

       intervalId =  window.setInterval(function () {            
               getMapArray(); 
               drawMap(vm.mapArray);
               vm.donutMessage = donuts; 
               vm.beerMessage = beers;   
               vm.expMessage = exp;         
            }, refreshRate);

            //stop the refreshing of the canvas
              $scope.$on('$destroy', function() {              
                window.clearInterval(intervalId);
                console.log("remove playa")
                updateGameDB("remove")
              });
              
        // vm.spawn()
    }

    function getUserHash() {
        token =  {token: Auth.getToken()}
        //get the logged in username based on the token inforation
        $http.get('api/me', token).then(successCallback, errorCallback);	
        function successCallback(result){
 
            if ( typeof result.data.username != 'undefined'){
            //generate an integer type of userid based on the unique username
            vm.userId = getHash(result.data.username);
            getMapArray();
            console.log(vm.userId)
            //get the user object and assign to a global var
            $http.get('api/users/username:' + result.data.username, token).then(successCallback, errorCallback);
                function successCallback(result){
                    vm.user = result.data[0]                       
                    vm.username = vm.user.username;
                    vm.donutMessage = vm.user.donuts;
                    donuts =  vm.user.donuts;
                    vm.beerMessage = vm.user.beers;
                    beers = vm.user.beers;
                    vm.expMessage = vm.user.exp;                    
                    exp = vm.user.exp;
           
                    drawMap(vm.mapArray);
                    return vm.user;
                }
                function errorCallback(result){
                    return null;
                }
                vm.spawn()
                return vm.user;
            }
         }     
         function errorCallback(result){
             console.log( result)
             return null;
         }
    }


    function getMapArray(){
        
        //console.log("url id " + _id)
        $http({
            url: 'api/games/' + _id, 
            method: "GET",
            params: {token: Auth.getToken()}
         }).then(successCallback, errorCallback);	              
        //on success function
         function successCallback(result){
                console.log(result.data)
           vm.mapArray = result.data.map;

           vm.basemap = result.data.basemap;
           
           return vm.mapArray;
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
        var sizeOfTile = 80;
        var sizeOfItems = 55;
        var x =0;
        var y=0;


        for (i=0; i < mapArray.length; i++){
            for (j=0; j <mapArray[i].length; j++){
                ctx.drawImage(imgGround05, x,y,sizeOfTile,sizeOfTile)
                //to draw the base map
                switch(vm.basemap[i][j]){
                    case 0:
                  
                        break;
                    case 1:
                        ctx.drawImage(imgTree02, x,y,sizeOfTile,sizeOfTile)
                        break;
                    case 2:
                        ctx.drawImage(imgGround05, x,y,sizeOfTile,sizeOfTile)
                        ctx.drawImage(tinygrass,x,y,sizeOfTile,sizeOfTile)
                        break;
                    case 3:
                        ctx.drawImage(imgGround05, x,y,sizeOfTile,sizeOfTile)
                        ctx.drawImage(stone01,x,y,sizeOfItems,sizeOfItems);
                        break;
                    case 4:
                        ctx.drawImage(imgMushroom02,x,y,sizeOfItems,sizeOfItems);
                        break;
                    case 5:
                        break;
                }
               
                //draw the items on the top of the base map
                switch(mapArray[i][j]){
                    case 1:
                        ctx.drawImage(imgDonut, x+10, y+10, sizeOfItems,sizeOfItems)
                        break;
                    case 2:
                        ctx.drawImage(imgTreasureChest, x+10, y+10, sizeOfItems,sizeOfItems)
                        break;
                    case 3:
                        ctx.drawImage(imgBeer, x+10, y+10, sizeOfItems,sizeOfItems)
                        break;
                    case vm.userId:
                     //   isuserSpawned = true;
                        if (vm.user.icon == 1) {
                            ctx.drawImage(imgHomer, x+10, y+10, sizeOfItems,sizeOfItems)
                            }
                            else if (vm.user.icon == 2) {
                                ctx.drawImage(imgBart, x+10, y+10, sizeOfItems,sizeOfItems)
                            }
                            else if (vm.user.icon == 3){
                                ctx.drawImage(imgLisa, x+10,y+10, sizeOfItems, sizeOfItems)
                            }
                        break;
                }

                if (mapArray[i][j] > 10 && mapArray[i][j] != vm.userId){
                    ctx.drawImage(imgBurns, x+10, y+10, sizeOfItems,sizeOfItems)
                }
                
                y +=sizeOfTile;
            }
            y= 0;
            x += sizeOfTile;         
        }    
        

    }

    updateCounters = function(value) {
        
        
        if (value == 1){
            donuts +=1;                             
        }
        else if (value == 2){
            vm.isBeerToShow = false;
            vm.isDonutToShow = false;
            vm.isExpToShow = false;   
            var randomDrop = Math.floor(Math.random() * 3);
            switch(randomDrop){
                case 0:
                    vm.isBeerToShow = true;
                    $(".modal-body #lblBeer").text( "An extra beer for you!!" );
                    beers += 1;
                    break;
                case 1:
                    vm.isDonutToShow = true;
                    $(".modal-body #lblDonut").text( "An extra donut for you!!" );
                    donuts +=1;
                    break;
                case 2:
                    vm.isExpToShow = true;      
                    var expRand = Math.floor(Math.random() * 9)  + 1            
                    $(".modal-body #lblExp").text( "Experince points: " + expRand );
                    exp += expRand;
                    break;
            }           

            $("#myModal").modal()
        } 
        else if (value == 3)          {
            beers += 1;
        }
        if (vm.user){
            vm.user.donuts = donuts;
            vm.user.beers = beers;
            vm.user.exp = exp;
            updateUser();
        }
        return null;
    }

    function updateUser(){
        var header =  { "x-access-token": Auth.getToken()}   
        $http.put('api/users/' + vm.user._id, vm.user, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
              //  updateCounters(result.data.updateValue)
            }

            function errorCallback(result){
                console.log(result)
            }      
    }


    updateLabels = function(){
        this.message = vm.user.username;
    }

    function updateGameDB(strMovement){
      //  console.log("updateGameDb: " + strMovement + " " + vm.userId)
        vm.game = { name: 'zsotika', players: "vm.user._id", map: vm.mapArray, movement: strMovement, userId: vm.userId};
        var header =  { "x-access-token": Auth.getToken()}      
        $http.put('api/games/' + _id, vm.game, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
                updateCounters(result.data.updateValue)
            }

            function errorCallback(result){
                
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


    this.gameTest = function() {
        var vm = this;        
        vm.game = { name: 'zsotika', players: ["5a8ab9b69b10d304a8a3eff0"], map: mapArrayDefault, basemap: vm.basemap, movement: "forward", userId: vm.userId};
        var header =  { "x-access-token": Auth.getToken()}
        $http.put('api/games/5ad62ca1eddfed27bc3a8caa', vm.game, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
                
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
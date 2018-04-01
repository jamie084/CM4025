
angular.module('gameService', ['loginService'])
// contact page controller
.controller('gameController', function($http, user, Auth) {
    
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
    var userId;

    this.donutCounter = 0;
    var donuts =0;
    
    this.message = 'Contact us! JK. This is just a demo.' + this.donutCounter;
    this.donutMessage = ''
    function getUserHash() {
        token =  {token: Auth.getToken()}
        // console.log(Auth.getToken())
        $http.get('api/me', token).then(successCallback, errorCallback);	
        function successCallback(result){
            // console.log(result)
            // console.log( result.data.username);
            // console.log(getHash(result.data.username));
            userId =getHash(result.data.username);
            return this.userId;
        //  return null;
         }     
         function errorCallback(result){
             console.log( result)
             return null;
             // vm.message = "An error occured, please try again later"
             // vm.error = true;
         }
    }


    function getMapArray(){
        $http({
            url: 'api/games/5aa67fc352cb9c2821d71b7d', 
            method: "GET",
            params: {token: Auth.getToken()}
         }).then(successCallback, errorCallback);	              
        //on success function
         function successCallback(result){
           mapArray = result.data.map
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

        var userId = getUserHash();
        var mapArray = getMapArray();

            'use strict';
            var refreshRate = 500;    // time in millisec
            window.setInterval(function () {
               getMapArray();
            }, refreshRate);
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
        //console.log(mapArray)
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
                else if (mapArray[i][j] == userId) {
                    ctx.drawImage(imgHomer, x+10, y+10, 30,30)
                }
                
                y +=50;
            }
            y= 0;
            x += 50;
            ctx.drawImage(imgGround05, positionX, positionY,30,30);  
        }
       
        

    }

    function modifyMap(movement){
        loop1:
        for (i=0; i < mapArray.length; i++){
           loop2:
            for (j=0; j <mapArray[i].length; j++){
                if (mapArray[i][j] == userId){
                    
                    if (i >= 1 && movement === "left" ){
                        
                        updateCounters(mapArray[i-1][j])
                        mapArray[i-1][j] = userId;
                        mapArray[i][j] = 0;
                        break loop1;
                    }
                    if (i < mapArray.length-1 && movement === "right"){
                        updateCounters(mapArray[i+1][j])
                        mapArray[i+1][j] = userId;   
                        mapArray[i][j] = 0;             
                        break loop1;                     
                    }
                    if (j > 0 && movement === "forward"){
                        updateCounters(mapArray[i][j-1])
                        mapArray[i][j-1] = userId;     
                        mapArray[i][j] = 0;           
                        break loop1;
                    }
                    if (j < mapArray[j].length-1 && movement === "back"){
                        updateCounters(mapArray[i][j+1])
                        mapArray[i][j+1] = userId; 
                        mapArray[i][j] = 0;                      
                        break loop1;
                    }                    
                }                                                
            }
        }      
        updateGameDB();
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

    // function updateCounters(value){


    // }

    function updateGameDB(){
        var vm = this;        
        vm.game = { name: 'zsotika', players: "5a8ab9b69b10d304a8a3eff0", map: mapArray};
        var header =  { "x-access-token": Auth.getToken()}
        $http.put('api/games/5aa67fc352cb9c2821d71b7d', vm.game, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
              //  drawMap()
                console.log("success update");
                console.log(result);
            }

            function errorCallback(result){
                console.log("fail " + result)
            }      
    }

    this.forward = function() {
        modifyMap("forward") 
        counter +=1;
        this.donutMessage = donuts;        
    }

    this.back = function() {
        modifyMap("back");
        counter -=1;
        this.donutMessage = donuts;
    }

    this.left = function () {
        modifyMap("left");            
        this.donutMessage = donuts;
    }

    this.right = function() {
        modifyMap("right");   
        //this.message = "right";
        this.donutMessage = donuts;
        //this.message = "msg new" + donuts; 
 
    }

    this.getGame = function(){
        var vm = this;

        $http.get('api/games/5aa67fc352cb9c2821d71b7d').then(successCallback, errorCallback);	
   	    //on success function
	    function successCallback(result){
           console.log( result.data.map);
        }     
        function errorCallback(result){
            console.log("fail " + result)
            // vm.message = "An error occured, please try again later"
            // vm.error = true;
        }
    }


    this.gameTest = function() {
        var vm = this;        
        vm.game = { name: 'zsotika', players: "5a8ab9b69b10d304a8a3eff0", map: mapArrayDefault};
        var header =  { "x-access-token": Auth.getToken()}
        $http.put('api/games/5aa67fc352cb9c2821d71b7d', vm.game, header).then(successCallback, errorCallback);	
 
            //on success function
            function successCallback(result){
               // drawMap()
                console.log("success update");
                console.log(result);
            }

            function errorCallback(result){
                console.log("fail " + result)
            }     
    }
});
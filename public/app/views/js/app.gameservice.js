
angular.module('gameService', [])
// contact page controller
.controller('gameController', function($http) {
    this.message = 'Contact us! JK. This is just a demo.';
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
   var mapArray = [[0,2,3,4,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,100,0,0,0,0],[0,2,1,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0],[0,3,1,0,0,0,0,0,0]]

    var positionX = 350;
    var positionY = 400;
    var positionDonuts;

    function getCtx(){
        var c = document.getElementById('myCanvas');  
        return c.getContext("2d");
    }


    this.load = function() {
        var img = document.getElementById("homer");
        ctx= getCtx();
     //   ctx.drawImage(imgBackground, 0,0, 700, 500); 
        ctx.drawImage(imgHomer, positionX, positionY,50,80);  
        ctx.drawImage(imgDonut, 50, 50, 40,40);
        ctx.stroke();
    }



    function reDraw(posHomer, posDonuts){
        ctx = getCtx();
  
        drawMap();
    }

    function drawMap(){
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
                else if (mapArray[i][j] == 100) {
                    ctx.drawImage(imgHomer, x+10, y+10, 30,30)
                }
                
                y +=50;
            }
            y= 0;
            x += 50;
        }
      //  ctx.drawImage(imgHomer, positionX, positionY,30,30);  
        

    }

    function modifyMap(movement){
        var userId = 100;
        loop1:
        for (i=0; i < mapArray.length; i++){
           loop2:
            for (j=0; j <mapArray[i].length; j++){
                if (mapArray[i][j] == userId){
                    
                    if (i >= 1 && movement === "left" ){
                        mapArray[i-1][j] = userId;
                        break loop1;
                    }
                    if (i < mapArray.length-1 && movement === "right"){
                        mapArray[i+1][j] = userId;                        
                        break loop1;                     
                    }
                    if (j > 0 && movement === "forward"){
                        mapArray[i][j-1] = userId;                        
                        break loop1;
                    }
                    if (j < mapArray[j].length-1 && movement === "back"){
                        mapArray[i][j+1] = userId;                        
                        break loop1;
                    }
                    mapArray[i][j] = 0;
                }
            }
        }      
        updateGameDB();
    }

    function updateGameDB(){
        var vm = this;        
        vm.game = { name: 'zsotika', players: "5a8ab9b69b10d304a8a3eff0", map: JSON.stringify(mapArray)};
        $http.put('api/games/5aa67fc352cb9c2821d71b7d', vm.game).then(successCallback, errorCallback);	
 
	//on success function
	function successCallback(result){
        drawMap()
		console.log("success " +  result);
	}

	function errorCallback(result){
        console.log("fail " + result)
	}      
    }

    this.forward = function() {
        counter +=1;
        this.message = "msg new" + counter;  
        modifyMap("forward") 
        
    }

    this.back = function() {
        counter -=1;
        this.message = "minus" + counter;
        modifyMap("back");
    }

    this.left = function () {
        this.message = "left ";
        modifyMap("left");    
    }

    this.right = function() {
        this.message = "right";
        modifyMap("right");    
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
        var mapArray = [[1,2,3],[0,0,0],[1,0,0]]
        vm.game = { name: 'zsotika', players: "gazsi2", map: JSON.stringify(mapArray)};
        $http.put('api/games/5aa67fc352cb9c2821d71b7d', vm.game).then(successCallback, errorCallback);	
 
	//on success function
	function successCallback(result){
		console.log("success " +  result);
		// //if the new user created
		// if (result.data.success == true){
		// 	//automatically logs in the user, and redirects to home pahe
		// 	Auth.login(vm.credentials.username, vm.credentials.password)			
		// 		.success(function(data) {
		// 			if (data.success = true){
				
		// 			window.location.href = '/';
		// 			}
		// 		});
		// }
		// else {
		// 	//bootstrap error panel msg & ctrl
		// 	vm.message = result.data.message
		// 	vm.error  = true;			
		// }

	}

	function errorCallback(result){
        console.log("fail " + result)
		// vm.message = "An error occured, please try again later"
		// vm.error = true;
	}
    }
});
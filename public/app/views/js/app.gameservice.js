
angular.module('gameService', [])
// contact page controller
.controller('gameController', function() {
    this.message = 'Contact us! JK. This is just a demo.';
    var counter = 0
    var ctx;
    var defSrc = "/app/img/"

    var imgBackground = new Image(50,50);
    imgBackground.src = defSrc + "background-simpson.jpg";
    var imgHomer = new Image(20,20);
    imgHomer.src = defSrc + "homer.png";
    var imgDonut = new Image(20,20);
    imgDonut.src = defSrc + "donut.png";
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
        ctx.drawImage(imgBackground, 0,0, 700, 500); 
        ctx.drawImage(imgHomer, positionX, positionY,50,80);  
        ctx.drawImage(imgDonut, 50, 50, 40,40);
        ctx.stroke();
    }



    function reDraw(posHomer, posDonuts){
        ctx = getCtx();
        ctx.drawImage(imgBackground, 0,0, 700, 500); 
        ctx.drawImage(imgHomer, positionX, positionY,50,80);   
        ctx.drawImage(imgDonut, 50,50, 40,40);  
    }

    this.forward = function() {
        counter +=1;
        this.message = "msg new" + counter;   
        positionY -= 80;
        reDraw();

    }

    this.back = function() {
        counter -=1;
        this.message = "minus" + counter;
        positionY += 80;
        reDraw();
    }

    this.left = function () {
        this.message = "left ";
        positionX -= 50;
        reDraw();      
    }

    this.right = function() {
        this.message = "right";
        positionX += 50;
        reDraw();
    }

    this.reset = function() {
        this.message = "callleddd"
 

    }
});
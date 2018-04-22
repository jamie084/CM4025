var app = angular.module('chat' , []);


app.controller('ChatController', function($http, Auth, $scope){
    vm = this;
    token =  {token: Auth.getToken()}
    vm.messages = [];
    vm.newMessages = [];
    vm.oldMessages = [];

    var id;
    var messageData = {};

    token =  {token: Auth.getToken()}
    //get the logged in username based on the token inforation

    $http.get('api/me', token).then(successCallback, errorCallback);	
    function successCallback(result){

        if ( typeof result.data.username != 'undefined'){

            vm.sendAs = result.data.username;        
            getChatData();

        }
     }     
     function errorCallback(result){
         console.log( result)
         return null;
     }
    
     function getChatData() {
        $http.get('api/chat', token).then(successCallback, errorCallback);	
        function successCallback(result){
            if (typeof result.data[0] != 'undefined'){
                vm.newMessages = result.data[0].messageData
            //updates the displayed messages with the new ones between the refresh period
            if (vm.newMessages.length != vm.oldMessages.length){
                for (var i=vm.oldMessages.length; i< vm.newMessages.length; i++){
                
                    vm.messages.push(result.data[0].messageData[i])
                }
                vm.oldMessages = vm.newMessages;
            }

            }
            id = result.data[0]._id   
        }
        function errorCallback(result){
            console.log(result)
        }
     }

     var refreshRate = 1000;    // time in millisec
     var objDiv = document.getElementById("chat-message");

     intervalId =  window.setInterval(function () {       
        getChatData();        
        //autoscroll to the bottom
        
        objDiv.scrollTop = objDiv.scrollHeight;            
      }, refreshRate);

      //stop refreshing
        $scope.$on('$destroy', function() {              
          window.clearInterval(intervalId);
        });




  
  vm.sendMessage = function(message){ 
    var time = new Date();
    var time = (time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
    var messageData = {
      from: this.sendAs,
      text: message,
      time: time
    };
     document.getElementById("txtChatBox").value = "";


    var header =  { "x-access-token": Auth.getToken()}    
    $http.put('api/chat/' + id , messageData, header).then(successCallback, errorCallback);	

        //on success function
        function successCallback(result){
            console.log("success")
           // updateCounters(result.data.updateValue)
        }

        function errorCallback(result){
            console.log(result)
        }   
  };

  // Get the input field
var input = document.getElementById("txtChatBox");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("btnSend").click();
  }
});
});
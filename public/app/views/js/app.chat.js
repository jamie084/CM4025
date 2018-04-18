var app = angular.module('chat' , []);


app.controller('ChatController', function($http, Auth){
    vm = this;
    token =  {token: Auth.getToken()}
    vm.messages = [];

    var id;
    var messageData = {};

    $http.get('api/chat', token).then(successCallback, errorCallback);	
    function successCallback(result){
        for (var i=0; i< result.data[0].messageData.length; i++){
            vm.messages.push(result.data[0].messageData[i])
        }
        // messageData = result.data[0].messageData[0];
        // console.log(messageData)
        // vm.messages.push(messageData)
        id = result.data[0]._id

    }
    function errorCallback(result){
        console.log(result)
    }



  vm.sendAs = "Alice";
  
  vm.sendMessage = function(message){    
    var messageData = {
      from: this.sendAs,
      text: message
    };
    
    vm.messages.push( messageData );
    //vm.game = { name: 'zsotika', players: ["5a8ab9b69b10d304a8a3eff0"], map: vm.mapArray, movement: strMovement, userId: vm.userId};
    var header =  { "x-access-token": Auth.getToken()}    
    console.log("id " + id)  
    $http.put('api/chat/' + id ,this.messages, header).then(successCallback, errorCallback);	

        //on success function
        function successCallback(result){
            console.log("success")
           // updateCounters(result.data.updateValue)
        }

        function errorCallback(result){
            console.log(result)
        }   
  };
});
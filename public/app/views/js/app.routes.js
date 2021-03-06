// inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute', 'loginService', 'chat'])

// configure our routes
.config(function($routeProvider, $locationProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'app/views/pages/home.html',
            controller  : 'homeController',
            controllerAs: 'home',
            resolve: {
                factory: checkRouting
            }
        })

        // route for the about page
        .when('/chat', {
            templateUrl : 'app/views/pages/chat.html',
            controller  : 'ChatController',
            controllerAs: 'chat',
            resolve: {
                factory: checkRouting
            }
        })

        // route for the contact page
        .when('/contact', {
            templateUrl : 'app/views/pages/contact.html',
            controller  : 'contactController',
            controllerAs: 'contact',
            resolve: {
                factory: checkRouting
            }
        })

        // route for the game page
        .when('/game', {
            templateUrl : 'app/views/pages/game.html',
            controller  : 'gameController',
            controllerAs: 'game',
            resolve: {
                factory: checkRouting
            }
        })

        // route for the game page
        .when('/selectgame', {
            templateUrl : 'app/views/pages/selectgame.html',
            controller  : 'selectGameController',
            controllerAs: 'selectgame',
            resolve: {
                factory: checkRouting
            }
        })

        .when('/login', {
            templateUrl : 'app/views/pages/login.html',
            controller  : 'loginController',
            controllerAs: 'login'
        })

        .when('/register', {
            templateUrl : 'app/views/pages/register.html',
            controller  : 'registerController',
            controllerAs: 'register'            
        })

    $locationProvider.html5Mode(true);
});

var checkRouting= function ($q, $rootScope, $location, Auth) {    
    if (!Auth.isLoggedIn()){              
       $location.path("/login");
       }
       else{
           return true;
       }
};
var goDJ = angular.module('godj',['spotify','godj.controllers','godj.services','ui.router','ngAnimate']);

goDJ.config(function(SpotifyProvider,$stateProvider, $urlRouterProvider){
	SpotifyProvider.setClientId('d89976bf7cbd46b1a181a224be5e1e42');
	SpotifyProvider.setRedirectUri('http://millsky.github.io/meGusta/callback.html');
	SpotifyProvider.setScope('user-read-private playlist-read-private playlist-modify-private playlist-modify-public');

	
	$stateProvider
		.state('search',{
			url:'/search',
			templateUrl:'templates/search.html'
		})
		.state('listen',{
			url:'/listen',
			templateUrl:'templates/listen.html'			
		})
		.state('login',{
			url:'/login',
			templateUrl: 'templates/login.html'
		});
	
	  $urlRouterProvider.otherwise('/login');
});

goDJ.run(function ($rootScope) {
	$rootScope.$on('$stateChangeStart',
		function(event, toState, toParams, fromState, fromParams){
			// IF ROUTE CHNAGES AWAY FROM LISTEN WE NEED TO KILL MUSIC PLAYER
			if(toState.name == "login" || toState.name == "search"){
				/* BROADCAST TO LOWER SCOPES INSTEAD OF INJECTING ROOTSCOPE INTO CONTROLLER*/
				$rootScope.$broadcast('disposeAudio');
			}
		});
});


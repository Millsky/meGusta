var goDJ = angular.module('godj',['spotify','godj.controllers','godj.services','ui.router','ngAnimate']);

goDJ.config(function(SpotifyProvider,$stateProvider, $urlRouterProvider){
	SpotifyProvider.setClientId('d89976bf7cbd46b1a181a224be5e1e42');
	SpotifyProvider.setRedirectUri('http://127.0.0.1:54663/callback.html');
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

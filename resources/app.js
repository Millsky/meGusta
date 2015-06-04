<<<<<<< HEAD
var goDJ = angular.module('godj',['spotify','godj.controllers','godj.services','ui.router']);
=======
var goDJ = angular.module('godj',['spotify','godj.controllers','godj.services','ui.router','ngAnimate']);
>>>>>>> gh-pages

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

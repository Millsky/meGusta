var djControllers = angular.module('godj.controllers',[]);

<<<<<<< HEAD
djControllers.controller('search',['$scope','Spotify','$state','viewPersist',function($scope,Spotify,$state,viewPersist){
   

	$scope.searchData = [];
	$scope.searchParams = "";	
	$scope.myList = [];
	$scope.search = function(){
		var index = 0;
		var results = [];
		$scope.searchData = [];
		function next(){
			if(index < results.length){
				getData();
			}else{
				return $scope.searchData;
			}
		}
		
		function getData(){
			var item = results[index];	
			Spotify.getArtistTopTracks(item.id,"US").then(function(topTracks){
				item.topTracks = topTracks;
				item.isAdded = false;
				$scope.searchData.push(item);
				index++;
				next();
			});
		}
		
		Spotify.search($scope.searchParams, 'artist').then(function (data) {  			
			results = data.artists.items;
			next();
		});
		document.getElementById('headphones').style.height = "0px";
		document.getElementById('headphones').style.transform = "scale(.2)";
		
	}
=======
djControllers.controller('search',['$scope','$state','viewPersist','searchArtists',function($scope,$state,viewPersist,searchArtists){
	var complete = true;
	$scope.searchData = [];
	$scope.searchParams = "";	
	$scope.myList = [];
	
	$scope.search = function(){
		if(complete === true && $scope.searchParams != ""){
			searchCheck();
		}
	}
	
	function searchCheck(){
		complete = false;
		searchArtists.get($scope.searchParams).then(function(data){
			$scope.searchData = data;
			complete = true;
		},function(){
			$scope.searchData = [];
			complete = true;
		});
	}
		
>>>>>>> gh-pages
	$scope.addItem = function(index){
		$scope.searchData[index].isAdded = true;
		$scope.myList.push($scope.searchData[index]);
		$scope.searchData.splice(index,1);
<<<<<<< HEAD
=======
		$scope.searchParams = "";	
>>>>>>> gh-pages
	}
	$scope.removeItem = function(index){
		var item = $scope.myList[index];
		item.isAdded = false;
		$scope.myList.splice(index,1);
		$scope.searchData.push(item);
	}
	$scope.completeArtists = function(){
		viewPersist.set('artistList',$scope.myList);
		$state.go('listen');
	}
<<<<<<< HEAD

}]);

djControllers.controller('listen',['$scope','Spotify','$state','getNextTracks',function($scope,Spotify,$state,getNextTracks){
	/* GET NEXT 5 TRACKS */
	var playListName = "Me Gusta Loved Tracks";
	var playList = {};
	/* GET USER INFO */
	$scope.currentUser = {};
	
	Spotify.getCurrentUser().then(function (data) {
  		$scope.currentUser = data;
		Spotify.getUserPlaylists($scope.currentUser.id,{limit:50}).then(function(playLists){
			$scope.currentUser.playLists = playLists;
			console.log(playLists);
=======
}]);

djControllers.controller('listen',['$scope','Spotify','$state','getNextTracks','viewPersist','removeArtist',function($scope,Spotify,$state,getNextTracks,viewPersist,removeArtist){
	/* GET NEXT 5 TRACKS */
	var playListName = "Me Gusta Loved Tracks",
		playList = {},
        trackIndex = 0;
	$scope.currentUser = {};
	$scope.playList = [];
	$scope.tracksList = [];
	$scope.myList = [];
	
	Spotify.getCurrentUser().then(function(data){
		userOperations(data);
	});
	
	function userOperations(data){
		$scope.currentUser = data;
		Spotify.getUserPlaylists($scope.currentUser.id,{limit:50}).then(function(playLists){
			$scope.currentUser.playLists = playLists;
>>>>>>> gh-pages
			var playListExists = false;
			for(i=0;i<playLists.items.length;i++){
			if(playLists.items[i].name == playListName){
				playListExists = true;
				$scope.currentUser.meGustaPlaylistID = playLists.items[i].id;
				return true;
			}
			}
			if(playListExists == false){
				/* CREATE PLAYLIST */
				Spotify.createPlaylist($scope.currentUser.id, { name: playListName }).then(function (data) {
<<<<<<< HEAD
  					console.log(data);
=======
>>>>>>> gh-pages
					playList = data;
				});
			}
		});
<<<<<<< HEAD
	});
	
	$scope.playList = [];
	$scope.tracksList = [];
	$scope.myList = [];
	var trackIndex = 0;
	var tracks = getNextTracks.get();
	tracks.then(function(data){
		$scope.tracksList = data;
		
		getNextTenTracks();
		//data = data.slice(0,10);
		
		//$scope.myList = data;
		$scope.audio = new Audio($scope.myList[0].preview_url);
		$scope.audio.play();
		$scope.audio.ontimeupdate = function(){
		var vol = 1,
    	interval = 200; // 200ms interval
    	if (Math.floor($scope.audio.currentTime) == 26) {
        	if ($scope.audio.volume == 1) {
            	var intervalID = setInterval(function() {
	        	// Reduce volume by 0.05 as long as it is above 0
	        	// This works as long as you start with a multiple of 0.05!
	        	if (vol > 0) {
	            	vol -= 0.05;
	            	// limit to 2 decimal places
                    // also converts to string, works ok
                    $scope.audio.volume = vol.toFixed(2);
	        	} else {
	            	// Stop the setInterval when 0 is reached
	            	clearInterval(intervalID);
	        	}
            	}, interval);
        	}
    	}
		
		$scope.$apply(function(){
			$scope.time = $scope.audio.currentTime;
		});
	}
=======
	}
	/* SET PLAYLIST */

	var tracks = getNextTracks.get();
	tracks.then(function(data){
		$scope.tracksList = data;
		getNextTenTracks();
		$scope.audio = new Audio($scope.myList[0].preview_url);
		$scope.audio.oncanplaythrough = function(){
			$scope.audio.volume = 1;
			if($scope.audio.duration > 20){
				$scope.audio.currentTime = 20;
			}
        	$scope.audio.play();
		}
		$scope.audio.ontimeupdate = function(){
			var vol = 1;
			$scope.$apply(function(){
				$scope.time = $scope.audio.currentTime - 20;
			});
	    }
>>>>>>> gh-pages
		$scope.audio.onended = function(){
			$scope.nextTrack();
		}
	});
	
	function getNextTenTracks(){
<<<<<<< HEAD
		var nextTen = $scope.tracksList.splice(0,10);
=======
		var nextTen = $scope.tracksList.splice(0,2);
>>>>>>> gh-pages
		$scope.myList = $scope.myList.concat(nextTen);
	}
	
	$scope.nextTrack = function(){
		if($scope.myList.length == 2){
			getNextTenTracks();
		}
	    $scope.myList.splice(0,1);
		$scope.audio.src = $scope.myList[0].preview_url;
        $scope.audio.pause();
		$scope.audio.load();
		$scope.audio.oncanplaythrough = function(){
			$scope.audio.volume = 1;
<<<<<<< HEAD
=======
			if($scope.audio.duration > 20){
				$scope.audio.currentTime = 20;
			}
>>>>>>> gh-pages
        	$scope.audio.play();
		}
	}
	$scope.pauseTrack = function(){
		if($scope.audio.paused){
			$scope.audio.play();
		}else{
			$scope.audio.pause();
		}
	}
	$scope.loveTrack = function(){
<<<<<<< HEAD
		$scope.playList.push($scope.myList[0]);
		Spotify.addPlaylistTracks($scope.currentUser.id,$scope.currentUser.meGustaPlaylistID,'spotify:track:' + $scope.myList[0].track_id).then(function(d){
			console.log("SUCCESS");
		});

		console.log("CURRENT PLAYLIST");
		console.log($scope.playList);
		
	}
=======
		$scope.myList[0].loved = {color:'#EF5550'};
		$scope.playList.push($scope.myList[0]);
		Spotify.addPlaylistTracks($scope.currentUser.id,$scope.currentUser.meGustaPlaylistID,'spotify:track:' + $scope.myList[0].track_id).then(function(d){

		});


		
	}
	$scope.noGustaTrack = function(){
		$scope.tracksList = removeArtist.remove($scope.myList[0].artist_name);
		viewPersist.set('trackList',$scope.tracksList);
		$scope.nextTrack();
	}
	/* WATCH TRACKLIST FOR CHANGES */
	$scope.$watch('tracksList',function(){
		console.log('setting');
		viewPersist.set('trackList',$scope.tracksList);
	});
>>>>>>> gh-pages
	
}]);

djControllers.controller('login',['$scope','$state','Spotify',function($scope,$state,Spotify){
	$scope.login = function(){
		Spotify.login().then(function(s){
			$state.go('search');
		});
	}
	$scope.skipLogin = function(){
		$state.go('search');
	}
}]);
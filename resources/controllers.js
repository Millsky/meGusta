var djControllers = angular.module('godj.controllers',[]);

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
		
	$scope.addItem = function(index){
		$scope.searchData[index].isAdded = true;
		$scope.myList.push($scope.searchData[index]);
		$scope.searchData.splice(index,1);
		$scope.searchParams = "";	
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
					playList = data;
				});
			}
		});
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
		$scope.audio.onended = function(){
			$scope.nextTrack();
		}
	});
	
	function getNextTenTracks(){
		var nextTen = $scope.tracksList.splice(0,2);
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
			if($scope.audio.duration > 20){
				$scope.audio.currentTime = 20;
			}
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
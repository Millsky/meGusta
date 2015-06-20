var djServices = angular.module('godj.services',[]);

djServices.service('viewPersist',[function(){
	var globals = {
		artistList: [],
		trackList:[],
		lovedArtists:[]
	};
	
	var get = function(fieldName){
		return globals[fieldName];
	};
	
	var set = function(fieldName,v){
		globals[fieldName] = v;
	};
	
	return{
		get:get,
		set:set
	}
	
}]);



djServices.service('getNextTracks',['viewPersist','Spotify','$q',function(viewPersist,Spotify,$q){
	var artistList = viewPersist.get('artistList');
	var tracksList = $q.defer();
	var artistPromise = $q.defer();
	var similarArtists = [];
	var similarTracks = [];
	var index = 0;
	var indexTracks = 0;
	var flatTracks = [];
	

	/* GET RELATED ARTISTS LIST*/
	function getRelatedArtists(id){
		Spotify.getRelatedArtists(id).then(function(data){
			similarArtists.push(data.artists);
			index++;
			nextA();
		});
	}
	
	function nextA(){
	    if(index < artistList.length){
			getRelatedArtists(artistList[index].id);
		}else{
			artistPromise.resolve(similarArtists);
		}
	}
	
	function nextT(){
		/* NEED TO FIX TO INTERATE THROUGH ALL ARRAYS */
		if(indexTracks < similarArtists.length){
			getTopTracks(similarArtists[indexTracks].id);
		}else{
			/*SHUFFLE AND FLATTEN */
			for(i=0;i<similarTracks.length;i++){
				/*loop through arrays*/
				for(j=0;j<similarTracks[i].length;j++){
						var trackObj = {
		artist_name: '',
		artist_image:'',
		album_name: '',
		album_image:'',
		track_name: '',
		preview_url:'',
		popularity:'',
		artist_id:'',
		track_id:''
	};
					trackObj.track_id = similarTracks[i][j].id;
					trackObj.artist_id = similarTracks[i][j].artists[0].id;
					trackObj.artist_name = similarTracks[i][j].artists[0].name;
					trackObj.album_image = similarArtists[i].images[0].url;
					trackObj.preview_url = similarTracks[i][j].preview_url;
					trackObj.popularity = similarTracks[i][j].popularity;
					trackObj.album_name = similarTracks[i][j].album.name;
					trackObj.track_name = similarTracks[i][j].name;
					flatTracks.push(trackObj);
					
				}
			}

			function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
			flatTracks = shuffle(flatTracks);
			tracksList.resolve(flatTracks);
		}
	}
	
	
	function getTopTracks(id){
		Spotify.getArtistTopTracks(id,"US").then(function(topTracks){
			similarTracks.push(topTracks.tracks);
			indexTracks ++;
			nextT();
		});
	}
	

	


	
	function getAllArtists(){
		getRelatedArtists(artistList[0].id);
		return artistPromise.promise;
	}
	
	getAllArtists().then(function(data){
		similarArtists = [];
		for(i=0;i<data.length;i++){
			similarArtists = similarArtists.concat(data[i]);
		}
		getTopTracks(similarArtists[0].id);
	});
	
	var nextTracks = function(){
		//getAllArtists();
		return tracksList.promise;
	};
	return{
		get: nextTracks
	}
	
}]);

djServices.service('removeArtist',['viewPersist',function(viewPersist){
	var remove = function(artistName){
		var trackList = viewPersist.get('trackList');
		var trackListProxy = [];
		/* NEED TO FIND MORE EFF WAY OF DOING THIS */
		for(i=0;i<trackList.length;i++){
			if(trackList[i].artist_name != artistName){
				trackListProxy.push(trackList[i]);
			}
		}
		return trackListProxy;
	};
	
	return remove
}]);

djServices.service('loveArtist',['viewPersist',function(viewPersist){
	/*TODO* ADD IN FUNCTION TO RETURN SIMILAR ARTISTS TO LOVED ARTIST*/
	var love = function(){
		
	};
	return love;
}]);

djServices.factory('searchArtists',['Spotify','$q',function(Spotify,$q){
		
			var results = [],
			index = 0,
			temp = [];
			
	
		function next(){
			if(index < results.length){
				getData();
			}else{
				/*RESOLVE PROMISE*/
                temp = temp.splice(0,7);
				def.resolve(temp);
			}
        }
    function getData(){
			var item = results[index];	
			Spotify.getArtistTopTracks(item.id,"US").then(function(topTracks){
				item.topTracks = topTracks;
				item.isAdded = false;
				temp.push(item);
				index++;
				next();
			});
        }
    var get = function(artistName){
			def = $q.defer();
			temp = [];
			Spotify.search(artistName, 'artist').then(function (data) {  	
				index = 0;
				results = data.artists.items;
				next();
			},function(){
				def.reject();
			});
			return def.promise;
		};
	
		return{
			get:get,
		}
	
}]);
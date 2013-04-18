function GoogleMap(){
    //alert("map start");
    this.initialize = function(){
        var map = showMap();
        addMarkersToMap(map);
    }    
    
    var addMarkersToMap = function(map){
        var mapBounds = new google.maps.LatLngBounds();
    
       //var latitudeAndLongitudeOne = new google.maps.LatLng('51.572014','-0.126889');
	//alert(pickUpLocations.length+" markers");
	for (var i=0; i < pickUpLocations.length; i++) {
            var markers = pickUpLocations[i];
            var markerLatlng = new google.maps.LatLng(markers[0], markers[1]);
            
            var marker = new google.maps.Marker({
                position: markerLatlng,
                map: map
            });
	    mapBounds.extend(markerLatlng);
        }

//        var markerOne = new google.maps.Marker({
//					position: latitudeAndLongitudeOne,
//					map: map
//				});

//        var latitudeAndLongitudeTwo = new google.maps.LatLng('51.572002','-0.127333');
//
//        var markerOne = new google.maps.Marker({
//					position: latitudeAndLongitudeTwo,
//					map: map
//				});
//
//        mapBounds.extend(latitudeAndLongitudeOne);
//        mapBounds.extend(latitudeAndLongitudeTwo);
        
        map.fitBounds(mapBounds);
    }
    
    
    
    var showMap = function(){
        var mapOptions = {
			     zoom: 4,
			     center: new google.maps.LatLng(-33, 151),
			     mapTypeId: google.maps.MapTypeId.ROADMAP
			 }

        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        
        return map;
    }
}	
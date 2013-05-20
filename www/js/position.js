    var watchIDPosition = null;
    var latitude = 0;
    var longitude = 0;
    var pickUpLocations =[];
    //var proximityArray =[];
    //Amount to countdown from (in seconds)
    var countDownValue = 300;
    var newPickUp = false;
    var i = 0;
    var posCalls = 0;
    var map;
    // Used to define whether the game is in place mode or collect mode
    var placeMode = true;
    var allMarkers = [];
    var markerLocation;
    var geolocationRequests = 0;
    
    
    
    function startPositionWatch() {
        var options = { timeout: 10000 };
        watchIDPosition = navigator.geolocation.watchPosition(geolocationSuccess, onPositionError, options);
        alert("new position check");
        //watchIDPosition = navigator.geolocation.getCurrentPosition(geolocationSuccess, onPositionError);
        
    }
    
    function getPositionWatch() {
        var options = { timeout: 10000 };
        getIDPosition = navigator.geolocation.getCurrentPosition(geolocationSuccess, onPositionError, options);
        
    }
    function geolocationSuccess(position) {
        //alert("new location: "+position.coords.latitude+" "+position.coords.longitude);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        if (newPickUp) {
            pickUpLocations.push([latitude, longitude]);
        }
        mapInitialize();
    }
        
        
        
    //function geolocationSuccess(position) {
    //    
    //    //push lat and long to variables and array
    //
    //    latitude = position.coords.latitude;
    //    longitude = position.coords.longitude;
    //    if (p == 1) {
    //        pickUpLocations.push([latitude, longitude]);
    //    }
    //    
    //    mapInitialize();
    //    
    //    //document.getElementById('geolocation').innerHTML = "LAT: " +  position.coords.latitude + " LON: " + position.coords.longitude + " pickups:" +pickUpLocations.length/*"<br />ACC: "+ position.coords.accuracy  + " ELE: "+ position.coords.altitude  + " SPEED(KM): "+ position.coords.speed/3.6*/;
    //    //placeMarkers();
    //        
    //}
    function onPositionError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
    //Render google map to screen and add pickups if this is called for a second time.
    
    function mapInitialize() {
        
        
        //if this is the first init then create map otherwise add pick ups
        if (newPickUp == true) {
            //alert("go pickUps");
            addPickUpsToMap();
            newPickUp = false;
        }
        if (posCalls == 0) {
           var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(latitude, longitude),
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            var currentIconImage = {
                url: "img/youarehere.png",
                // This marker is 20 pixels wide by 32 pixels tall.
                size: new google.maps.Size(36, 36),
                // The origin for this image is 0,0.
                origin: new google.maps.Point(0,0),
                // The anchor for this image is the base of the flagpole at 0,32.
                anchor: new google.maps.Point(18, 18    )
            };
            
            var currentPosMarker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                map: map,
                icon: currentIconImage
            });
        } else {
           moveMarker( map, currentPosMarker ); 
        }
        posCalls++;
        

    
    //move current position marker around the map when a new position is detected.
    
        function moveMarker( map, currentMarker ) {
    
            currentMarker.setPosition( new google.maps.LatLng( latitude, longitude ) );
            //map.panTo( new google.maps.LatLng( 0, 0 ) );
        
        }
        
    //Add markers to the map taking them from the array created at startPositionWatch
    
        function addPickUpsToMap() {
            //alert("add markers");
            var mapBounds = new google.maps.LatLngBounds();
            
           // get location from the newest entry in the array
            //alert(pickUpLocations.length+" markers");
            if ( i < pickUpLocations.length) {
                var markers = pickUpLocations[i];
                var markerLatlng = new google.maps.LatLng(markers[0], markers[1]);
                
                //Select pick-up icon image, based on step frequency
                if (pickUpType == 0) {
                    pickUpImg = "img/starPickUp.png";
                }
                if (pickUpType == 1) {
                    pickUpImg = "img/starPickUpSuper.png";
                }
                if (pickUpType == 2) {
                    pickUpImg = "img/starPickUpMega.png";
                }
                
                var image = {
                    url: pickUpImg,
                    // This marker is 35 pixels wide by 35 pixels tall.
                    size: new google.maps.Size(35, 35),
                    // The origin for this image is 0,0.
                    origin: new google.maps.Point(0,0),
                    // The anchor for this image is at the bottom and in the centre.
                    anchor: new google.maps.Point(0, 17)
                };
                
                //Place pick-up on the Map
                
                marker = new google.maps.Marker({
                    position: markerLatlng,
                    icon: image,
                    animation: google.maps.Animation.DROP,
                    map: map
                });
                
                mapBounds.extend(markerLatlng);
                
                allMarkers.push(marker);
            }
            i++;
            
            //map.fitBounds(mapBounds);
        }
        
        
        
    }
    
     // Detect proximity of 2 sets of lat long values. Using the functions in latlon.js and geo.js 
    
    function detectProximity(lat1, lon1, lat2, lon2) {
        var p1 = new LatLon(Geo.parseDMS(lat1), Geo.parseDMS(lon1));
        var p2 = new LatLon(Geo.parseDMS(lat2), Geo.parseDMS(lon2));
        var distance = (p1.distanceTo(p2))*1000;
        //alert(distance+' metres');
        return distance;
    }
        
    // Start timer to check proximity at a set interval
        
    function pickupProximity() {
        //checkAllLocations();
        var int = setInterval(function(){checkAllLocations()},5000);
        p==2;
        //alert("pick up proximity start");
    }
        
    // Get proximity of pick-ups in relationship to players current position
        
    function checkAllLocations() {
        // Get the players position before calculating their relationship to pickups
        startPositionWatch();
        //To store the distance from the player to all the pickups
        var proximityArray = [];
        var indexOfPickedUps = [];
        alert(pickUpLocations.length+" start locations. List:"+pickUpLocations);
        for (var e=0; e<pickUpLocations.length; e++) {
            var pos = pickUpLocations[e];
            //alert("positions length: "+pickUpLocations.length+" values: "+pickUpLocations+"current Pos: "+latitude+" "+longitude);
            var proximity = detectProximity(pos[0], pos[1], latitude, longitude);
            //alert("proximity single output - "+proximity);
            proximityArray.push(proximity);
            pickUpLocations[e].push(proximity);
            //alert(pickUpLocations);
            
            if (proximity < 15) {
                //pickUpLocations.splice(e,1);
                indexOfPickedUps.push(e);
                //alert("pickup star");
                //alert("positions length: "+pickUpLocations.length);
                
                // remove markers at the position in the array where the proximity is too close
                removePickUps(e);
                
                
            }
           
        }
        alert(indexOfPickedUps.length);
        //remove postion values from the array if they too close to the player
        for (var d=0; d<indexOfPickedUps.length; d++) {
            pickUpLocations.splice(d,1);
        }
        
        
        alert(pickUpLocations.length+" end locations. List:"+pickUpLocations);
    }
    
    //Remove marker icons from the map
    
    function removePickUps(index) {
        allMarkers[index].setMap(null);
    }
    
    //Count down function
    
    function startCountDown() {
        countDownTrigger();
        //alert("countdown is commencing");
    }
        
    function countDownTrigger() {
        if(countDownValue > 0) {
            countDownValue--;
            document.getElementById('countdown').innerHTML = "Active Time Left: "+countDownValue;
            if(countDownValue > 0) {
                countdown = setTimeout('countDownTrigger()', 1000);
            } else {
                alert("Start heading back and collect your stars");
                //alert(pickUpLocations);
                pickupProximity();
                placeMode = false;   
            }
        } 
    }
    
    
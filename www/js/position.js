    var watchIDPosition = null;
    var latitude = 0;
    var longitude = 0;
    var pickUpLocations =[];
    var p = 0;
    var i = 0;
    var t = 0;
    var addPickUpsToMap;
    var pickUpImg;
    var map;
    var proximityArray =[];
    
    function startPositionWatch() {
        //alert("pos 5 sec cycle");
        var options = { timeout: 10000 };
        //watchIDPosition = navigator.geolocation.watchPosition(geolocationSuccess, onPositionError, options);
        watchIDPosition = navigator.geolocation.getCurrentPosition(geolocationSuccess, onPositionError);
    }
        
    function geolocationSuccess(position) {
        
        //push lat and long to variables and array

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        if (p >= 1) {
            pickUpLocations.push([latitude, longitude]);
        }
        
        mapInitialize();
        
        //document.getElementById('geolocation').innerHTML = "LAT: " +  position.coords.latitude + " LON: " + position.coords.longitude + " pickups:" +pickUpLocations.length/*"<br />ACC: "+ position.coords.accuracy  + " ELE: "+ position.coords.altitude  + " SPEED(KM): "+ position.coords.speed/3.6*/;
        //placeMarkers();
            
    }
    function onPositionError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
    //Render google map to screen and add pickups if this is called for a second time.
    
    function mapInitialize() {
    //alert("map
        if (p == 0) {
            //alert("lat: "+latitude+"long: "+longitude);
            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(latitude, longitude),
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        } else {
           addPickUpsToMap(); 
        }
        p++;
        

    //Add markers to the map taking them from the array created at startPositionWatch
    
        function addPickUpsToMap(){
            //alert("add markers");
            var mapBounds = new google.maps.LatLngBounds();
        
           // get location from the newest entry in the array
            //alert(pickUpLocations.length+" markers");
            if ( i < pickUpLocations.length) {
                var markers = pickUpLocations[i];
                var markerLatlng = new google.maps.LatLng(markers[0], markers[1]);
                
                //Select Marker type for map based on step parameters
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
                    // This marker is 20 pixels wide by 32 pixels tall.
                    size: new google.maps.Size(35, 35),
                    // The origin for this image is 0,0.
                    origin: new google.maps.Point(0,0),
                    // The anchor for this image is the base of the flagpole at 0,32.
                    anchor: new google.maps.Point(0, 17)
                };
                
                marker = new google.maps.Marker({
                    position: markerLatlng,
                    icon: image,
                    animation: google.maps.Animation.DROP,
                    map: map
                });
                mapBounds.extend(markerLatlng);
            }
            i++;
            
            //map.fitBounds(mapBounds);
        }
        
    }
    
    //Count down function
    //
    function startCountDown() {
        countDownValue = 120;
        countDownTrigger();
    }
    
    function countDownTrigger() {
        if(countDownValue > 0) {
            countDownValue--;
            document.getElementById('countdown').innerHTML = "Active Time Left: "+countDownValue;
            if(countDownValue > 0) {
                countdown = setTimeout('countDownTrigger()', 1000);
            } else {
                alert("Start heading back and collect your stars");
                alert(pickUpLocations);
                pickupProximity();
            }
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
    
    // Get proximity of pick-ups to players current position
    
    function pickupProximity() {
        for (var l=0; l<pickUpLocations.length; l++) {
            var pos = pickUpLocations[l];
            alert("positions length: "+pickUpLocations.length+" values: "+pickUpLocations+"current Pos: "+latitude+" "+longitude);
            var proximity = detectProximity(pos[0], pos[1], latitude, longitude);
            alert("proximity single output - "+proximity);
            push.proximityArray(proximity);
            alert("proximity values - "+proximityArray);
        }
    }
    
    
    

    
    
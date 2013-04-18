    var compassHeading = 0;
    
    function startCompassWatch() {
        // Update acceleration every .2 seconds
        var options = { frequency: 200 };
        watchIDcompass = navigator.compass.watchHeading(onCompassSuccess, onCompassError, options);
    }
    
    function onCompassSuccess(heading) {
        var disc = document.getElementById("accelerometer");
        compassHeading = Math.floor(Math.abs(heading.magneticHeading));
        document.getElementById('compass').innerHTML = "Heading: " + compassHeading;
        //TweenMax.to(disc, .1, {rotation:compassHeading-90});
    }
    function onCompassError(CompassError) {
        alert('Compass Error: ' + compassError.code);  
    }   
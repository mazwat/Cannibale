    // The watch id references the current `watchAcceleration`

    var watchIDAccel = null;
    
    var stepSample =[];
    var max;
    var min;
    var stepTime;
    var stepTimeSample =[];
    var accelCombiSample =[];
    var accelCombi = 0;
    var isChange = 0;
    var mOldAccX = 0;
    var mOldAccY = 0;
    var mOldAccZ = 0;
    var NumberOfSteps = 0;
    var TotalSteps = 0;
    var Points = 0;
    var pointsSample = [];
    var timer;
    var timerSet = 0;
    var pickUpType = 0;
    var gameTime = 0;
    var countdown;
    var countdown_number;
    
    function startAccelWatch() {
        // Update acceleration every .2 seconds
        var options = { frequency: 200 };
        watchIDAccel = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
        var sendInt = setInterval(sampleSteps,1000);
    }
    
    //onSuccess: Get a snapshot of the current acceleration and process X,Y and Z values into steps
    //
    function stepProcess(acceleration) {
        var xx = acceleration.x;
        var yy = acceleration.y;
        var zz = acceleration.z;
        //var time = acceleration.timestamp;
        var disc = document.getElementById("accelerometer");
        accelCombi = (mOldAccX * xx) + (mOldAccY * yy) + (mOldAccZ * zz);
        var a = Math.abs(Math.sqrt(mOldAccX * mOldAccX + mOldAccY * mOldAccY + mOldAccZ * mOldAccZ));
        
        var b = Math.abs(Math.sqrt(xx * xx + yy * yy + zz * zz));
        
        accelCombi /= (a * b);
        
        //}
        //Get max and min values of accel with function
        //sampleAccelCombi(accelCombi);
        
        if (accelCombi  <= 0.994 && accelCombi > 0.90) { // bounce calibration
            clearTimeout(timer);
            timerSet=0;
            if (!isChange) {
                isChange = 1;   
                NumberOfSteps += 1;
                TotalSteps += 1;
                //stepTime = time/1000;
                // Disc pulses on screen, on step increase
                //
                TweenMax.to(disc, .1, {scale:1.3, repeat:1, yoyo:true});
                
                
                // Send step value everytime value exceeds threshold (multiple of 5)
              
                if (NumberOfSteps % 20 == 0) {
                    //sendSteps();
                    Points += 1;
                    pointsSample.push(1);
                    // Add pickups to map
                    pickUpType = 0;
                    startPositionWatch();
                    
                }
                if (NumberOfSteps % 55 == 0) {
                    //sendSteps();
                    Points += 50;
                    pointsSample.push(2);
                     // Add pickups to map
                    pickUpType = 1;
                    startPositionWatch();
                    
                }
                if (NumberOfSteps % 107 == 0) {
                    //sendSteps();
                    Points += 100;
                    pointsSample.push(3);
                     // Add pickups to map
                    pickUpType = 2;
                    startPositionWatch();
                    
                }
            } else {
                isChange = 0;
            }
            
        //after 3 seconds of no movement set step value to 0
        //
        } else {
            if (!timerSet) {
                timerSet = 1;
                timer = setTimeout(function(){
                    NumberOfSteps=0;
                    timerSet=0;
                },3000);
                
            }
        }
               
        mOldAccX = xx;
        mOldAccY = yy; 
        mOldAccZ = zz;
    }
    
    //Once App is started start calculating steps
    //
    function onSuccess(acceleration) {  
        // Start processing steps
        //
        stepProcess(acceleration);
        //Show steps on screen
        //
        document.getElementById('accelerometer').innerHTML = NumberOfSteps;
        document.getElementById('feedback').innerHTML = "Total Steps: " + TotalSteps;
        //document.getElementById('feedback').innerHTML = "Max: " + max + "<br />Min: " + min;
        document.getElementById('points').innerHTML = "Points: " + Points;
        

    }
    
    function sampleSteps() {
        
        //alert("stepSample");
        if (stepSample.length <= 50) {
            stepSample.push(NumberOfSteps);
            // Add array values and create sparkline graph
            //
            //$(".sparkline").sparkline(stepSample, { type: 'bar', height:'50px',width:'225px',  barWidth: 2, zeroAxis: false, barColor:'#9E1F63'});
            
        } else {
            //Remove first element of array at start to accommodate new entry
            //
            stepSample.shift();
        }
         if (pointsSample.length <= 50) {
            pointsSample.push(0);
            // Add array values and create sparkline graph
            //
            //$(".sparkline2").sparkline(pointsSample, { type: 'bar', height:'50px',width:'225px',  barWidth: 2, zeroAxis: false, barColor:'#FFFFFF'});
            
        } else {
            //Remove first element of array at start to accommodate new entry
            //
            pointsSample.shift();
        }
        
        
        if (accelCombiSample.length <= 20) {
            accelCombiSample.push(accelCombi);
            //$(".sparkline2").sparkline(accelCombiSample, { type: 'bar', height:'50px',width:'225px',  barWidth: 3, zeroAxis: false, barColor:'#FFFFFF'});
            max = Math.max.apply(null, accelCombiSample);
            min = Math.min.apply(null, accelCombiSample);
            
        } else {
            accelCombiSample.shift();
        }
    }
    
     // onError: Failed to get the acceleration
    
    function onError() {
        alert('Error Acceleration Cannot Be Measured');  
    } 
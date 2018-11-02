// =================================================================================================================================
// Initialize Firebase
// =================================================================================================================================

var config = {
    apiKey: "AIzaSyCk9iinDB6nzk-7yvGYupOiB5e-EZ_U8kg",
    authDomain: "traintimes-55235.firebaseapp.com",
    databaseURL: "https://traintimes-55235.firebaseio.com",
    projectId: "traintimes-55235",
    storageBucket: "traintimes-55235.appspot.com",
    messagingSenderId: "369485631475"
};

firebase.initializeApp(config);

// =================================================================================================================================
// Initial Variables
// =================================================================================================================================

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTime = "";
var frequency = 0;

// =================================================================================================================================
// Functions
// =================================================================================================================================

function displayTime(){

    var timeHolder = $("#time-holder");
    var currentTime = "MMMM Do YYYY, h:mm:ss a";

    console.log(moment().format(currentTime));

    timeHolder.text("Current Time: " + moment().format(currentTime));
};

function addTrain() {
    
    $("#add-train").on("click", function(event) {
        event.preventDefault();
    
        //capture values of add train form input
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTime = $("#first-time").val().trim();
        frequency = $("#frequency").val().trim();
    
        //push values to database
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        });
    
    }); 
};

function displayTrain() {

    database.ref().on("child_added", function(snapshot) {

        // capture snapshot value
        var trainInfo = snapshot.val();
    
        // values from snapshot in database
        var trainName = trainInfo.trainName;
        var destination = trainInfo.destination;
        var frequency = trainInfo.frequency;

        // values to calculate locally
        var nextArrival;
        var minutesAway = 0;

            // to calculate var nextArrival and var minutesAway
            var firstTime = trainInfo.firstTime;
                
                // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
                console.log(firstTimeConverted);

                // Current time
            var currentTime = moment();
                console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

                // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
                console.log("DIFFERENCE IN TIME: " + diffTime);

                // Time apart (remainder)
            var tRemainder = diffTime % frequency;
                console.log(tRemainder);

                // Minute Until Train
            var minutesAway = frequency - tRemainder;
             console.log("MINUTES TILL TRAIN: " + minutesAway);

                // Next Train
            var nextArrival = moment().add(minutesAway, "minutes");
                console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

            var nextArrivalPretty;

        // HOOK TO HTML
        var trainHolder = $("#train-holder");
            trainHolder.append("<tr><td>" + 
                trainName + "</td><td>" +
                destination + "</td><td>" +
                frequency + "</td><td>" +
                nextArrival + "</td><td>" +
                minutesAway + "</td></tr>");
    
    // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);

    }); // close database event listener
    
};

// =================================================================================================================================
// Main Process
// =================================================================================================================================

displayTime();

addTrain();

displayTrain();



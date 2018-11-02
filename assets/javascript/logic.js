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

        // to capture snapshot value
        var trainInfo = snapshot.val();
    
        // values from snapshot in database
        var trainName = trainInfo.trainName;
        var destination = trainInfo.destination;
        var frequency = trainInfo.frequency;

        // values to calculate locally
        var nextArrivalFormatted;
        var minutesAway = 0;

            // to calculate var nextArrival and var minutesAway:
                var firstTime = trainInfo.firstTime;

                // First Time (pushed back 1 year to make sure it comes before current time)
                var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
                    
                // Difference between the current time and first train time
                var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
                    
                // Time apart (remainder)
                var remainder = timeDiff % frequency;
                    
                // Minute Until Train
                var minutesAway = frequency - remainder;

                // Next Train
                var nextArrival = moment().add(minutesAway, "minutes");

                // Fix Time Format
                var nextArrivalFormatted = moment(nextArrival).format("LT");

        // HOOK TO HTML
        var trainHolder = $("#train-holder");
            trainHolder.append("<tr><td>" + 
                trainName + "</td><td>" +
                destination + "</td><td>" +
                frequency + "</td><td>" +
                nextArrivalFormatted + "</td><td>" +
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

$("#clear-form").on("click", function(event) {
    event.preventDefault();

    console.log("CLICK")

    $("#train-name").empty();
    $("#destination").empty();
    $("#first-time").empty();
    $("#frequency").empty();
});



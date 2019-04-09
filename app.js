//Firebase config.
 var config = {
    apiKey: "AIzaSyDjLosdjOivGJ6BnyzbovcTv0_k85xwC7w",
    authDomain: "train-station-hw-5a14f.firebaseapp.com",
    databaseURL: "https://train-station-hw-5a14f.firebaseio.com",
    projectId: "train-station-hw-5a14f",
    storageBucket: "train-station-hw-5a14f.appspot.com",
    messagingSenderId: "874683728327"
    };


firebase.initializeApp(config);

//variables
var database = firebase.database();
var trainName = "";
var destination = "";
var startTime = "";
var frequency = 0;

//Clock on jumbo.
function currentTime() {
  var current = moment().format('LT');
  $("#currentTime").html(current);
  setTimeout(currentTime, 1000);
};

//Form input logic.
$(".form-field").on("keyup", function() {
  var traintemp = $("#train-name").val().trim();
  var citytemp = $("#destination").val().trim();
  var timetemp = $("#first-train").val().trim();
  var freqtemp = $("#frequency").val().trim();
//key/value pair.
  sessionStorage.setItem("train", traintemp);
  sessionStorage.setItem("city", citytemp);
  sessionStorage.setItem("time", timetemp);
  sessionStorage.setItem("freq", freqtemp);
});

$("#train-name").val(sessionStorage.getItem("train"));
$("#destination").val(sessionStorage.getItem("city"));
$("#first-train").val(sessionStorage.getItem("time"));
$("#frequency").val(sessionStorage.getItem("freq"));

//Submit button.
$("#submit").on("click", function(event) {
  event.preventDefault();

    //Make sure all input is filed in.
  if ($("#train-name").val().trim() === "" ||
    $("#destination").val().trim() === "" ||
    $("#first-train").val().trim() === "" ||
    $("#frequency").val().trim() === "") {

        // Alert if not.
    alert("Please fill in all details to add new train");

  } else {
    //Display new input.
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    $(".form-field").val("");
    
    //Pushing object data into database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      startTime: startTime,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    // Removes all saved data.
    sessionStorage.clear();
  }

});

//Momentjs math logic.
database.ref().on("child_added", function(childSnapshot) {
  var startTimeConverted = moment(childSnapshot.val().startTime, "hh:mm").subtract(1, "years");
  var timeDiff = moment().diff(moment(startTimeConverted), "minutes");
  var timeRemain = timeDiff % childSnapshot.val().frequency;
  var minToArrival = childSnapshot.val().frequency - timeRemain;
  var nextTrain = moment().add(minToArrival, "minutes");
  var key = childSnapshot.key;

  //Appends each item in new form list with momentjs logic.
  var newrow = $("<tr>");
  newrow.append($("<td>" + childSnapshot.val().trainName + "</td>"));
  newrow.append($("<td>" + childSnapshot.val().destination + "</td>"));
  newrow.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  newrow.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  newrow.append($("<td class='text-center'>" + minToArrival + "</td>"));
  newrow.append($("<td class='text-center'><button class='arrival btn btn-danger btn-xs' data-key='" + key + "'>X</button></td>"));

    //Appending new train info row to browser.
  $("#train-table-rows").append(newrow);

});

//Deletes train info when click the X (cancel).
$(document).on("click", ".arrival", function() {
  keyref = $(this).attr("data-key");
  database.ref().child(keyref).remove();
  window.location.reload();
});

// Callin time function in jumbo
currentTime();

//Refresh page every min.
setInterval(function() {
  window.location.reload();
}, 60000);

$('.carousel').carousel({
    interval: 2000
  })
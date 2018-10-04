// step one of the game going into login. 
$(document).ready(function(event) {
update();
});
$(document).on("click", "#signU", function() {
    $(".start").hide();
    // $(".signup").show();
    var a = $("<div />", {
        class: "jumbotron jumbotron-fluid signup"
    });
    var b = $("<form action='#' />").html('<form action="#">'+
    '<h4 class="display-3 text-center">welcome create your account</h1><br>'+
    '<div class="input-group mb-3 mt-5"><div class="input-group-prepend">'+
    '<span class="input-group-text" id="inputGroup-sizing-default">user name</span></div>' +
    '<input type="text" id="userName" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
    '<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default">password</span></div>' +
    '<input type="text" id="userPassw" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
    '<div class="container d-flex justify-content-center"><br><button type="submit" class="btn btn-primary newUser">Sign Up</button></div>' +
    '<div> <h3><span id="connected-viewers">0</span> users connected</h3></div></form>');
    a.append(b);
    $(document.body).append(a);
    update();
});
$(document).on("click", "#login", function() {
    $(".start").hide(); 
    var a = $("<div />", {
        class: "jumbotron jumbotron-fluid signin"
    });
    var b = $("<form action='#' />").html('<form action="#">'+
    '<h4 class="display-3 text-center">enter your information</h1><br>'+
    '<div class="input-group mb-3 mt-5"><div class="input-group-prepend">'+
    '<span class="input-group-text" id="inputGroup-sizing-default">user name</span></div>' +
    '<input type="text" id="userName" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
    '<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default">password</span></div>' +
    '<input type="text" id="userPassw" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
    '<div class="container d-flex justify-content-center"><br><button type="submit" class="btn btn-success reUser">Sign In</button></div>' +
    '<div> <h3><span id="connected-viewers">0</span> users connected</h3></div></form>');
    a.append(b);
    $(document.body).append(a);
    update();
});
$(document).on("click", ".newUser",function() {
    event.preventDefault();
    var a = JSON.stringify($("#userName").val().trim());
    var b = JSON.stringify($("#userPassw").val().trim());
    if (a.length < 3 && b.length < 3) {
        alert("you must enter a username and password");
    }
    if (a.length < 3 && b.length > 2) {
        alert("you must enter a username");
    }
    if (b.length < 3 && a.length > 2) {
        alert("you must enter a password");
    }
    if (a.length > 2 && b.length > 2) {
        // console.log(db.ref("/").val());
        u = $("#userName").val().trim();
        p = $("#userPassw").val().trim();
        $("#userName").val('');
        $("#userPassw").val('');
        console.log('before brokenstuff');
        checkUser("/"+u);        
    } 
});
$(document).on("click", ".reUser",function() {
    event.preventDefault();
    var a = JSON.stringify($("#userName").val().trim());
    var b = JSON.stringify($("#userPassw").val().trim());
    if (a.length < 3 && b.length < 3) {
        alert("you must enter a username and password");
    }
    if (a.length < 3 && b.length > 2) {
        alert("you must enter a username");
    }
    if (b.length < 3 && a.length > 2) {
        alert("you must enter a password");
    }
    if (a.length > 2 && b.length > 2) {
        // console.log(db.ref("/").val());
        u = $("#userName").val().trim();
        p = $("#userPassw").val().trim();
        $("#userName").val('');
        $("#userPassw").val('');
        console.log('before check');
        login("/"+u,p);
    } 
});// end re user login on click - currently no function for action. 

// working function to check if username already exists
function checkUser(user) {
    db.ref("/users").child(user).once('value', function(snapshot) {
        if (snapshot.exists()) {
            alert("this user already exists, please make a new one or refresh and login");
        }
        else {db.ref("/users").child("/"+u).set({pwrd: p});}
    })
};// end checkUser function
//start function to check password if user exists
function login(user, pwrd) {
    db.ref("/users").child(user).once('value', function(snapshot) {
        if (snapshot.exists() && snapshot.val().pwrd == pwrd) {
            console.log("user and pwrd are right");     
            createGame();       
        } else { alert("please enter correct username and password");}
        
    })
};// end login function
function createGame() {
    $(document.body).html("");
    var a = $("<div />", {
        class: "jumbotron jumbotron-fluid game"
    }).appendTo($(document.body));
    var b = $("<div />", {
        class: "container"
    }).html($("<div />", {class: "row"}).html($("<div />", {class: "col col-lg-12"}).html($("<p />", {class: "lead text=center"}).text("welcome")))).appendTo(a);
};
// start firebase 
var config = {
    apiKey: "AIzaSyCDzv0VqDcyr9Q2T3ARcyVPiI3Uyr3aFI4",
    authDomain: "rpsbb-7767f.firebaseapp.com",
    databaseURL: "https://rpsbb-7767f.firebaseio.com",
    projectId: "rpsbb-7767f",
    storageBucket: "rpsbb-7767f.appspot.com",
    messagingSenderId: "625964534953"
    };
firebase.initializeApp(config);
var db = firebase.database();
var users = db.ref("/users");
db.ref().on("value", function(snap) {
    console.log('this is from database existing')
    console.log(snap.val());
});
// start current connections counter
var connectionsRef = db.ref("/connections");
var connectedRef = db.ref(".info/connected");
connectedRef.on("value", function(snap) {
        // If they are connected..
        if (snap.val()) {
            // Add user to the connections list.
            var con = connectionsRef.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
});
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {
    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#connected-viewers").text(snap.numChildren());
});
// end connections counter
//start function to update connections on html change
function update() {
    connectedRef.on("value", function(snap) {
        // If they are connected..
        if (snap.val()) {
            // Add user to the connections list.
            var con = connectionsRef.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
});
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {
    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#connected-viewers").text(snap.numChildren());
});
};
// end function update. 

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
db.ref().on("value", function (snap) {
    // this runs if the database exists or changes (i think if changes)
});
// start current connections counter
var playerRef = db.ref("/players/player");
var connectionsRef = db.ref("/connections");
var connectedRef = db.ref(".info/connected");
var p1 = db.ref("player1");
var p2 = db.ref("player2");
//below is testing because firebase is fukin hard and we haven't learned enough to do this
playerRef.on("child_added", function (childSnap, prevKey) {
    // console.log("first is child snap");
    // console.log(childSnap.key);
    // sessionStorage.id = childSnap.key;
    // console.log("then prevkey");
    // console.log(prevKey);
})
connectedRef.on("value", function (snap) {
    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        var player = playerRef.push(true);
        // Remove user from the connection list when they disconnect.
        player.onDisconnect().remove();
        console.log('below is player');
        console.log(player.key);
        sessionStorage.id = player.key;
        con.onDisconnect().remove();
        updateUser(sessionStorage.l, sessionStorage.id, sessionStorage.p);
    }
    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snap) {
        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#connected-viewers").text(snap.numChildren());
    });
    // end connections counter
});
db.ref("player1").once("value").then(function (snap) {
    var a = snap.exists();
    if(snap.val() == false) {
        console.log("player1 doesn't exist yet.")
    }
});
// step one of the game going into login. 
$(document).ready(function (event) {
    setInterval(update(), 6000);
    console.log(sessionStorage);
    console.log("this triggered");
    if (db.ref("player1") == false) {
        alert("no player 1");
    }
});
$(document).on("click", "#signU", function () {
    $(".start").hide();
    // $(".signup").show();
    var a = $("<div />", {
        class: "jumbotron jumbotron-fluid signup"
    });
    var b = $("<form action='#' />").html('<form action="#">' +
        '<h4 class="display-3 text-center">welcome create your account</h1><br>' +
        '<div class="input-group mb-3 mt-5"><div class="input-group-prepend">' +
        '<span class="input-group-text" id="inputGroup-sizing-default">user name</span></div>' +
        '<input type="text" id="userName" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
        '<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default">password</span></div>' +
        '<input type="text" id="userPassw" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
        '<div class="container d-flex justify-content-center"><br><button type="submit" class="btn btn-primary newUser">Sign Up</button></div>' +
        '<div> <h3><span id="connected-viewers">0</span> users connected</h3></div></form>');
    a.append(b);
    $(document.body).append(a);
    update();
});// end singup function for new user populates new login content
$(document).on("click", "#login", function () {
    $(".start").hide();
    var a = $("<div />", {
        class: "jumbotron jumbotron-fluid signin"
    });
    var b = $("<form action='#' />").html('<form action="#">' +
        '<h4 class="display-3 text-center">enter your information</h1><br>' +
        '<div class="input-group mb-3 mt-5"><div class="input-group-prepend">' +
        '<span class="input-group-text" id="inputGroup-sizing-default">user name</span></div>' +
        '<input type="text" id="userName" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
        '<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-default">password</span></div>' +
        '<input type="text" id="userPassw" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"></div>' +
        '<div class="container d-flex justify-content-center"><br><button type="submit" class="btn btn-success reUser">Sign In</button></div>' +
        '<div> <h3><span id="connected-viewers">0</span> users connected</h3></div></form>');
    a.append(b);
    $(document.body).append(a);
    update();
});// end on click function for login populates login content
$(document).on("click", ".newUser", function () {
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
        u = $("#userName").val().trim();
        p = $("#userPassw").val().trim();
        $("#userName").val('');
        $("#userPassw").val('');
        checkUser("/" + u, p);
    }
});// end new user sign up click function checks input. 
$(document).on("click", ".reUser", function () {
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
        u = $("#userName").val().trim();
        p = $("#userPassw").val().trim();
        $("#userName").val('');
        $("#userPassw").val('');
        login("/" + u, p);
        sessionStorage.l = "/" + u;
    }
});// end re user login on click - checks input 
$(document).on("click", ".move", function () {
    console.log($(this)[0].id);
    $(this).removeClass("click").addClass("clicked")
    $(".click").hide();
    db.ref("player1").set({ true: true, guess: $(this)[0].id })
});
function checkplayer1() {
    db.ref().once("value").then(function (snap) {
        var a = snap.child("player1").val();
        if (a == false){
            p1.set(true);
        }
        var b = snap.child("player1").val();
        if (b == true) {
            p2.set(true);
        }
    });
};// end check for player 1 function
function updateUser(user, id, password) {
    db.ref("/users").child(user).set({ pwrd: password, id: id });

};// updates user; this was for doing multiplayer before realizing difficulty of no limit.
// working function to check if username already exists
function checkUser(user, password) {
    db.ref("/users").child(user).once('value', function (snapshot) {
        if (snapshot.exists()) {
            alert("this user already exists, please make a new one or refresh and login");
        }
        else {
            db.ref("/users").child("/" + u).set({ pwrd: p, id: sessionStorage.id });
            createGame();
            sessionStorage.l = "/" + user;
            sessionStorage.p = password;
        }

    })
};// end checkUser function
//start function to check password if user exists
function login(user, password) {
    db.ref("/users").child(user).once('value', function (snapshot) {
        if (snapshot.exists() && snapshot.val().pwrd == password) {
            db.ref("/users").child(user).set({ pwrd: password, id: sessionStorage.id });
            createGame();
            checkplayer1();
            sessionStorage.l = "/" + user;
            sessionStorage.p = password;
        } else { alert("please enter correct username and password"); }
    })
};// end login function
function createGame() {
    window.location = ("game.html");

};
//start function to update connections on html change
function update() {
    connectionsRef.on("value", function (snap) {
        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#connected-viewers").text(snap.numChildren());
    });
};
    // end function update. 
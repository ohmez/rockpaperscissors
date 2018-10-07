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
// start current connections counter
var connectionsRef = db.ref("/connections");
var connectedRef = db.ref(".info/connected");
var p1 = db.ref("player1");
var p2 = db.ref("player2");
// start connection functions
connectedRef.on("value", function (snap) {
    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        sessionStorage.id = con.key;
        con.onDisconnect().remove();
        updateUser(sessionStorage.l, sessionStorage.id, sessionStorage.p, sessionStorage.w);
    }
    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snap) {
        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#connected-viewers").text(snap.numChildren());
    });
});// end connections counter
db.ref().on("value", function(snap) {
    var a = snap.child("player1").child("guess").exists();
    var b = snap.child("player2").child("guess").exists();
    if (a && b){
        console.log("player 1 and 2 guess ready");
        // run guess check function here 
        checkGuess();
    }
});// end listener for guesses to run the match
//start doc.ready's and doc.on"clicks"
$(document).ready(function (event) {
    console.log(sessionStorage);
    
});
// step one of the game going into login. 
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
    }
});// end re user login on click - checks input 
$(document).on("click", ".click", function () {
    console.log($(this)[0].id);
    $(this).addClass("clicked").removeClass("click");
    $(".click").hide();
    $("#moveText").html("your move");
    $("#moveInfo").html("waiting for opponents move")
    db.ref("player"+sessionStorage.playerNum).set({ true: true, guess: $(this)[0].id })
});
function resetMatch() {
    $("#moveText").html("make your move");
    $("#moveInfo").html("");
    $(".clicked").addClass("click").removeClass("clicked"); 
    $(".click").show();
};
function updateWins(user) {
    db.ref().once("value").then(function (snap) {
        db.ref("player1").child("guess").set("none");
        db.ref("player2").child("guess").set("none");
        newWins = sessionStorage.w;
        db.ref().child("users").child(user).child("wins").set(newWins);
    });
    resetMatch();
};// end function to update wins to server; called in checkGuess()
function checkGuess() {
db.ref().once("value").then(function (snap) {
var a = snap.child("player1").child("guess").val();
var b = snap.child("player2").child("guess").val();
    if (a == 'rock') {
        if (b == 'scissors') {
        console.log("guess 1 wins");
            if (sessionStorage.playerNum == '1') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                wins = wins +1;
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }if (sessionStorage.playerNum == '2') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }
        }
        if (b == 'paper') {
        console.log("guess 2 wins");
            if (sessionStorage.playerNum == '2') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                wins = wins +1;
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }if (sessionStorage.playerNum == '1') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }
        }
        if (b == 'rock') {
        console.log("nobody wins");
        if (sessionStorage.playerNum == '1') {
            // run update wins 
            var wins = parseInt(sessionStorage.w);
            wins = wins;
            sessionStorage.w = wins; 
            updateWins(sessionStorage.l);
        }if (sessionStorage.playerNum == '2') {
            // run update wins 
            var wins = parseInt(sessionStorage.w);
            sessionStorage.w = wins; 
            updateWins(sessionStorage.l);}
        }
    }// end complete cycle of guess comparison 1
    if (a == 'paper') {
        if (b == 'rock') {
        console.log("guess 1 wins");
            if (sessionStorage.playerNum == '1') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                wins = wins +1;
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }if (sessionStorage.playerNum == '2') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }
        }
        if (b == 'scissors') {
        console.log("guess 2 wins");
            if (sessionStorage.playerNum == '2') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                wins = wins +1;
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }if (sessionStorage.playerNum == '1') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);}
        }
        if (b == 'paper') {
        console.log("nobody wins");
        if (sessionStorage.playerNum == '1') {
            // run update wins 
            var wins = parseInt(sessionStorage.w);
            wins = wins;
            sessionStorage.w = wins; 
            updateWins(sessionStorage.l);
        }if (sessionStorage.playerNum == '2') {
            // run update wins 
            var wins = parseInt(sessionStorage.w);
            sessionStorage.w = wins; 
            updateWins(sessionStorage.l);}
        }
    }// end complete cycle of guess comparison 2
    if (a == 'scissors') {
        if (b == 'paper') {
        console.log("guess 1 wins");
            if (sessionStorage.playerNum == '1') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                wins = wins +1;
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }if (sessionStorage.playerNum == '2') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }
        }
        if (b == 'rock') {
        console.log("guess 2 wins");
            if (sessionStorage.playerNum == '2') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                wins = wins +1;
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);
            }if (sessionStorage.playerNum == '1') {
                // run update wins 
                var wins = parseInt(sessionStorage.w);
                sessionStorage.w = wins; 
                updateWins(sessionStorage.l);}
        }
        if (b == 'scissors') {
        console.log("nobody wins");
        if (sessionStorage.playerNum == '1') {
            // run update wins 
            var wins = parseInt(sessionStorage.w);
            wins = wins;
            sessionStorage.w = wins; 
            updateWins(sessionStorage.l);
        }if (sessionStorage.playerNum == '2') {
            // run update wins 
            var wins = parseInt(sessionStorage.w);
            sessionStorage.w = wins; 
            updateWins(sessionStorage.l);}
        }
    }// end complete cycle of guess comparison 3
});
};// end guess check function called in database listener 
function checkplayer1() {
    db.ref().once("value").then(function (snap) {
        var d = snap.child("player2").val();
        var a = snap.child("player1").val();
        if (d == false) {
            if (a == false){
                p1.set(true);
                sessionStorage.playerNum = 1;
            }
        }
        if (d == false && a == true ) {
            if (sessionStorage.playerNum == 1) {}
            p2.set(true);
            sessionStorage.playerNum = 2;
            }
    });
};// end check for player 1 function
function updateUser(user, id, password, wins) {
    db.ref("/users").child(user).set({ pwrd: password, id: id, wins: wins });

};// updates user; this pushes data to the server when server connections change. 
function checkUser(user, password) {
    db.ref("/users").child(user).once('value', function (snapshot) {
        if (snapshot.exists()) {
            alert("this user already exists, please make a new one or refresh and login");
        }
        else {
            db.ref("/users").child("/" + u).set({ pwrd: p, id: sessionStorage.id, wins: '0' });
            createGame();
            checkplayer1();
            sessionStorage.l = user;
            sessionStorage.p = password;
            sessionStorage.w = 0;
        }

    })
};// end checkUser function for signing up for new users.
function login(user, password) {
    db.ref("/users").child(user).once('value', function (snapshot) {
        if (snapshot.exists() && snapshot.val().pwrd == password) {
            db.ref("/users").child(user).set({ pwrd: password, id: sessionStorage.id, wins:snapshot.child("wins").val()});
            createGame();
            checkplayer1();
            sessionStorage.l = user;
            sessionStorage.p = password;
            sessionStorage.w = snapshot.child("wins").val();
        } else { alert("please enter correct username and password"); }
    })
};// end login function to check password if user exists
function createGame() {
    window.location = ("game.html");
};// end function to create game, currently moves to new html page, unsure if i want to generate html or not dynamicly
function update() {
    connectionsRef.on("value", function (snap) {
        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#connected-viewers").text(snap.numChildren());
    });
};// end function update. html change
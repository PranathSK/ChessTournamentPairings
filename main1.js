// The only Array needed; the players' details; And r is for useless return values from functions as js has been inconsistent
var players = [];
var r = 0;

// Function called by the <next player> button Clears the field for new input and stores the value given
function nextf(){
    var namez = document.getElementById('name').value;
    var ratingw = Number(document.getElementById('rating').value);
    
    // As a dictionary to ease work instead of a whacky 2D arrays
    players.push({
        name: namez,
        rating: ratingw,
        ratingi: ratingw,
        tiebreaker: 0.0,
        score: 0.0
    });

    // Display the last person entered and clear the input fields
    document.getElementById('hi').innerHTML = "Last player - Entered: " + namez+ '-' + ratingw +' ('+players.length+')';
    document.getElementById('name').value = '';
    document.getElementById('rating').value = '';
}

// The magic...Called by the <Start Rounds> button
function startrounds(){
    r = clb();
    var rounds = 3;
    if (players.length >= 16 && players.length < 35)
        rounds = 4;
    else if(players.length >= 35 && players.length < 55)
        rounds = 5;
    else if(players.length >= 55 && players.length < 70)
        rounds = 6;
    else if(players.length >= 70)
        rounds = 7;
    r = update();
    var ch;
    do{
        ch = Math.round(Math.random()*3);
    }while(ch == 0);
    for (var y = 1; y <= rounds; y++){
        console.log(ch);
        alert("Round " + y + " is Starting");
        if (ch == 1)
            r = typeTwo();
        else if(ch == 2)
            r = typeThree();
        else if(ch == 3)
            r = typeOne();
        alert("Round " + y + " has Ended");
        if (ch == 3)
            ch = 1;
        else
            ch += 1;        
    }
    document.getElementById('current').innerHTML+= "Rounds Playerd: " + rounds +". Standings are as follows: <br>"
    for (r = 0; r < players.length; r++){
        console.log(players[r]);
        document.getElementById('current').innerHTML += (r+1) + ". " + players[r].name +' - '+ players[r].ratingi + " => "
         + players[r].rating + " Score: " + players[r].score + " SB score: " + players[r].tiebreaker + '<br>';
    }
}

function update(){
    for (var x = 0; x < players.length-1; x++){
        for (var y = 0; y < players.length-x-1; y++){            
            if (players[y].score < players[y+1].score){
                var temp = players[y];
                players[y] = players[y+1];
                players[y+1] = temp;
            }
            else if (players[y].score == players[y+1].score){
                if (players[y].tiebreaker < players[y+1].tiebreaker){
                    var temp = players[y];
                    players[y] = players[y+1];
                    players[y+1] = temp
                }
                else if (players[y].tiebreaker == players[y+1].tiebreaker){
                    if (players[y].rating < players[y+1].rating){
                        var temp = players[y];
                        players[y] = players[y+1];
                        players[y+1] = temp
                    }
                    else if (players[y].rating == players[y+1].rating){
                        if (players[y].name > players[y+1].name){
                            var temp = players[y];
                            players[y] = players[y+1];
                            players[y+1] = temp
                        }
                    }
                }
            }
        }
    }
    return 0;
}
function result(pl1, pl2, res){
    if (res === "1-0"){
        players[pl1].score += 1;
        players[pl1].tiebreaker += players[pl2].score;
        players[pl1].rating += rchange(players[pl1].rating, players[pl2].rating, 1.0);
        players[pl2].rating += rchange(players[pl2].rating, players[pl1].rating, 0.0);
    }
    else if (res === "0-1"){
        players[pl2].score += 1;
        players[pl2].tiebreaker += players[pl1].score;
        players[pl1].rating += rchange(players[pl1].rating, players[pl2].rating, 0.0);
        players[pl2].rating += rchange(players[pl2].rating, players[pl1].rating, 1.0);
    }
    else{
        players[pl1].score += 0.5;
        players[pl2].score += 0.5;
        players[pl1].tiebreaker += players[pl2].score * 0.5;
        players[pl2].tiebreaker += players[pl1].score * 0.5;
        players[pl1].rating += rchange(players[pl1].rating, players[pl2].rating, 0.5);
        players[pl2].rating += rchange(players[pl2].rating, players[pl1].rating, 0.5);
    }
    return 0;
}

function typeOne(){
    document.getElementById('current').innerHTML = 'Pairings: <br>';
    var rem = players.length % 2;
    var pl = 0;
    for (var i = 0; i < (players.length-rem)/2; i++){
        var x = pl + 1;
        var res = prompt(players[pl].name + " VS " + players[x].name, "");
        r = result(pl, x, res);
        pl += 2;
    }
    if (rem == 1){
        alert(players[players.length-1].name + " Gets Bye Press OK to continue");
        players[players.length-1].score += 1;
    }
    r = update();
    return 0;
}
function typeTwo(){
    var rem = players.length % 4;
    var over = 0;
    var point = 0;
    for (var b = 0; b < (players.length-rem)/2; b++){
        var res = prompt(players[point+2].name + " VS " + players[point].name, "");
        r = result(point+2, point, res);
        over += 2;
        if (over % 4 == 0)
            point = over;
        else
            point += 1;
    }
    if (rem == 1){
        alert(players[players.length-1].name + " Gets Bye Press OK to continue");
        players[players.length-1].score += 1;
    }
    else if (rem == 2){
        var res = prompt(players[players.length-2].name + " VS " + players[players.length-1].name, "");
        r = result(players.length-2, players.length-1, res);
    }
    else if(rem == 3){
        var res = prompt(players[players.length-3].name + " VS " + players[players.length-1].name, "");
        r = result(players.length-3, players.length-1, res);
        alert(players[players.length-2].name + " Gets Bye Press OK to continue");
        players[players.length-2].score += 1;
    }
    r = update();
    return 0;
}
function typeThree(){
    var rem = players.length % 6;
    var over = 0
    var point = 0
    for (var b = 0; b < (players.length-rem)/2; b++){
        var res = prompt(players[point].name + " VS " + players[point+3].name, "");
        r = result(point, point+3, res);
        over += 2;
        if (over % 6 == 0)
            point = over
        else
            point += 1;
    }
    if (rem == 1){
        alert(players[players.length-1].name + " Gets Bye Press OK to continue");
        players[players.length-1].score += 1;
    }
    else if (rem == 2){
        var res = prompt(players[players.length-2].name + " VS " + players[players.length-1].name, "");
        r = result(players.length-2, players.length-1, res);
    }
    else if(rem == 3){
        var res = prompt(players[players.length-2].name + " VS " + players[players.length-1].name, "");
        r = result(players.length-2, players.length-1, res);
        alert(players[players.length-3].name + " Gets Bye Press OK to continue");
        players[players.length-3].score += 1;
    }
    else if(rem == 4){
        var res = prompt(players[players.length-1].name + " VS " + players[players.length-4].name, "");
        r = result(players.length-1, players.length-4, res);
        res = prompt(players[players.length-3].name + " VS " + players[players.length-2].name, "");
        r = result(players.length-3, players.length-2, res);
    }
    else if(rem == 5){
        var res = prompt(players[players.length-2].name + " VS " + players[players.length-4].name, "");
        r = result(players.length-2, players.length-4, res);
        res = prompt(players[players.length-3].name + " VS " + players[players.length-5].name, "");
        r = result(players.length-3, players.length-5, res);
        alert(players[players.length-1].name + " Gets Bye Press OK to continue");
        players[players.length-1].score += 1;        
    }
    r = update();
    return 0;
}
function rchange(a, b, r){
    var sub = a - b;
    var expect;
    if (sub >= 0){
        if (sub <= 25)
            expect = 0.5;
        else if (sub > 25 && sub <= 50)
            expect = 0.75;
        else 
            expect = 1.0
    }
    
    else{
        if (sub >= -25)
            expect = 0.5;
        else if (sub < -25 && sub >= -50)
            expect = 0.25;
        else 
            expect = 0.0;
    }
    return (10*(r-expect));
}

function viewPlayers(){
    console.clear();
    for (var i = 0; i < players.length; i++)
        console.log(players[i]);
}
function clb(){    
    document.getElementById('pls').style.visibility = "hidden";
    return 0;
}
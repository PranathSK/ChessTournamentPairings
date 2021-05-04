/* Players array is the main one that contains everything, r is for useless return variables
fTwo is to make sure if or not special has to come */
var players = [];
var fTwo = false;
var r = 0;
var details = [0, 1, 1, 0];
// Details[0]: position of players, Details[1]: Type of pairing, Details[2]: round No. Details[4]: Board no.

// Function called by the <next player> button Clears the field for new input and stores the value given
// EZ
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
    r = update();
    document.getElementById('pls').style.visibility = "hidden";
    var rounds = 2;
    if (details[2] > rounds){        
        document.getElementById("current").innerHTML = '';
        for (var i = 0; i < players.length; i++){
            document.getElementById("current").innerHTML += (i+1) + '. ' + players[i].name + '<br>';
            console.log(players[i]);
        }
        var rel = document.createElement('button');
        rel.innerHTML = 'New Tourney';
        rel.onclick = function() {window.location.replace('test.html')};
        document.getElementById("current").style.visibility = 'visible';
        document.getElementById("current").append(rel);

    }
    else{
        details[0] = 0;
        details[3] = 0;
        r = navigateThrough(false);
    }
    return 0;
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
function navigateThrough(done){
    if (done)
        startrounds();
    else{
        document.getElementById('current').innerHTML = '';     
        r = askResult();
        r = printPairings();
        return 0;
    }
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
    return 0;
}
function printPairings(){
    var rem;
    var pos;
    var b = 0;
    if (details[1] == 1){
        pos = 0;
        rem = players.length % 2;
        for (b = 0; b < (players.length-rem)/2; b++){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[pos].name + '  Vs  ' + players[pos+1].name;
            pos += 2;
        }
        if (rem == 1){
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
    }
    if (details[1] == 2){
        pos = 0;
        rem = players.length % 4;
        for (b = 0; b < (players.length-rem)/2; b++){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[pos+2].name + '  Vs  ' + players[pos].name;
            if ((details[0]+3)%4 == 0)
                pos = details[0]+3;
            else
                pos += 1;
        }
        if (rem == 1){
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
        else if (rem == 2)
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+2) + ': ' + players[players.length-2].name + '  Vs  ' + players[players.length-1].name;
        else if (rem == 3){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+2) + ': ' + players[players.length-1].name + '  Vs  ' + players[players.length-3].name;
            document.getElementById("current").innerHTML += '<br>' + players[players.length-2].name + ' Gets Bye';
            players[players.length-2].score += 1;
        }
    }
    return 0;
}

// hard as hell
function askResult(){
    if (details[1] == 1){
        var rem = players.length % 2;
        var boards = (players.length-rem)/2;
        if (details[3] >= boards){
            details[1] = 2;
            details[2] += 1;
            r = navigateThrough(true);
            return 0;
        }
        else{
            document.getElementById('matchup').innerHTML = players[details[0]].name + '  Vs  ' + players[details[0]+1].name + '  ';
            document.getElementById('resultBox').innerHTML = 'Submit and Next';
            return 0;
        }
    }
    else if (details[1] == 2){
        var rem = players.length % 2;
        var boards = (players.length-rem)/2;
        if (details[3] >= boards){
            details[1] = 3;
            details[2] += 1;
            r = navigateThrough(true);
            return 0;
        }
        else{
            if (players.length % 4 == 2 && (details[3]+1) == boards){
                document.getElementById('matchup').innerHTML = players[players.length-2].name + '  Vs  ' + players[players.length-1].name + '  ';
                fTwo = true;
                return 0;
            }
            else
                document.getElementById('matchup').innerHTML = players[details[0]+2].name + '  Vs  ' + players[details[0]].name + '  ';
        }
    }
}
function navRes(){
    if (details[1] == 1){
        r = result(details[0], details[0]+1, document.getElementById('resultBox').value);
        document.getElementById('resultBox').value = '';
        details[0] += 2;
        details[3] += 1;
        r = askResult();
        return 0;
    }
    else if (details[1] == 2){
        if (fTwo){
            r = result(players.length-2, players.length-1, document.getElementById('resultBox').value);
            fTwo = false;
            document.getElementById('resultBox').value = '';
            details[3] += 1;
            r = askResult();
            return 0;
        }
        else{
            r = result(details[0]+2, details[0], document.getElementById('resultBox').value);
            document.getElementById('resultBox').value = '';
            if ((details[0]+3)%4 == 0)
                details[0] += 3;
            else
                details[0] += 1;
            details[3] += 1;
            r = askResult();
            return 0;
        }
    }
}
/* Players array is the main one that contains everything, r is for useless return variables
fTwo is to make sure if or not special has to come 
fth is for the 3rd pairing system specials*/
var players = [];
var fTwo = false;
var fTh = [0, 0];
var r = 0;
var details = [0, 1, 1, 0];
details[1] = Math.round(Math.random()*2+1);
// Details[0]: position of players, Details[1]: Type of pairing, Details[2]: round No. Details[4]: Board no.
// The first type shall be random and then follow ascending pattern ie 123123123...

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
    document.getElementById('name').select();
}

// The magic...Called by the <Start Rounds> button
function startrounds(){
    console.log(details[1]);
    // Everytime a round starts update the standings
    r = update();
    // Hide the input elements
    document.getElementById('pls').style.visibility = "hidden";

    // Set Rounds for the Tournament
    var rounds = 3;
    if (players.length > 16  && players.length <= 30)
        rounds = 4;
    else if (players.length > 30 && players.length <= 48)
        rounds = 5;
    else if (players.length > 48 && players.length <= 64)
        rounds = 6;
    else if (players.length > 64 && players.length <= 83)
        rounds = 7;
    else if (players.length > 83 && players.length <= 100)
        rounds = 8;
    else
        rounds = 10;
    
    // If the round no. is greater that rounds initialised, Exit program with result;
    if (details[2] > rounds){        
        document.getElementById("current").innerHTML = '';
        for (var i = 0; i < players.length; i++){
            document.getElementById("current").innerHTML += (i+1) + '. ' + players[i].name +'   ' + players[i].score + '/' + rounds +'   ' + players[i].ratingi + '  ->  ' + players[i].rating  + '<br>';
            console.log(players[i]);
        }
        var rel = document.createElement('button');
        rel.innerHTML = 'New Tourney';
        rel.onclick = function() {location.reload();};
        document.getElementById("current").style.visibility = 'visible';
        document.getElementById("current").append(rel);

    }

    // Else Set Board No. and position of players current to nil[starting] and start the pairing Algorithm
    else{
        details[0] = 0;
        details[3] = 0;
        document.getElementById('current').innerHTML = '';     
        r = askResult();
        r = printPairings();
    }
    return 0;
}

// Ugly bubble sort feel free to use anything
function update(){
    for (var x = 0; x < players.length-1; x++){
        for (var y = 0; y < players.length-x-1; y++){            
            if (players[y].score < players[y+1].score)
                r = swap(y, y+1);
            else if (players[y].score == players[y+1].score){
                if (players[y].tiebreaker < players[y+1].tiebreaker)
                    r = swap(y, y+1);
                else if (players[y].tiebreaker == players[y+1].tiebreaker){
                    if (players[y].rating < players[y+1].rating)
                        r = swap(y, y+1);
                    else if (players[y].rating == players[y+1].rating){
                        if (players[y].name > players[y+1].name)
                            r = swap(y, y+1)
                    }
                }
            }
        }
    }
    return 0;
}

// Too many swapping happens in update(); so better to use a function
function swap(x, y){
    var temp = players[x];
    players[x] = players[y];
    players[y] = temp;
    return 0;
}

// Managing result given with the players
function result(pl1, pl2, res){

    // If won or Lost set the winner's score to +1 ie n(current score)+1 tiebreaker + opponents score and calculate Elo change for both of them
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

    // IF draw then +=0.5 to both players half of the other players' score to tiebreaker and Calculate Elo Change
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

// Calculating Elo Change
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
    // Elo Change
    return (10*(r-expect));
}

/* To view all the players entered if you forget or you are Pranath or you are contributing to the site
Might have to change it into a visible element for Mobile Chrome users or if they do not know where the console is */
function viewPlayers(){
    console.clear();
    for (var i = 0; i < players.length; i++)
        console.log(players[i]);
    return 0;
}

// To print the entire list of Pairings on the web page instead of console or ugly pop up (git checkout Ugly-pop-up)
function printPairings(){

    // Give each type three basic variables -> the reminder for their division, the printing position and the board no.
    var rem;
    var pos;
    var b = 0;

    // 1v2 3v4 5v6 ...
    if (details[1] == 1){
        pos = 0;
        rem = players.length % 2;
        for (b = 0; b < (players.length-rem)/2; b++){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[pos].name + ' (' + players[pos].rating + ')' + '  Vs  ' + players[pos+1].name+ ' (' + players[pos+1].rating + ')';
            pos += 2;
        }
        // If there is a person unpaired
        if (rem == 1){
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
    }

    // 3v1 4v2 7v5 8v6...
    else if (details[1] == 2){
        pos = 0;
        rem = players.length % 4;
        for (b = 0; b < (players.length-rem)/2; b++){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[pos+2].name + ' (' + players[pos+2].rating + ')'  + '  Vs  ' + players[pos].name + ' (' + players[pos].rating + ')' ;
            if ((pos+3) % 4 == 0)
                pos += 3;
            else
                pos += 1;
        }

        // One left out
        if (rem == 1){
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
        //Two Left out
        else if (rem == 2)
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-2].name + ' (' + players[players.length-2].rating + ')'  + '  Vs  ' + players[players.length-1].name + ' (' + players[players.length-1].rating + ')' ;
        // Three left out
        else if (rem == 3){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-1].name + ' (' + players[players.length-1].rating + ')'  + '  Vs  ' + players[players.length-3].name + ' (' + players[players.length-3].rating + ')' ;
            document.getElementById("current").innerHTML += '<br>' + players[players.length-2].name + ' Gets Bye';
            players[players.length-2].score += 1;
        }
    }

    // 1v4 2v5 3v6 7v10 8v11 9v12....
    else if (details[1] == 3){
        pos = 0;
        rem = players.length%6;
        for (b = 0; b < (players.length-rem)/2; b++){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[pos].name + ' (' + players[pos].rating + ')'  + '  Vs  ' + players[pos+3].name + ' (' + players[pos+3].rating + ')' ;
            if ((pos+4) % 6 == 0)
                pos += 4;
            else
                pos += 1;
        }
        
        // one left out
        if (rem == 1){
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
        //two left out
        else if (rem == 2)
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-1].name + ' (' + players[players.length-1].rating + ')'  + '  Vs  ' + players[players.length-2].name + ' (' + players[players.length-2].rating + ')' ;
        // Three left out
        else if (rem == 3){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-2].name + ' (' + players[players.length-2].rating + ')'  + '  Vs  ' + players[players.length-3].name + ' (' + players[players.length-3].rating + ')' ;
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
        // Four Left out
        else if (rem == 4){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-2].name + ' (' + players[players.length-2].rating + ')'  + '  Vs  ' + players[players.length-4].name + ' (' + players[players.length-4].rating + ')' ;
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+2) + ': ' + players[players.length-1].name + ' (' + players[players.length-1].rating + ')'  + '  Vs  ' + players[players.length-3].name + ' (' + players[players.length-3].rating + ')';
        }
        // Five Left out
        else if (rem == 5){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-5].name + ' (' + players[players.length-5].rating + ')'  + '  Vs  ' + players[players.length-2].name + ' (' + players[players.length-2].rating + ')';
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+2) + ': ' + players[players.length-4].name + ' (' + players[players.length-4].rating + ')'  + '  Vs  ' + players[players.length-3].name + ' (' + players[players.length-3].rating + ')';
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
    }
    else{
        pos = 0;
        rem = players.length%4;
        for (b = 0; b < (players.length - rem) / 2; b++){
            if (pos % 2 == 0)
                document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[pos+3].name + ' (' + players[pos+3].rating + ')'  + '  Vs  ' + players[pos].name + ' (' + players[pos].rating + ')' ;
            else
                document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[pos+1].name + ' (' + players[pos+1].rating + ')'  + '  Vs  ' + players[pos].name + ' (' + players[pos].rating + ')' ;
            
            // updating Pos
            if ((pos+3) % 4 == 0)
                pos += 3;
            else
                pos += 1;
        }
        
        if (rem == 1){
            document.getElementById("current").innerHTML += '<br>' + players[players.length-1].name + ' Gets Bye';
            players[players.length-1].score += 1;
        }
        else if (rem == 2)
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-2].name + ' (' + players[players.length-2].rating + ')'  + '  Vs  ' + players[players.length-1].name + ' (' + players[players.length-1].rating + ')' ;
        else if (rem == 3){
            document.getElementById("current").innerHTML += '<br>'+ 'Board ' + (b+1) + ': ' + players[players.length-1].name + ' (' + players[players.length-1].rating + ')'  + '  Vs  ' + players[players.length-2].name + ' (' + players[players.length-2].rating + ')' ;
            document.getElementById("current").innerHTML += '<br>' + players[players.length-3].name + ' Gets Bye';
            players[players.length-3].score += 1;
        }
    }
    return 0;
}

// hard as hell maybe not so much after I have finished
// make the buttons to accept input result one at a time 
function askResult(){
    // Set the board no.
    var rem = players.length % 2;
    var boards = (players.length-rem)/2;

    // If all the boards are done GO back to startrounds to invoke another algorithm round or finish the tournament
    if (details[3] >= boards){
        if (details[1] != 4)
            details[1] += 1;
        else 
            details[1] = 1;
        details[2] += 1;
        r = startrounds();
    }

    // If not.. ASK THE RESULT OF THE BOARD THAT HAS NOT BEEN ENTERED STARTING FROM THE TOP
    // This will work as the js will stop running ie return and wait until lIstenEvent
    // When the result is entered and pushed the scores are updated and the navRes() goes to askResult to
    // Ask for the next board result or finish the round and return to startRounds.
    else{
        if (details[1] == 1)
            document.getElementById('matchup').innerHTML = players[details[0]].name + '  Vs  ' + players[details[0]+1].name + '  ';
        else if (details[1] == 2){
            if (players.length % 4 == 2 && (details[3]+1) == boards){
                document.getElementById('matchup').innerHTML = players[players.length-2].name + '  Vs  ' + players[players.length-1].name + '  ';
                fTwo = true;
            }
            else
                document.getElementById('matchup').innerHTML = players[details[0]+2].name + '  Vs  ' + players[details[0]].name + '  ';
        }
        else if (details[1] == 3){
            if (players.length % 6 == 5 && details[3]+1 == boards){
                fTh[0] = 5;
                document.getElementById('matchup').innerHTML = players[players.length-4].name + '  Vs  ' + players[players.length-3].name + '  ';         
            }
            else if (players.length % 6 == 4 && boards - details[3] <= 2){
                fTh[0] = 4;
                fTh[1] += 1;
                if (fTh[1] == 1)
                    document.getElementById('matchup').innerHTML = players[players.length-2].name + '  Vs  ' + players[players.length-4].name + '  ';
                else
                    document.getElementById('matchup').innerHTML = players[players.length-1].name + '  Vs  ' + players[players.length-3].name + '  ';
            }
            else if (players.length % 6 == 3 && details[3]+1 == boards){
                fTh[0] = 3;
                document.getElementById('matchup').innerHTML = players[players.length-2].name + '  Vs  ' + players[players.length-3].name + '  ';
            }
            else if (players.length % 6 == 2 && details[3]+1 == boards){
                fTh[0] = 2;
                document.getElementById('matchup').innerHTML = players[players.length-1].name + '  Vs  ' + players[players.length-2].name + '  ';
            }
            else
                document.getElementById('matchup').innerHTML = players[details[0]].name + '  Vs  ' + players[details[0]+3].name + '  ';
        }
        else{

        }
    }
    return 0;
}

// Get the result to the result function and updates player pos and board no. go back to askresult for next pairing result
function navRes(){
    if (details[1] == 1){
        r = result(details[0], details[0]+1, document.getElementById('resultBox').value);
        details[0] += 2;
    }
    else if (details[1] == 2){
        // If special Case of -2 v -1 ... (original would be -3 v -1)
        if (fTwo){
            r = result(players.length-2, players.length-1, document.getElementById('resultBox').value);
            fTwo = false;
        }
        else{
            r = result(details[0]+2, details[0], document.getElementById('resultBox').value);
            if ((details[0]+3)%4 == 0)
                details[0] += 3;
            else
                details[0] += 1;
        }
    }
    else if (details[1] == 3){
        // Tons of Special Cases best to contact me to know what they are as it takes forever to explain stuff like this
        if (fTh[0] == 5)
            r = result(players.length-4, players.length-3, document.getElementById('resultBox').value);
        else if (fTh[0] == 4){
            if (fTh[1] == 1)
                r = result(players.length-2, players.length-4, document.getElementById('resultBox').value);
            else{
                r = result(players.length-1, players.length-3, document.getElementById('resultBox').value);
                fTh[1] = 0;
            }
        }
        else if(fTh[0] == 3)
            r = result(players.length-2, players.length-3, document.getElementById('resultBox').value);
        else if (fTh[0] == 2)
            r = result(players.length-1, players.length-2, document.getElementById('resultBox').value);
        else{
            r = result(details[0], details[0]+3, document.getElementById('resultBox').value);
            if ((details[0]+4) % 6 == 0)
                details[0] += 4;
            else
                details[0] += 1;
        }
        fTh[0] = 0;
    }
    else{

    }
    // Set Result Box Value ie the box content to nil for new input
    // Update Board No.
    // Go back to ask result.
    document.getElementById('resultBox').value = '';
    details[3] += 1;
    r = askResult();
    return 0;
}

// The Algorithm of asking and waiting happens via 2 recurring functions

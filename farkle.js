/**
 * Description
 * @authors Your Name (you@example.org)
 * @date    2021-06-25 09:33:06
 * @version 1.0.0
 */



// VARIABLES
p1Total = 0;
p2Total = 0;
p1Round = 0;
p2Round = 0;
p1Selected = 0;
p2Selected = 0;
activeHand = [0, 0, 0, 0, 0, 0];
selectedDie = [false, false, false, false, false, false];
bankedDie = [false, false, false, false, false, false];
turn = "p2";
winScore = 2000;
gameMode = "none";
roll();

// FUNCTIONS

// updates data structure with random values 
// for non-selected non-banked dice
function roll() {
    // console.log("activeHand: " + activeHand);
    // console.log("selectedDie: " + selectedDie);

    // get new value for valid die & build bustcheck
    let bustCheckHand = [];
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == false && bankedDie[i] == false) {
            activeHand[i] = getDie(i);
            bustCheckHand.push(activeHand[i]);
        }
    }

    updateView();
    rotateDie();
    if (bustCheckHand.length > 0) {
        // check for bust; else continue play
        bustCheck(bustCheckHand);
    } else {
        // play again if all used successfully
        updateStatus("Play again!");
        setTimeout(function() {
            resetActiveHand();
            //updateStatus(turn);
        }, 3000);
    }
}

function resetActiveHand() {
    console.log("resetActiveHand called");
    dice = document.getElementsByClassName("die");
    for (let i = 0; i < 6; i++) {
        activeHand[i] = 0;
        selectedDie[i] = false;
        bankedDie[i] = false;
        dice[i].classList.remove("banked", "selected");
        dice[i].classList.add("notSelected");
    }
    roll();
}

function updateStatus(message) {
    document.getElementById("statusmsg").innerHTML = message;
    $("#status").show();
    setTimeout(function() { $("#status").hide() }, 1000);
}

// checks passed hand for bust condition
// and updates game status
function bustCheck(bustCheckHand) {
    score = getScore(bustCheckHand);
    if (0 == score) {
        updateStatus("Bust!");
        if (turn == "p1") {
            p1Round = 0;
            p1Selected = 0;
        } else {
            p2Round = 0;
            p2Selected = 0;
        }
        updateView();
        setTimeout(function() {
            resetActiveHand();
            progressTurn();
        }, 1500);
    }

}

function rotateDie() {
    dice = document.getElementsByClassName("die");
    for (let i = 0; i < 6; i++) {
        if (dice[i].classList.contains("notSelected")) {
            angle = Math.round((Math.random() * 1000) % 360);
            $(dice[i].childNodes[0]).css("transform", "rotate(" + angle + "deg)");
            console.log(dice[i].childNodes[0]);
        }
    }

}

// updates webpage with data structure values
function updateView() {
    // console.log("update View called");

    // updates webpage with dice information
    let activeDice = document.getElementsByClassName("die");
    // for (let i = 0; i < activeDice.length; i++) {
    //     $(activeDice[i]).hide();
    // }

    for (let i = 0; i < activeDice.length; i++) {
        if (activeDice[i].childNodes[0]) {
            activeDice[i].removeChild(activeDice[i].childNodes[0]);
        }

        let diceValue = document.createElement("i");
        diceValue.classList.add("fas");
        switch (activeHand[i]) {
            case 1:
                diceValue.classList.add("fa-dice-one");
                break;
            case 2:
                diceValue.classList.add("fa-dice-two");
                break;
            case 3:
                diceValue.classList.add("fa-dice-three");
                break;
            case 4:
                diceValue.classList.add("fa-dice-four");
                break;
            case 5:
                diceValue.classList.add("fa-dice-five");
                break;
            case 6:
                diceValue.classList.add("fa-dice-six");
                break;
        }
        diceValue.classList.add("fa-stack-1x");
        activeDice[i].appendChild(diceValue);
    }
    rotateDie();
    // for (let i = 0; i < activeDice.length; i++) {
    //     let time = 1000 + (i * 100);
    //     setTimeout(function() { $(activeDice[i]).show() }, time);
    // }

    updateScoreBoard();

};

// Returns a random value between 1 and 6
function getDie(position) {
    let numb = Math.random();
    let rand = (numb * 10) % 5;
    rand = Math.round(rand) + 1;
    return rand;
};

// Returns score of hand passed to it
// called when a die is clicked
function getScore(passedHand) {

    // deep copy passed hand
    let inputHand = JSON.parse(JSON.stringify(passedHand));
    let dieCount = [0, 0, 0, 0, 0, 0];
    let score = 0;

    for (let i = 0; i < inputHand.length; i++) { // traverse die values
        for (let j = 0; j < 6; j++) { // traverse counter values
            if (inputHand[i] == (j + 1)) { dieCount[j]++; }
            //break;
        }
    }
    // console.log("dieCount: " + dieCount);

    // full straight
    if (inputHand.length == 6) {
        for (let i = 0; i < 6; i++) {
            if (dieCount[i] != 1) { break }
            if (i == 5) {
                //disableRollOnNonScore(dieCount);
                score = 1500;
                return score;
            }
        }
    }

    // partial straights
    if (inputHand.length >= 5) {
        // partial straight 1-5
        for (let i = 0; i < 4; i++) {
            if (dieCount[i] < 1) { break };
            if (i == 4) { score += 500 };
        }
        // partial straight 2-6
        for (let i = 1; i < 6; i++) {
            if (dieCount[i] < 1) { break };
            if (i == 5) { score += 750 };
        }
    }

    // // 3 pairs
    // var pairCount = 0;
    // for (let i = 0; i < dieCount.length; i++) {
    //     if (dieCount[i] == 2) { pairCount++; }
    // }
    // if (pairCount == 3) {
    //     // console.log("3 pairs")
    //     score = 1500;
    //     return score;
    // }

    for (let i = 0; i < dieCount.length; i++) {

        // more than three of a kind
        if (dieCount[i] >= 3) {
            // for 1s
            if (i == 0) {
                let subScore = 1000;
                dieCount[i] -= 3;
                while (dieCount[i] > 0) {
                    subScore *= 2;
                    dieCount[i] -= 1;
                }
                score += subScore;
            }
            // for 2-6
            else {
                let subScore = ((i + 1) * 100);
                dieCount[i] -= 3;
                while (dieCount[i] > 0) {
                    subScore *= 2;
                    dieCount[i] -= 1;
                }
                score += subScore;
            }
        }

        // single ones
        else if (i == (1 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 100);
            dieCount[i] = 0;
        }
        //single fives
        else if (i == (5 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 50);
            dieCount[i] = 0;
        }
    }
    disableRollOnNonScore(dieCount, score);
    // console.log("score: " + score);
    // console.log(dieCount);
    return score;
}

// Disable roll options if non-scoring die are selected
// PROBELEMO: 0 is used to signify all die counted AND ALSO no scoring die
// this wont detect situation where all die selected and all are scoring
function disableRollOnNonScore(dieCount, score) {

    let nonScoreDie = 0;
    for (let i = 0; i < 6; i++) {
        if (dieCount[i] != 0) {
            nonScoreDie++;
        }
    }
    //is player has selected non-scoring die
    if (nonScoreDie > 0) {
        $("#scoreRoll").addClass("disabled");
        $("#scorePass").addClass("disabled");
    } else {
        $("#scoreRoll").removeClass("disabled");
        $("#scorePass").removeClass("disabled");
    }
}

// returns score of selected die only
function getSelectedScore() {
    selectedHand = [];
    // get only selected values
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == true && bankedDie[i] == false) {
            selectedHand[i] = activeHand[i];
        }
    }
    return getScore(selectedHand);
}

// updates html with score variables
function updateScoreBoard() {
    document.getElementById("p1Total").innerHTML = p1Total;
    document.getElementById("p1Round").innerHTML = p1Round;
    document.getElementById("p1Selected").innerHTML = p1Selected;
    document.getElementById("p2Total").innerHTML = p2Total;
    document.getElementById("p2Round").innerHTML = p2Round;
    document.getElementById("p2Selected").innerHTML = p2Selected;
    winCheck();
}

function winCheck() {
    if (p1Total >= winScore) { alert("Player 1 wins") }
    if (p2Total >= winScore) { alert("Player 2 wins") }
    //reset game state

}


function progressTurn() {
    if (turn == "p1") {
        turn = "p2";
        updateStatus("Player 2");
        $("#p1name").removeClass("simple-highlight");
        $("#p2name").addClass("simple-highlight");
    } else {
        turn = "p1"
        updateStatus("Player 1");
        $("#p1name").addClass("simple-highlight");
        $("#p2name").removeClass("simple-highlight");
    }
    resetActiveHand();
}


function startGame(mode) {

    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("boardContainer").style.display = "block";
    $(".die").toggle();

    if (mode == "pvc") {
        updateStatus("player vs computer")
    } else if (mode == "pvp") {
        updateStatus("player vs player")
        console.log("pvc")
    }
    //start the game
    setTimeout(function() { updateStatus("Lets Play!"); }, 2000);
    setTimeout(function() { progressTurn(); }, 4000);
    setTimeout(function() { $(".die").toggle(); }, 6000);

}

// run game
$(document).ready(function() {

    //title screen start buttons
    $("#pvc").click(function() { startGame("pvc") });
    $("#pvp").click(function() { startGame("pvp") });

    // quit button
    // dummy position now for reset hand
    $("#quit").click(function() {
        resetActiveHand();
    });

    // listener for scoreRoll button/method
    // can assume that only scoring dice have been selected
    $("#scoreRoll").click(function() {
        dice = document.getElementsByClassName("die");
        for (let i = 0; i < 6; i++) {
            if (selectedDie[i] == true) {
                bankedDie[i] = true;
                // update html display to show banked
                dice[i].classList.remove("selected");
                dice[i].classList.add("banked");
            }
        }
        // console.log("banked: " + bankedDie);
        // update scoreboard
        if (turn == "p1") {
            p1Round += p1Selected;
            p1Selected = 0;
        } else {
            p2Round += p2Selected;
            p2Selected = 0;
        }
        updateScoreBoard();
        // call to reroll unselected die
        roll();

    });

    $("#scorePass").click(function() {
        dice = document.getElementsByClassName("die");
        for (let i = 0; i < 6; i++) {
            if (selectedDie[i] == true) {
                bankedDie[i] = true;
                // update html display to show banked
                dice[i].classList.remove("selected");
                dice[i].classList.add("banked");
            }
        }
        if (turn == "p1") {
            p1Total += p1Round;
            p1Total += p1Selected;
            p1Round = 0;
            p1Selected = 0;
        } else {
            p2Total += p2Round;
            p2Total += p2Selected;
            p2Round = 0;
            p2Selected = 0;
        }
        updateScoreBoard();
        // next turn

        progressTurn();


    });


    // click on a die
    $(".die").click(function() {
        // check die not banked
        if ((this).classList.contains("banked")) {
            return
        }

        // update class of clicked die
        (this).classList.toggle("selected");
        (this).classList.toggle("notSelected");

        //overlay selected icon
        // circle = document.createElement("i");
        // circle.classList.add("far", "fa-circle", "fa-stack-3x");
        // $(circle).css("color", "Orange");
        // (this).appendChild(circle);

        // update data structure of selected Die
        let dice = document.getElementsByClassName("die");
        let pos = jQuery.inArray((this), dice);
        // console.log("this pos = " + pos);
        selectedDie[pos] = !selectedDie[pos];
        // console.log("selectedDie[pos]: " + selectedDie[pos]);

        //update selected menu value
        if (turn == "p1") { p1Selected = getSelectedScore(); } else { p2Selected = getSelectedScore(); }
        updateScoreBoard();

    });

});


//MISCELLANEOUS TESTS

// tests score function
function testScore(testHand) {
    let thisHand = testHand;
    let thisScore = getScore(thisHand);
    // console.log("thisScore: " + thisScore);
    alert(thisScore);
}

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

function clickTest() {
    alert("clicked");
}
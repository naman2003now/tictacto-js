// linking service worker
if ("serviceWorker" in navigator) {
    // register service worker
    navigator.serviceWorker.register("sw.js")
    .then(reg => {
        console.log("registered: ", reg);
    }).catch(err => {
        console.log("registration failed: ", err);
    });
}


const boxes = document.querySelectorAll(".space");
const P_X = "X";
const P_O = "O";
var count=0;
var flag=0;
let turn = P_X;
let turnText = `Player ${turn}, make your move`;
document.querySelector('.playerturn').innerText = turnText;

const boardPos = Array(boxes.length);
boardPos.fill(null); //setting it up to Null in the beginning

// gathering elements from HTML
const winstrike = document.getElementById("strike");
const gameOverSection = document.getElementById("winner");
const gameOverText = document.getElementById("winner-text");
const playAgain = document.getElementById("restart");

// restart game
playAgain.addEventListener("click", restartGame);


let positions = [
    {key : 10},
    {key : 11},
    {key : 20},
    {key : 21},
    {key : 30},
    {key : 31},
    {key : 40},
    {key : 41},
    {key : 50},
    {key : 51}
];

// hovering over boxes
function hoverBox() {
    
    // erasing previously added hover texts
    boxes.forEach((box) => {
        box.classList.remove("X-hover");
        box.classList.remove("O-hover");
    });

    // setting current player's turn
    const hoverTurn = `${turn}-hover`;

    boxes.forEach((box) => {
        if(box.innerText=="") {
            box.classList.add(hoverTurn);
        }
    })
}

// function that saves the grid at this moment
function saveSnapGrid(MoveBoxNo , currentBoardPos) {
    for (var each_snap of positions) {
        const boxindex = each_snap.key;
        if (boxindex == MoveBoxNo) {
            // console.log('saving positions');
            each_snap.positions = currentBoardPos;
            // console.log("current position saving: ");
            // console.log(currentBoardPos);
        }
    }
    
}


// function that saves data snap of gameplay
function saveSnap(boxNo , currentPlayer) {
    count+=1;
    // console.log(boxNo);
    // console.log(currentPlayer.toLowerCase());
    const noting_position = document.querySelectorAll("."+currentPlayer.toLowerCase());
    // console.log(noting_position);
    for (var c of noting_position) {
        if(c.innerText=='') {
            // console.log(c);
            const currentBoardPos = boardPos.slice(0);
            // console.log(currentBoardPos);
            const MoveBoxNo = c.dataset.index;
            saveSnapGrid(MoveBoxNo , currentBoardPos);
            c.classList.remove("hidden-half");
            // c.innerText = 'move '+count+'\nbox '+boxNo;
            c.innerHTML = "<section class='miniboard'>" + document.getElementById("board").innerHTML.replaceAll('space' , 'newspace').replaceAll('O-hover', '').replaceAll('X-hover' , '').replaceAll("strike", "something")+"</section>";
            c.addEventListener("click" , displayGrid);
            return;
        }
    }
}

function addScore(decided_winner) {
    // console.log("from addScore function- winner: "+decided_winner);
    if(decided_winner===null) {
        const for_player_x = document.querySelector(".score-x");
        const for_player_o = document.querySelector(".score-o");
        
        var new_score_x = parseInt(for_player_x.innerHTML)+50;
        var new_score_o = parseInt(for_player_o.innerHTML)+50;
        for_player_x.innerHTML = new_score_x;
        for_player_o.innerHTML = new_score_o;
        flag+=1;
        // console.log("flag now: "+flag);

    } else {
        const for_player = document.querySelector(".score-"+decided_winner);
        var new_score = parseInt(for_player.innerHTML)+100;
        for_player.innerHTML = new_score;
        flag+=1;
        // console.log("flag now: "+flag);
    }

}




function displayGrid(event) {
    if(gameOverSection.classList.contains("visible")) {
        for (var each_snap of positions) {
            const boxnum = each_snap.key;
            const currentPos = each_snap.positions;
            if (boxnum == event.target.dataset.index) {
                // now we need to rearrange the grid as per this position array!
                // console.log("set this position:");
                // console.log(currentPos);

                document.querySelector(".strike").classList.add("hidden");

                var grid = document.querySelectorAll(".space");
                for (var i=0; i<currentPos.length; i++) {
                    grid[i].innerText = currentPos[i];
                }
                
                
            }
        }

    }   

    

    
}


// clicking boxes
function clickBox(event) {
    if(gameOverSection.classList.contains("visible")) {
        return;
    }
    
    const box = event.target;
    const boxNo = box.dataset.index;
    if(box.innerHTML!='') {
        return;
    }


    if(turn==P_X) {
        box.innerText = (P_X);
        boardPos[boxNo - 1] = P_X;
        turn = P_O;
        turnText = `Player ${turn}, make your move`;
        document.querySelector('.playerturn').innerText = turnText;
    } else {
        box.innerText = (P_O);
        boardPos[boxNo - 1] = P_O;
        turn = P_X;
        turnText = `Player ${turn}, make your move`;
        document.querySelector('.playerturn').innerText = turnText;

    }
    hoverBox();
    checkWin();
    saveSnap(boxNo , turn);
}

function gameOver(winner) {
    
    if(winner!=null) {
        // Displaying winner text
        gameOverText.innerText = `${winner} has won!`;
        gameOverSection.classList.remove("hidden");
        gameOverSection.classList.add("visible");


        // Updating scoreboard
        if(flag===0) {
            addScore(winner.toLowerCase());
        }
        


    } else {
        // Displaying winner text
        gameOverText.innerText = 'Its a draw!';
        gameOverSection.classList.remove("hidden");
        gameOverSection.classList.add("visible");

        // Updating scoreboard
        if(flag===0) {
            addScore(winner);
        }
        
    }
    
}

const winning_combos = [
    //rows
    {cells : [1,2,3], strikeClass : "strike-row-1"},
    {cells : [4,5,6], strikeClass : "strike-row-2"},
    {cells : [7,8,9], strikeClass : "strike-row-3"},
    
    //columns
    {cells : [1,4,7], strikeClass : "strike-col-1"},
    {cells : [2,5,8], strikeClass : "strike-col-2"},
    {cells : [3,6,9], strikeClass : "strike-col-3"},
   
    //diagonals
    {cells : [1,5,9], strikeClass : "strike-dia-2"},
    {cells : [3,5,7], strikeClass : "strike-dia-1"},

];


function checkWin() {
    
    for (each_combo of winning_combos) {
        const cellcombo = each_combo.cells;     // the list that contains winning combinations
        const strikeClass = each_combo.strikeClass;     // 
        
        // check for winning combination
        const boxval1 = boardPos[cellcombo[0] - 1];
        const boxval2 = boardPos[cellcombo[1] - 1];
        const boxval3 = boardPos[cellcombo[2] - 1];

        if(boxval1!=null && boxval1 === boxval2 && boxval2 === boxval3) {
            winstrike.classList.add(strikeClass);
            gameOver(boxval1);
            break;
        }


        // check if draw
        const allFilled = boardPos.every((tile)=>tile!=null);
        if(allFilled) {
            gameOver(null);
        }

    }
}

function restartGame() {
    // console.log("in restart game function ");
    flag=0;
    count=0;
    winstrike.className = "strike";
    gameOverSection.classList.remove("visible");
    gameOverSection.classList.add("hidden");
    boxes.forEach((box)=>box.innerHTML=null);
    boardPos.fill(null);

    for (var each_snap of positions) {
        each_snap.positions = boardPos;
    }

    const moves_table_o = document.querySelectorAll(".o");
    for (var c of moves_table_o) {
        c.innerHTML=null;
        c.classList.add("hidden-half");
    }
    const moves_table_x = document.querySelectorAll(".x");
    for (var c of moves_table_x) {
        c.innerHTML=null;
        c.classList.add("hidden-half");
    }

    turn = P_X;
    turnText = `Player ${turn}, make your move`;
    document.querySelector('.playerturn').innerText = turnText;
}


for (var i=0; i<boardPos.length; i++) {
    boxes[i].addEventListener("click" , clickBox);
}





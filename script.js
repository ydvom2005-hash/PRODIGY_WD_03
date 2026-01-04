let board = ["","","","","","","","",""];
let current = "X";
let mode = "two";
let level = "easy";
let active = true;

const cells = document.getElementsByClassName("cell");
const status = document.getElementById("status");

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function play(i){
  if(!active || board[i]) return;

  move(i, current);

  if(active && mode==="computer" && current==="O"){
    setTimeout(()=>move(computerMove(),"O"),300);
  }
}

function move(i,p){
  board[i]=p;
  cells[i].innerText=p;

  if(check(p)){
    status.innerText=p+" Wins";
    active=false;
    return;
  }

  if(!board.includes("")){
    status.innerText="Draw";
    active=false;
    return;
  }

  current=p==="X"?"O":"X";
  status.innerText=current+"'s Turn";
}

function computerMove(){
  if(level==="easy") return randomMove();
  if(level==="medium") return winBlock("O") ?? winBlock("X") ?? randomMove();
  return minimax(board,"O").i;
}

function randomMove(){
  let e=board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return e[Math.floor(Math.random()*e.length)];
}

function winBlock(p){
  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]=p;
      if(check(p)){ board[i]=""; return i; }
      board[i]="";
    }
  }
}

function minimax(b,p){
  let e=b.map((v,i)=>v===""?i:null).filter(v=>v!==null);

  if(checkBoard(b,"X")) return {score:-10};
  if(checkBoard(b,"O")) return {score:10};
  if(e.length===0) return {score:0};

  let m=[];
  for(let i of e){
    let o={i};
    b[i]=p;
    o.score=minimax(b,p==="O"?"X":"O").score;
    b[i]="";
    m.push(o);
  }

  return p==="O"
    ? m.reduce((a,b)=>b.score>a.score?b:a)
    : m.reduce((a,b)=>b.score<a.score?b:a);
}

function check(p){
  return wins.some(w=>w.every(i=>board[i]===p));
}

function checkBoard(b,p){
  return wins.some(w=>w.every(i=>b[i]===p));
}

function setTwoPlayer(){
  mode="two";
  reset();
}

function setComputer(){
  mode="computer";
  reset();
}

function setLevel(l){
  level=l;
  if(mode==="computer") status.innerText="Computer "+l.toUpperCase();
}

function reset(){
  board=["","","","","","","","",""];
  [...cells].forEach(c=>c.innerText="");
  current="X";
  active=true;
  status.innerText=mode==="computer"
    ? "Computer "+level.toUpperCase()
    : "X's Turn";
}
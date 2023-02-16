"use strict";

import { game, listPieces, resetGame } from "./script.js";
import { Peon, Torre, Alfil, Caballo, Rey, Reina } from "./clases.js";

// ***************** Constants and Variables ********* 
const turnColor = document.getElementById("turnoColor");

let piecesClass = {Torre, Caballo, Alfil, Reina, Rey, Peon};


// ***************** Functions ********* 


export function getPieceByPosition(position) {
  let piece = listPieces.find((piece) => piece.position === position);
  if (piece) return piece;
  return null;
}

export function markPossibles(posibles) {
  posibles.forEach((position) => {
    document
      .querySelector(`[data-id=${position}]`)
      .classList.add("posible-cuadro");
  });
}

export function quitPossibles() {
  document
    .querySelectorAll(".posible-cuadro")
    .forEach((posible) => posible.classList.remove("posible-cuadro"));
}

export function setTheme(e) {
  let options = {
    Azul: ["rgb(176 233 255)", "rgb(32 126 163)", "rgb(110, 11, 11)"],
    Verde: ["rgb(203 230 222)", "rgb(69 136 127)", "rgb(110, 11, 11)"],
    Rojo: ["rgb(255 234 234)", "rgb(199 84 84)", "rgb(11 73 110)"],
    Marron: ["rgb(255 238 219)", "rgb(169 116 79)", "rgb(11 73 110)"],
    Morado: ["rgb(248 233 255)", "rgb(117 94 171)", "rgb(11 73 110)"],
    Clasico: ["rgb(255 255 255)", "rgb(137 137 137)", "rgb(110, 11, 11)"],
  };

  document.documentElement.style.setProperty(
    "--ligth-color",
    options[e.target.value][0]
  );
  document.documentElement.style.setProperty(
    "--dark-color",
    options[e.target.value][1]
  );

  document.documentElement.style.setProperty(
    "--color-posible",
    options[e.target.value][2]
  );
}

// validate if the turn is correct
export function validateTurn(piece) {
  if (piece.isWhite === game.whiteTurn) return true;
  return false;
}

// clean a invalid action, quit the up pieze and remove the optional squares
export function cleanUpPieze() {
  let active = document.querySelector(".up-pieze");
  if (active) active.classList.remove("up-pieze");
  quitPossibles();
  game.upPiece = null;
}

// change the turn
export function changeTurn() {
  game.whiteTurn = game.whiteTurn ? false : true;
  fixSetIndicator();
}

// fix the turn color
export function fixSetIndicator() {
  let color = game.whiteTurn ? "--ligth-color" : "--dark-color";
  turnColor.style.setProperty("--turno-color", `var(${color})`);
}

export function validWinner(){
  let counter=0;
  let whiteTurn = game.whiteTurn;
  let win = true;

  for(let piece of listPieces){
    if(!win) break;
    
    if(whiteTurn !== piece.isWhite) continue;
    let posibles = piece.getValidPossibles();
    if(posibles.length === 0) counter++;
    if(posibles.length > 0) win = false;
  }

  if(win){
    let winners = whiteTurn? "Negras": "blancas"
    let reset = confirm(`Jaque Mate, ${winners} Ganan \n ¿Desea volver a iniciar?`);

    if(reset) return resetGame();
  }
}

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
    Rojo: ["rgb(255 234 234)", "rgb(181 62 62)", "rgb(11 73 110)"],
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
  let whiteTurn = game.whiteTurn;
  let win = true;

  for(let piece of listPieces){
    // if(!win) break;
    
    if(whiteTurn !== piece.isWhite) continue;
    let posibles = piece.getValidPossibles();
    if(posibles.length > 0) win = false;
  }

  if(win){
    let winners = whiteTurn? "Negras": "blancas";
    if(!document.querySelector(".jaque")) return showInfo(`No hay movimientos posibles la partida termina en <b>Tablas</b> o empate`, "Tablas");

    return showInfo(`Las ${winners} han dado <b>Jaque Mate</b> y han Ganado la partida`, "Jaque Mate");
  }
}

export function closeModal(){
  document.querySelectorAll(".modal-active").forEach(modal =>{
    if(modal.id === "modalCoronacion") document.forms.Coronar.requestSubmit();
    modal.classList.remove("modal-active");
  })
}

export function showModal(name){
  let modal = document.getElementById(name);
  if(!modal) return console.log('no se encontro modal', e.target);

  modal.classList.add("modal-active")
}

export function addSavedGame(games){
  let list = document.querySelector(".modal .list");
  if(!list) console.log("no se encontro la lista");

  let fragment = document.createDocumentFragment();
  games.forEach(game =>{
    let item = document.createElement("article");
    let name = document.createElement("span");
    let btnContainer = document.createElement("span");
    let btn = document.createElement("button");
    let btnRemove = document.createElement("button");

    item.classList.add("list-item");
    name.classList.add("list-item-name");
    btnContainer.classList.add("list-item-btn-container");
    btn.classList.add("btn", "list-item-btn-load");
    btnRemove.classList.add("btn", "btn-danger", "list-item-btn-remove");

    name.textContent = game.name;
    btn.textContent = "Cargar";
    btnRemove.textContent = "Eliminar";
    btn.dataset.name = game.name;
    btnRemove.dataset.name = game.name;

    btnContainer.appendChild(btnRemove);
    btnContainer.appendChild(btn);

    item.appendChild(name);
    item.appendChild(btnContainer);
    fragment.appendChild(item);
  });

  list.appendChild(fragment);
}

export function showInfo(message, title="Información"){
  let information = document.querySelector("#modalInformation .modal-information");
  let titleNode = document.querySelector("#modalInformation .modal-title");
  if(!information || !titleNode) console.log("no se encontro modal information");

  titleNode.innerHTML = title;

  information.innerHTML = message;
  closeModal();
  showModal("modalInformation");
}
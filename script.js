"use strict";

import * as helpers from "./helpers.js";
import { Peon, Torre, Alfil, Caballo, Rey, Reina } from "./clases.js";
// ************************* Variables & constants ****************

const saveGameBtn = document.getElementById("saveGame");
const resetBtn = document.getElementById("reset");
const colorInput = document.getElementById("colorInput");
const loadBtn = document.getElementById("cargar");
export let table = document.getElementById("tablero");

// ************************* Game Variables ****************
let piecesClass = {Torre, Caballo, Alfil, Reina, Rey, Peon};
export let initialPieces = [
  new Torre(table, true, "A1"),
  new Caballo(table, true, "B1"),
  new Alfil(table, true, "C1"),
  new Reina(table, true, "D1"),
  new Rey(table, true, "E1"),
  new Alfil(table, true, "F1"),
  new Caballo(table, true, "G1"),
  new Torre(table, true, "H1"),

  new Peon(table, true, "A2"),
  new Peon(table, true, "B2"),
  new Peon(table, true, "C2"),
  new Peon(table, true, "D2"),
  new Peon(table, true, "E2"),
  new Peon(table, true, "F2"),
  new Peon(table, true, "G2"),
  new Peon(table, true, "H2"),

  new Peon(table, false, "A7"),
  new Peon(table, false, "B7"),
  new Peon(table, false, "C7"),
  new Peon(table, false, "D7"),
  new Peon(table, false, "E7"),
  new Peon(table, false, "F7"),
  new Peon(table, false, "G7"),
  new Peon(table, false, "H7"),

  new Torre(table, false, "A8"),
  new Caballo(table, false, "B8"),
  new Alfil(table, false, "C8"),
  new Reina(table, false, "D8"),
  new Rey(table, false, "E8"),
  new Alfil(table, false, "F8"),
  new Caballo(table, false, "G8"),
  new Torre(table, false, "H8"),
];
export let game = {
  whiteTurn: true,
  upPiece: null,
  jaque: {
    rey: []
    },
};

export let listPieces = [];

// ************************* Functions ****************

// set the up piece an show choose scuares
function toUpPiece(piece) {
  if (!helpers.validateTurn(piece)) return helpers.cleanUpPieze();

  piece.node.classList.add("up-pieze");
  // let posibles = piece.getPossibles();
  let posibles = piece.getValidPossibles();
  game.upPiece = piece;
  helpers.markPossibles(posibles);
}


export function resetGame() {
  listPieces.forEach(piece => piece.node.remove());
  listPieces = Array.from(initialPieces).map(piece => new piecesClass[piece.name](table, piece.isWhite, piece.position));
  helpers.cleanUpPieze();
  game.whiteTurn = true;
  game.upPiece = null;
  game.jaque = {rey: []};
  helpers.fixSetIndicator();

  return renderPieces(listPieces);
}
// handle when pulse a piece
function pulsePiece(pieceNode) {
  let position = pieceNode.parentElement.dataset.id;
  let piece = helpers.getPieceByPosition(position);

  // en caso de no encontrar ficha
  if (!piece) return helpers.cleanUpPieze();

  // levantar ficha para mostrar opciones
  if (game.upPiece === null) return toUpPiece(piece);

  // si intenta mover a un cuadro no permitido
  if (!piece.node.parentElement.classList.contains("posible-cuadro")) {
    return helpers.cleanUpPieze();
  }

  // si intenta tomar una ficha diferente
  game.upPiece.kill(piece);
  helpers.changeTurn();
  helpers.validWinner();
}

// handle when pulse a possible empthy square
function pulseEmpthyPossibleSquare(cuadro) {
  // mover pieza
  let position = cuadro.dataset.id;
  let piece = helpers.getPieceByPosition(position)
  // if (piece) movePiece(game.upPiece, position);
  if(!piece) {
    game.upPiece.move(position);
    helpers.changeTurn();
    helpers.validWinner();
  }

  // no upPieze, no ficha
  return helpers.cleanUpPieze();
}

// handle when pulse a impossible empty square
function pulseEmpthyImpossibleSquare(square) {
  if (game.upPiece !== null) {
    helpers.cleanUpPieze();
  }
}

// render all list pieces in table
function renderPieces(pieces) {
  listPieces.forEach(piece => piece.node.remove());
  pieces.forEach((piece) => {
    let place = document.querySelector(`[data-id="${piece.position}"]`);
    let element = piece.node;

    place.appendChild(element);
  });
}

function removeGame(name){
  let games = localStorage.getItem("Games");
  let listGames;
  if (games) listGames = JSON.parse(games);
  else listGames = [];

  let gameRemove = listGames.findIndex(game => game.name === name);
  if(gameRemove < 0) return helpers.showInfo(`No se encontro partida <b>${game}</b>`, "Error al remover partida");

  listGames.splice(gameRemove, 1);
  localStorage.setItem("Games", JSON.stringify(listGames));

  let btn = document.querySelector(`[data-name=${name}]`);
  if(!btn) return helpers.showInfo(`No se encontro en la lista la partida <b>${game}</b>`, "Advertencia al remover partida");

  btn.parentElement.parentElement.remove();
}

function saveGame(name) {
  let objectGame = {
    name: name,
    game,
    pieces: listPieces.map(piece => {
      let obj = {
        name: piece.name,
        isWhite: piece.isWhite,
        position: piece.position
      }
      if(piece.name ==="Rey" || piece.name === "Torre") obj.canEnroque = piece.canEnroque;
      if(piece.name ==="Peon") obj.dobleJump = piece.dobleJump;
      return obj;
    }),
  };

  let listGames = JSON.parse(localStorage.getItem("Games"));
  if (!listGames) {
    localStorage.setItem("Games", JSON.stringify([]))
    listGames = [];
  };

  // validadate games with same name
  let sameNameGame = listGames.findIndex((game) => game.name === name);

  if(sameNameGame > -1) listGames.splice(sameNameGame, 1)
  listGames.push(objectGame);
  localStorage.setItem("Games", JSON.stringify(listGames));
  
  if(sameNameGame === -1) helpers.addSavedGame([objectGame]);
  localStorage.setItem("Games", JSON.stringify(listGames));
  resetGame();
  helpers.closeModal();
}

function loadGame(name) {
  helpers.cleanUpPieze();
  let games = localStorage.getItem("Games");
  let listGames;
  if (games) listGames = JSON.parse(games);
  else return helpers.showInfo("aún no hay partidas guardadas");

  let loadGame = listGames.find((game) => game.name === name);

  if (!loadGame) return helpers.showInfo(`No se encontro la partida <b>${name}</b>`, "No encontrado");

  game = loadGame.game;
  listPieces.forEach(piece => piece.node.remove());
  listPieces = loadGame.pieces.map(
    (piece) =>{
      let obj = new piecesClass[piece.name](table, piece.isWhite, piece.position)
      if(obj.name === "Rey" || obj.name==="Torre") obj.canEnroque = piece.canEnroque;
      if(obj.name === "Peon") obj.dobleJump = piece.dobleJump;
      return obj;
    });

  helpers.fixSetIndicator();
  return renderPieces(listPieces);
}

  // ************************* DOM Events ****************

  document.addEventListener("click", (e) => {
    // square with piece
    if (e.target.matches(".juego-ficha")) pulsePiece(e.target);

    //  possible square whithout piece
    if (e.target.matches(".posible-cuadro")) pulseEmpthyPossibleSquare(e.target);

    // not possible square without piece
    if (e.target.matches(".juego-cuadro")) pulseEmpthyImpossibleSquare();

    if (e.target === resetBtn) resetGame();

    if(e.target.matches(".modal-close")){
      if(e.target.parentElement.parentElement.id === "modalCoronacion") {
        document.forms.Coronar.requestSubmit();
      }
      helpers.closeModal();
    }

    if(e.target.matches("[data-modal]")){
      let idModal = e.target.dataset.modal;
      if(!idModal) return console.log('no se encontro modal', e.target);

      helpers.showModal(idModal);
    }

    if(e.target.matches(".list-item-btn-load")){
      let nameGame = e.target.dataset.name || "N/A";
      loadGame(nameGame);
      helpers.closeModal();
    }

    if(e.target.matches(".list-item-btn-remove")){
      let nameGame = e.target.dataset.name || "N/A";
      removeGame(nameGame);
      helpers.closeModal();
    }

  });

  document.addEventListener("DOMContentLoaded", (e) => {
    resetGame();
    renderPieces(listPieces);

    let games = localStorage.getItem("Games");
    let listGames;
    if (games) listGames = JSON.parse(games);
    else listGames = [];

    helpers.addSavedGame(listGames);
  });

  document.addEventListener("change", (e) => {

    if (e.target === colorInput) return helpers.setTheme(e);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      helpers.cleanUpPieze();
      helpers.quitPossibles();
      helpers.closeModal();
    }
  });

document.addEventListener("submit", e=>{
  e.preventDefault();

  if(e.target.name === "Guardar"){
    let nameGame = e.target.nombre.value;
    saveGame(nameGame);
    helpers.closeModal();
    e.target.reset();
  }

  if(e.target.name === "Coronar"){
    let pieceName = e.target.nombre.value;
    let position = e.target.pieceId.value;
    let piece = helpers.getPieceByPosition(position);

    if(!piece) return helpers.showInfo("fallo la coronacion");
    piece.coronar(pieceName);
    e.target.reset();
  }

})
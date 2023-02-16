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
    rey: [],
    atacantes: []
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
  game.jaque = {rey: [], atacantes:[]};
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



function saveGame() {
  let gameName = prompt("Nombre de la partida (deberá repetirlo al cargarla)").toLowerCase();
  let objectGame = {
    name: gameName,
    game,
    pieces: listPieces.map(piece => {
      return {
        name: piece.name,
        isWhite: piece.isWhite,
        position: piece.position
      }
    }),
  };


  let listGames = JSON.parse(localStorage.getItem("Games"));
  if (!listGames) {
    localStorage.setItem("Games", JSON.stringify([]))
    listGames = [];
  };

  // validadate games with same name
  let sameNameGame = listGames.findIndex((game) => game.name === gameName);

  if (sameNameGame > 0) {
    if (!confirm("ya hay una partida con este nombre, ¿desea reeplazarla?")) return;
  }

  listGames.splice(sameNameGame, 1)
  listGames.push(objectGame);
  localStorage.setItem("Games", JSON.stringify(listGames));
  resetGame();
}

function loadGame() {
  let games = localStorage.getItem("Games");
  let listGames;
  if (games) listGames = JSON.parse(games);
  else return alert("aun no hay partidas guardadas");

  let gameName = prompt("Ingresa el nombre de la partida").toLocaleLowerCase();
  let loadGame = listGames.find((game) => game.name === gameName);

  if (!loadGame) return alert(`no se encontro la partida ${gameName}`);

  game = loadGame.game;
  listPieces.forEach(piece => piece.node.remove());
  listPieces = loadGame.pieces.map(
    (piece) =>
      new piecesClass[piece.name](table, piece.isWhite, piece.position)
  );

  helpers.fixSetIndicator();
  return renderPieces(listPieces);
}

  // ************************* DOM Events ****************

  document.addEventListener("click", (e) => {
    // square with piece
    if (e.target.matches(".juego-ficha")) return pulsePiece(e.target);

    //  possible square whithout piece
    if (e.target.matches(".posible-cuadro"))
      return pulseEmpthyPossibleSquare(e.target);

    // not possible square without piece
    if (e.target.matches(".juego-cuadro")) return pulseEmpthyImpossibleSquare();

    // load saved game
    if (e.target === loadBtn) return loadGame();
    if (e.target === resetBtn) return resetGame();

      // save game
      if (e.target === saveGameBtn) return saveGame();
  });

  document.addEventListener("DOMContentLoaded", (e) => {
    resetGame();
    renderPieces(listPieces);
  });

  document.addEventListener("change", (e) => {

    if (e.target === colorInput) return helpers.setTheme(e);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      helpers.cleanUpPieze();
      return helpers.quitPossibles();
    }
  });


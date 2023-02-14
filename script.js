"use strict";

import * as helpers from "./helpers.js";
import { Peon, Torre, Alfil, Caballo, Rey, Reina } from "./clases.js";

// ************************* Variables & constants ****************

const table = document.getElementById("tablero");
const saveGameBtn = document.getElementById("saveGame");
const resetBtn = document.getElementById("reset");
const colorInput = document.getElementById("colorInput");
const turnColor = document.getElementById("turnoColor");
const loadBtn = document.getElementById("cargar");

// ************************* Game Variables ****************
let piecesClass = {Torre, Caballo, Alfil, Reina, Rey, Peon};

let game = {
  whiteTurn: true,
  upPiece: null,
  jaque: false,
};

let initialPieces = [
  new Torre(table, true, "A1"),
  new Caballo(table, true, "B1"),
  new Alfil(table, true, "C1"),
  new Rey(table, true, "D1"),
  new Reina(table, true, "E1"),
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
  new Rey(table, false, "D8"),
  new Reina(table, false, "E8"),
  new Alfil(table, false, "F8"),
  new Caballo(table, false, "G8"),
  new Torre(table, false, "H8"),
];

export let listPieces = [];

// ************************* Functions ****************

// set the up piece an show choose scuares
function toUpPiece(piece) {
  if (!validateTurn(piece)) return cleanUpPieze();

  piece.node.classList.add("up-pieze");
  let posibles = piece.getPossibles();
  game.upPiece = piece;
  helpers.markPossibles(posibles);
}

// clean a invalid action, quit the up pieze and remove the optional squares
function cleanUpPieze() {
  let active = document.querySelector(".up-pieze");
  if (active) active.classList.remove("up-pieze");
  helpers.quitPossibles();
  game.upPiece = null;
}

// change the turn
function changeTurn() {
  game.whiteTurn = game.whiteTurn ? false : true;
  fixSetIndicator();
}

// fix the turn color
function fixSetIndicator() {
  let color = game.whiteTurn ? "--ligth-color" : "--dark-color";
  turnColor.style.setProperty("--turno-color", `var(${color})`);
}

// move the up piece "piece" to square in "position"
function movePiece(piece, position) {
  if (!validateTurn(piece)) {
    return cleanUpPieze();
  }

  let cuadro = document.querySelector(`[data-id=${position}]`);

  // si intenta mover a un cuadro no permitido
  if (!cuadro.classList.contains("posible-cuadro")) {
    return cleanUpPieze();
  }

  piece.node.remove();
  cuadro.appendChild(piece.node);
  piece.position = position;
  helpers.quitPossibles();

  changeTurn();

  return cleanUpPieze();
}

// validate if the turn is correct
function validateTurn(piece) {
  if (piece.isWhite === game.whiteTurn) return true;
  return false;
}

// kill a piece
function killPiece(atacante, atacado) {
  // si son del mismo color o no es su turno
  if (atacante.isWhite === atacado.isWhite || !validateTurn(atacante)) {
    return cleanUpPieze();
  }

  let casillaAtcado = atacado.node.parentElement;
  atacante.position = atacado.position;
  atacado.node.remove();
  casillaAtcado.appendChild(atacante.node);

  let indexAtacado = listPieces.findIndex((piece) => piece === atacado);
  listPieces.splice(indexAtacado, 1);
  changeTurn();

  return cleanUpPieze();
}

// handle when pulse a piece
function pulsePiece(pieceNode) {
  let position = pieceNode.parentElement.dataset.id;
  let piece = helpers.getPieceByPosition(position);

  // en caso de no encontrar ficha
  if (piece === null) return cleanUpPieze();

  // levantar ficha para mostrar opciones
  if (game.upPiece === null) return toUpPiece(piece);

  // si intenta mover a un cuadro no permitido
  if (!piece.node.parentElement.classList.contains("posible-cuadro")) {
    return cleanUpPieze();
  }

  // si intenta tomar una ficha diferente
  return killPiece(game.upPiece, piece);
}

// handle when pulse a possible empthy square
function pulseEmpthyPossibleSquare(cuadro) {
  {
    // mover pieza
    let position = cuadro.dataset.id;
    if (helpers.getPieceByPosition(position) === null)
      movePiece(game.upPiece, position);

    // no upPieze, no ficha
    return cleanUpPieze();
  }
}

// handle when pulse a impossible empty square
function pulseEmpthyImpossibleSquare(square) {
  if (game.upPiece !== null) {
    cleanUpPieze();
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

function resetGame() {
  listPieces.forEach(piece => piece.node.remove());
  listPieces = initialPieces.map(piece => new piecesClass[piece.name](table, piece.isWhite, piece.position));;
  game.whiteTurn = true;
  game.upPiece = null;
  game.jaque = false;
  fixSetIndicator();
  return renderPieces(listPieces);
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

  fixSetIndicator();
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
      cleanUpPieze();
      return helpers.quitPossibles();
    }
  });


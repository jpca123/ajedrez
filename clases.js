"use strict";

import * as helpers from "./helpers.js";
import { listPieces } from "./script.js";

const pieceNames = [
  ["Peon", true, "♙"],
  ["Torre", true, "♖"],
  ["Alfil", true, "♗"],
  ["Caballo", true, "♘"],
  ["Reina", true, "♕"],
  ["Rey", true, "♔"],
  ["Torre", false, "♜"],
  ["Alfil", false, "♝"],
  ["Caballo", false, "♞"],
  ["Reina", false, "♛"],
  ["Rey", false, "♚"],
  ["Peon", false, "♟"],
];

class Piece {
  constructor(table, isWhite, position) {
    this.table = table;
    this.isWhite = isWhite;
    this.position = position;
    this.listLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  }

  createNode() {
    let node = document.createElement("span");
    node.classList.add("juego-ficha");
    let name = pieceNames.find(
      (piece) => piece[0] === this.name && piece[1] === this.isWhite
    )[2];
    node.textContent = name;

    return node;
  }

  getPossibles() {
    return ["C4", "C5", "C3", "D2"];
  }

  validatePosition(position) {
    let piece = helpers.getPieceByPosition(position);

    if (piece) {
      if (piece.isWhite !== this.isWhite) return true;
    } else {
      let square = this.table.querySelector(`[data-id=${position}]`);
      if (square) return true;
    }
    return false;
  }
}

class Peon extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Peon";
    this.node = this.createNode();
  }

  getPossibles() {
    let dobleValidation = true;
    let list = [];

    let indexX = this.listLetters.indexOf(this.position[0]);
    let y = parseInt(this.position[1]);
    let i = this.isWhite? 1: -1;

    let pFront = `${this.listLetters[indexX]}${y + i}`;
    let pKL = `${this.listLetters[(indexX - 1)]}${y + i}`;
    let pKR = `${this.listLetters[(indexX + 1)]}${y + i}`;

    
    let front = helpers.getPieceByPosition(pFront);
    let killLeft = helpers.getPieceByPosition(pKL);
    let killright = helpers.getPieceByPosition(pKR);

    if(!front) {
      let square = this.table.querySelector(`[data-id=${pFront}]`);
      if(square) list.push(pFront);
    } else dobleValidation = false

    if(killLeft){
      if(killLeft.isWhite !== this.isWhite) list.push(pKL);
    }
    if(killright){
      if(killright.isWhite !== this.isWhite) list.push(pKR);;
    }

    if(!dobleValidation) return list;

    if(this.isWhite){
      if(this.position[1] !== "2") return list;
    }else{
      if(this.position[1] !== "7") return list;
    }


    let doble = `${this.listLetters[indexX]}${y + (i * 2)}`;
    let pieceDoble = helpers.getPieceByPosition(doble);
    if(!pieceDoble) {
      let square = this.table.querySelector(`[data-id=${doble}]`);
      if(square) list.push(doble);
    }

    return list;
  }
}

class Torre extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Torre";
    this.node = this.createNode();
  }

  getPossibles() {
    let list = [];
    let vT, vR, vB, vL;
    vT = vR = vB = vL = true; // v=validation, + (Top, Right, Bottom, Left)

    for (let i = 1; i < 9; i++) {
      // flow top
      if (vT) {
        let x = this.position[0];
        let y = parseInt(this.position[1]);
        let nextY = y + i;
        let position = `${x}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if(piece) vT=false;

        if(this.validatePosition(position)) list.push(position);
      }
      // flow bottom
      if (vB) {
        let x = this.position[0];
        let y = parseInt(this.position[1]);
        let nextY = y + (i * -1);
        let position = `${x}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if(piece) vB=false;

        if(this.validatePosition(position)) list.push(position);
      }
      // flow rigth
      if (vR) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = this.position[1];
        let nextX = indexX + i;
        let position = `${this.listLetters[nextX]}${y}`;

        let piece = helpers.getPieceByPosition(position);
        if(piece) vR=false;
        
        if(this.validatePosition(position)) list.push(position);
      }
      // flow left
      if (vL) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = this.position[1];
        let nextX = indexX + i * -1;
        let position = `${this.listLetters[nextX]}${y}`;

        let piece = helpers.getPieceByPosition(position);
        if(piece) vL=false;

        if(this.validatePosition(position)) list.push(position);
      }
      if (!vT && !vR && !vB && !vL) break;
    }
    return list;
  }
}

class Alfil extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Alfil";
    this.node = this.createNode();
  }

  getPossibles() {
    let list = [];

    // v=validation, Lt=left-top, Rt=right-top, Lb=left-bottom, Rb=rigth-bottom
    let vLt, vRt, vLb, vRb;
    vLt = vRt = vLb = vRb = true;

    for (let i = 1; i < 9; i++) {
      // flow left-top
      if (vLt) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + (i * -1);
        let nextY = y + i;
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vLt = false;

        if(this.validatePosition(position)) list.push(position);
      }

      // flow right-top
      if (vRt) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + i;
        let nextY = y + i;
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vRt = false;

        if(this.validatePosition(position)) list.push(position);
      }

      // flow left-bottom
      if (vLb) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + (i * -1);
        let nextY = y + (i * -1);
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vLb = false;

        if(this.validatePosition(position)) list.push(position);
      }

      // flow left-top
      if (vLt) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + (i * -1);
        let nextY = y + i;
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vLt = false;

        if(this.validatePosition(position)) list.push(position);
      }
      // flow right-bottom
      if (vRb) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + i;
        let nextY = y + ((i * -1));
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);

        if (piece) vRb = false;

        if(this.validatePosition(position)) list.push(position);
      }

      if (!vLt && !vRt && !vLb && !vRb) break;
    }

    return list;
  }
}

class Caballo extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Caballo";
    this.node = this.createNode();
  }

  getPossibles() {
    let x, y, listPositions, list;
    listPositions = list = [];

    x = this.listLetters.indexOf(this.position[0]);
    y = parseInt(this.position[1]);

    listPositions.push(`${this.listLetters[x - 1]}${y - 2}`);
    listPositions.push(`${this.listLetters[x + 1]}${y - 2}`);
    listPositions.push(`${this.listLetters[x - 2]}${y - 1}`);
    listPositions.push(`${this.listLetters[x + 2]}${y + 1}`);
    listPositions.push(`${this.listLetters[x - 2]}${y + 1}`);
    listPositions.push(`${this.listLetters[x + 2]}${y - 1}`);
    listPositions.push(`${this.listLetters[x - 1]}${y + 2}`);
    listPositions.push(`${this.listLetters[x + 1]}${y + 2}`);

    list = listPositions.filter(position => this.validatePosition(position));

    return list;
  }
}

class Rey extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Rey";
    this.node = this.createNode();
  }

  getPossibles() {
    let x, y, listPositions, list;
    listPositions = list = [];

    x = this.listLetters.indexOf(this.position[0]);
    y = parseInt(this.position[1]);

    listPositions.push(`${this.listLetters[x - 1]}${y - 1}`);
    listPositions.push(`${this.listLetters[x]}${y - 1}`);
    listPositions.push(`${this.listLetters[x + 1]}${y - 1}`);
    listPositions.push(`${this.listLetters[x - 1]}${y}`);
    listPositions.push(`${this.listLetters[x + 1]}${y}`);
    listPositions.push(`${this.listLetters[x - 1]}${y + 1}`);
    listPositions.push(`${this.listLetters[x]}${y + 1}`);
    listPositions.push(`${this.listLetters[x + 1]}${y + 1}`);

    list = listPositions.filter(position => this.validatePosition(position));
    
    return list;
  }
}

class Reina extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Reina";
    this.node = this.createNode();
  }

  getPossibles() {
    let list = [];
    let vLt, vRt, vLb, vRb, vT, vR, vB, vL;
    vT = vR = vB = vL = vLt = vRt = vLb = vRb = true; // v=validation, + (Top, Right, Bottom, Left)

    for (let i = 1; i < 9; i++) {
      // flow top
      if (vT) {
        let x = this.position[0];
        let y = parseInt(this.position[1]);
        let nextY = y + i;
        let position = `${x}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if(piece) vT=false;
        if(this.validatePosition(position)) list.push(position);
      }

      // flow bottom
      if (vB) {
        let x = this.position[0];
        let y = parseInt(this.position[1]);
        let nextY = y + (i * -1);
        let position = `${x}${nextY}`;
 
        let piece = helpers.getPieceByPosition(position);
        if(piece) vB=false;
        if(this.validatePosition(position)) list.push(position);
      }

      // flow rigth
      if (vR) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = this.position[1];
        let nextX = indexX + i;
        let position = `${this.listLetters[nextX]}${y}`;

        let piece = helpers.getPieceByPosition(position);
        if(piece) vR=false;
        if(this.validatePosition(position)) list.push(position);
      }

      // flow rigth
      if (vL) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = this.position[1];
        let nextX = indexX + (i * -1);
        let position = `${this.listLetters[nextX]}${y}`;

        let piece = helpers.getPieceByPosition(position);
        if(piece) vL=false;
        if(this.validatePosition(position)) list.push(position);
      }

      // flow left-top
      if (vLt) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + (i * -1);
        let nextY = y + i;
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vLt = false;
        if(this.validatePosition(position)) list.push(position);
      }

      // flow right-top
      if (vRt) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + i;
        let nextY = y + i;
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vRt = false;
        if(this.validatePosition(position)) list.push(position);

      }

      // flow left-bottom
      if (vLb) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + (i * -1);
        let nextY = y + (i * -1);
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vLb = false;
        if(this.validatePosition(position)) list.push(position);
      }

      // flow left-top
      if (vLt) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + (i * -1);
        let nextY = y + i;
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vLt = false;
        if(this.validatePosition(position)) list.push(position);
      }
      // flow right-bottom
      if (vRb) {
        let indexX = this.listLetters.indexOf(this.position[0]);
        let y = parseInt(this.position[1]);
        let nextX = indexX + i;
        let nextY = y + (i * -1);
        let position = `${this.listLetters[nextX]}${nextY}`;

        let piece = helpers.getPieceByPosition(position);
        if (piece) vRb = false;
        if(this.validatePosition(position)) list.push(position);
      }

      if (!vT && !vR && !vB && !vL && !vLt && !vRt && !vLb && !vRb) break;
    }

    return list;
  }
}

export { Piece, Peon, Torre, Alfil, Caballo, Rey, Reina };

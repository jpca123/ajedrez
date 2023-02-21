"use strict";

import * as helpers from "./helpers.js";
import { game, listPieces } from "./script.js";

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

  up(){
    if (!helpers.validateTurn(this)) return helpers.cleanUpPieze();

    this.node.classList.add("up-pieze");
    let posibles = this.getValidPossibles();
    game.upPiece = this;
    helpers.markPossibles(posibles);
  }

  quitKillWay(){
    listPieces.forEach(piece=>{
      if(piece !== this && this.isWhite === piece.isWhite && piece.name==="Peon") piece.dobleJump=false
    })
  }

  move(position){
    if (!helpers.validateTurn(this)) {
      return helpers.cleanUpPieze();
    }
    this.quitKillWay();

    let cuadro = document.querySelector(`[data-id=${position}]`);
  
    this.node.remove();
    cuadro.appendChild(this.node);
    this.position = position;
    helpers.quitPossibles();
    
    helpers.cleanUpPieze();
    this.validJaque();
  }

  kill (enemy){
    // si son del mismo color o no es su turno
    if (this.isWhite === enemy.isWhite || !helpers.validateTurn(this)) {
      return helpers.cleanUpPieze();
    }
  
    let enemyPlace = enemy.node.parentElement;
    this.position = enemy.position;
    enemy.node.remove();
    enemyPlace.appendChild(this.node);

    let indexEnemy = listPieces.findIndex(piece => piece===enemy);
    listPieces.splice(indexEnemy, 1);  
    helpers.cleanUpPieze();
    this.validJaque();
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

  getPossibles(show=true) {
    return [];
  }

  getValidPossibles(show=true){
    let list = this.getPossibles(false);
    if(!list) return [];
    return list.filter(position => this.validateJaqueInPosible(position));
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

  validateJaqueInPosible(position){
    let originalposition = this.position;
    
    let pieceInSquare = helpers.getPieceByPosition(position);
    let pieceInSquarePosition = "";

    if(pieceInSquare) {
      pieceInSquarePosition = pieceInSquare.position;
      pieceInSquare.position = "";
    } 

    this.position = position;
    this.validJaque(false);
    if(pieceInSquare) pieceInSquare.position = pieceInSquarePosition;
    this.position = originalposition;

    if(game.jaque.rey.find(rey => rey.isWhite === this.isWhite)) return false;

    return true;
  }

  validJaque(show=true){
    game.jaque.rey = [];

    listPieces.forEach(piece => {
      let possibles = piece.getPossibles(false);
      if(!possibles) possibles = [];

      for(let i=0; i<possibles.length; i++){
        let pieceInPosition = helpers.getPieceByPosition(possibles[i]);

        if(pieceInPosition) {
          if(piece.isWhite !== pieceInPosition.isWhite){

            if(pieceInPosition.name === "Rey") {
              if(!game.jaque.rey.includes(pieceInPosition)) game.jaque.rey.push(pieceInPosition);   
            }
          }
       }
      }
    })

    if(show){
      document.querySelectorAll(".jaque").forEach(rey => rey.classList.remove("jaque"));
      game.jaque.rey.forEach(rey => rey.node.classList.add("jaque"));
    }
  }
}

class Torre extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Torre";
    this.node = this.createNode();
    this.canEnroque = true;
  }

  getPossibles(show=true) {
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

  move(position){
    super.move(position);
    this.canEnroque = false;
  }
}

class Alfil extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Alfil";
    this.node = this.createNode();
  }

  getPossibles(show=true) {
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

  getPossibles(show=true) {
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
    this.canEnroque = true;
    this.listPossiblesEnroques = [];
  }

  getPossibles(show=true) {
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

  getPossibleEnroque(show=true){
    if(show) this.listPossiblesEnroques = [];

    // if this has jaque return []
    if(game.jaque.rey.find(piece => piece===this )) return [];

    let list = [];
    let positionTorre = this.isWhite? "H1": "H8";
    let torre = helpers.getPieceByPosition(positionTorre);
    let positionTorreLargue = this.isWhite? "A1": "A8";
    let torreLargue = helpers.getPieceByPosition(positionTorreLargue);

    // validate enroque
    if(this.canEnroque){
      let validation = true;
      let positionMiddle1 = this.isWhite? "F1": "F8";
      let positionMiddle2 = this.isWhite? "G1": "G8";
      let middle1 = helpers.getPieceByPosition(positionMiddle1);
      let middle2 = helpers.getPieceByPosition(positionMiddle2);
      
      if(!torre || !torre.canEnroque) validation = false;
      
      if(middle1 || middle2) validation = false;
      
      if(!this.validateJaqueInPosible(positionMiddle1) || !this.validateJaqueInPosible(positionMiddle2)) validation = false;

      if(validation) {
        let objectEnroque = {
          torre,
          square: positionMiddle2,
          squareTorre: positionMiddle1
        }
        this.listPossiblesEnroques.push(objectEnroque);
        list.push(objectEnroque.square);
      }
    }
    
    // validate largue enroque
    if(this.canEnroque){
      let validation = true;
      let positionMiddle1 = this.isWhite? "D1": "D8";
      let positionMiddle2 = this.isWhite? "C1": "C8";
      let positionMiddle3 = this.isWhite? "B1": "B8";
      let middle1 = helpers.getPieceByPosition(positionMiddle1);
      let middle2 = helpers.getPieceByPosition(positionMiddle2);
      let middle3 = helpers.getPieceByPosition(positionMiddle3);

      if(!torreLargue || !torreLargue.canEnroque) validation = false;
      
      if(middle1 || middle2 || middle3) validation = false;

      if(!this.validateJaqueInPosible(positionMiddle1) || !this.validateJaqueInPosible(positionMiddle2) || !this.validateJaqueInPosible(positionMiddle3)) validation = false;

      if(validation) {
        let objectEnroque = {
          torre: torreLargue, 
          square: positionMiddle2,
          squareTorre: positionMiddle1
        }
        this.listPossiblesEnroques.push(objectEnroque);
        list.push(objectEnroque.square);
      }
    }
    return list;
  }

  getValidPossibles(show=true){
    let list = super.getValidPossibles(false);
    list.push(...this.getPossibleEnroque());
    return list;
  }

  move(position){
    super.move(position);
    let enroque = this.listPossiblesEnroques.find(posible => posible.square === position);
    
    if(enroque) enroque.torre.move(enroque.squareTorre);
    this.canEnroque = false;
    this.validJaque();
  }
}

class Reina extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Reina";
    this.node = this.createNode();
  }

  getPossibles(show=true) {
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

class Peon extends Piece {
  constructor(table, isWhite, position) {
    super(table, isWhite, position);
    this.name = "Peon";
    this.node = this.createNode();
    this.dobleJump = false;
  }

  getPossibles(show=true) {
    let dobleValidation = true;
    let list = [];

    let indexX = this.listLetters.indexOf(this.position[0]);
    let y = parseInt(this.position[1]);
    let i = this.isWhite? 1: -1;

    // p=position
    let pFront = `${this.listLetters[indexX]}${y + i}`;
    let pKL = `${this.listLetters[(indexX - 1)]}${y + i}`;
    let pKR = `${this.listLetters[(indexX + 1)]}${y + i}`;

    
    let front = helpers.getPieceByPosition(pFront);
    let killLeft = helpers.getPieceByPosition(pKL);
    let killRight = helpers.getPieceByPosition(pKR);

    if(!front) {
      let square = this.table.querySelector(`[data-id=${pFront}]`);
      if(square) list.push(pFront);
    } else dobleValidation = false

    if(killLeft){
      // if there are a piece in the position
      if(killLeft.isWhite !== this.isWhite) list.push(pKL);
    }else{
      // else then validation  kill in the way
      let pieceLeft = helpers.getPieceByPosition(`${pKL[0]}${y}`);
      if(pieceLeft && pieceLeft.name === "Peon" && pieceLeft.dobleJump && pieceLeft.isWhite !== this.isWhite) list.push(pKL);
    }


    if(killRight){
      if(killRight.isWhite !== this.isWhite) list.push(pKR);;
    }else{
      // else then validation  kill in the way
      let pieceRight = helpers.getPieceByPosition(`${pKR[0]}${y}`);
      if(pieceRight && pieceRight.name === "Peon" && pieceRight.dobleJump && pieceRight.isWhite !== this.isWhite) list.push(pKR);
    }

    // validate for not create kill in doble jump
    if(!dobleValidation) return list;

    if(this.isWhite){
      if(this.position[1] !== "2") return list;
    }else{
      if(this.position[1] !== "7") return list;
    }

    // position doble jump
    let doble = `${this.listLetters[indexX]}${y + (i * 2)}`;
    let pieceDoble = helpers.getPieceByPosition(doble);
    if(!pieceDoble) {
      let square = this.table.querySelector(`[data-id=${doble}]`);
      if(square) list.push(doble);
    }
    return list;
  }

  setDobleJump(position){
    let row = this.isWhite? "4": "5";
    if(position[1] !== row) return this.dobleJump = false;

    let beforeRow = this.isWhite? "2": "7";
    if(beforeRow === this.position[1]) return this.dobleJump = true;
    this.dobleJump = false;
  }

  validKillWay(position){
    let direction = this.isWhite? 1: -1;
    let positionPeonUp = `${position[0]}${parseInt(position[1]) - direction}`;
    let peonUp = helpers.getPieceByPosition(positionPeonUp);

    if(peonUp && peonUp.name==="Peon" && peonUp.isWhite !== this.isWhite && peonUp.dobleJump) this.kill(peonUp);    
  }

  move(position, show=true){
    this.setDobleJump(position);
    // validate kill to way
    if(show) this.validKillWay(position);


    super.move(position);
    if(!show) return;

    let row = this.isWhite? "8": "1";
    if(this.position[1] === row) this.prepareCoronar();
  }

  kill(enemy, show=true){
    if(show) this.validKillWay(enemy.position);
    super.kill(enemy);

    if(!show) return;
    let row = this.isWhite? "8": "1";
    if(this.position[1] === row) this.prepareCoronar();
  }

  prepareCoronar(){
    document.forms.Coronar.pieceId.value = this.position;
    helpers.showModal("modalCoronacion");
  }

  coronar(name="Reina"){
    let listClass = {Torre, Alfil, Caballo, Reina}
    let pieceClass = listClass[name];
    if(!pieceClass) pieceClass = listClass.Reina;

    let index = listPieces.findIndex(piece => piece === this);
    if(index < 0) return helpers.showInfo("fallo coronacion");
    
    this.node.remove();
    let newPiece = new pieceClass(this.table, this.isWhite, this.position);
    listPieces[index] = newPiece;

    let square = document.querySelector(`[data-id=${newPiece.position}]`);
    if(!square) return helpers.showInfo("no se encontro cuadro "+newPiece.position);

    square.appendChild(newPiece.node);
    helpers.closeModal();

    this.validJaque();
  }
}

export { Piece, Peon, Torre, Alfil, Caballo, Rey, Reina };

"use strict";

import { listPieces } from "./script.js";


export function getPieceByPosition(position) {
  let piece = listPieces.find((piece) => piece.position === position);

  if (piece) return piece;
//   console.log("no se encontro ficha en posicion", position);
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

'use strict'
//---------variables------------------
const tablero = document.querySelector('.tablero'),

    codigoInicio = `
    <section class="juego-fila fila-inpar">
    <div class="juego-cuadro" data-ficha='torreN' id="H1">&#9820;</div>
    <div class="juego-cuadro" data-ficha='caballoN' id="H2">&#9822;</div>
    <div class="juego-cuadro" data-ficha='alfilN' id="H3">&#9821;</div>
    <div class="juego-cuadro" data-ficha='reyN' id="H4">&#9818;</div>
    <div class="juego-cuadro" data-ficha='reinaN' id="H5">&#9819;</div>
    <div class="juego-cuadro" data-ficha='alfilN' id="H6">&#9821;</div>
    <div class="juego-cuadro" data-ficha='caballoN' id="H7">&#9822;</div>
    <div class="juego-cuadro" data-ficha='torreN' id="H8">&#9820;</div>
    </section>
    <section class="juego-fila fila-par">
    <div class="juego-cuadro" data-ficha='peonN' id="G1">&#9823;
    </div>
    <div class="juego-cuadro" data-ficha='peonN' id="G2">&#9823;
    </div>
    <div class="juego-cuadro" data-ficha='peonN' id="G3">&#9823;
    </div>
    <div class="juego-cuadro" data-ficha='peonN' id="G4">&#9823;
    </div>
    <div class="juego-cuadro" data-ficha='peonN' id="G5">&#9823;
    </div>
    <div class="juego-cuadro" data-ficha='peonN' id="G6">&#9823;
    </div>
    <div class="juego-cuadro" data-ficha='peonN' id="G7">&#9823;
    </div>
    <div class="juego-cuadro" data-ficha='peonN' id="G8">&#9823;
    </div>
    </section>
<section class="juego-fila fila-inpar">
<div class="juego-cuadro" id="F1"></div>
<div class="juego-cuadro" id="F2"></div>
<div class="juego-cuadro" id="F3"></div>
<div class="juego-cuadro" id="F4"></div>
<div class="juego-cuadro" id="F5"></div>
<div class="juego-cuadro" id="F6"></div>
<div class="juego-cuadro" id="F7"></div>
<div class="juego-cuadro" id="F8"></div>
</section>
<section class="juego-fila fila-par">
<div class="juego-cuadro" id="E1"></div>
<div class="juego-cuadro" id="E2"></div>
<div class="juego-cuadro" id="E3"></div>
<div class="juego-cuadro" id="E4"></div>
<div class="juego-cuadro" id="E5"></div>
<div class="juego-cuadro" id="E6"></div>
<div class="juego-cuadro" id="E7"></div>
<div class="juego-cuadro" id="E8"></div>
</section>
<section class="juego-fila fila-inpar">
<div class="juego-cuadro" id="D1"></div>
<div class="juego-cuadro" id="D2"></div>
<div class="juego-cuadro" id="D3"></div>
<div class="juego-cuadro" id="D4"></div>
<div class="juego-cuadro" id="D5"></div>
<div class="juego-cuadro" id="D6"></div>
<div class="juego-cuadro" id="D7"></div>
<div class="juego-cuadro" id="D8"></div>
</section>
<section class="juego-fila fila-par">
<div class="juego-cuadro" id="C1"></div>
<div class="juego-cuadro" id="C2"></div>
<div class="juego-cuadro" id="C3"></div>
<div class="juego-cuadro" id="C4"></div>
<div class="juego-cuadro" id="C5"></div>
<div class="juego-cuadro" id="C6"></div>
<div class="juego-cuadro" id="C7"></div>
<div class="juego-cuadro" id="C8"></div>
</section>
<section class="juego-fila fila-inpar">
<div class="juego-cuadro" data-ficha='peonB' id="B1">&#9817;</div>
<div class="juego-cuadro" data-ficha='peonB' id="B2">&#9817;</div>
<div class="juego-cuadro" data-ficha='peonB' id="B3">&#9817;</div>
<div class="juego-cuadro" data-ficha='peonB' id="B4">&#9817;</div>
<div class="juego-cuadro" data-ficha='peonB' id="B5">&#9817;</div>
<div class="juego-cuadro" data-ficha='peonB' id="B6">&#9817;</div>
<div class="juego-cuadro" data-ficha='peonB' id="B7">&#9817;</div>
<div class="juego-cuadro" data-ficha='peonB' id="B8">&#9817;</div>
</section>
<section class="juego-fila fila-par">
<div class="juego-cuadro" data-ficha='torreB' id="A1">&#9814;</div>
<div class="juego-cuadro" data-ficha='caballoB' id="A2">&#9816;</div>
<div class="juego-cuadro" data-ficha='alfilB' id="A3">&#9815;</div>
<div class="juego-cuadro" data-ficha='reyB' id="A4">&#9812;</div>
<div class="juego-cuadro" data-ficha='reinaB' id="A5">&#9813;</div>
<div class="juego-cuadro" data-ficha='alfilB' id="A6">&#9815;</div>
<div class="juego-cuadro" data-ficha='caballoB' id="A7">&#9816;</div>
<div class="juego-cuadro" data-ficha='torreB' id="A8">&#9814;</div>
</section>`;

const listaFichas = [['peon', '&#9817;'], ['peonNegro', '&#9823;'], ['torre', '&#9814;'], ['torreNegro', '&#9820;'], ['alfil', '&#9815;'], ['alfilNegro', '&#9821;'], ['caballo', '&#9816;'], ['caballoNegro', '&#9822;'], ['reina', '&#9813;'], ['reinaNegro', '&#9819;'], ['rey', '&#9812;'], ['reyNegro', '&#9818;']];
let listaLetras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

let anteriorFicha = null;
let turno = true;




//------------Funciones-----------------

function preparar(e) {
    tablero.innerHTML = '';
    tablero.innerHTML = codigoInicio;
}

function verificarMover(e) {
    let siMover = true;
    if (anteriorFicha === null) {
        if (e.target.textContent === '') {
            return anteriorFicha = null;
        }
        if (e.target.dataset.ficha.includes('N')) {
            if (turno) {
                alert('No es tu turno')
                return anteriorFicha = null;
            };
        } else if (e.target.dataset.ficha.includes('B')) {
            if (!turno) {
                alert('No es tu turno')
                return anteriorFicha = null;
            }
        }
        e.target.classList.add('foco');
        devolverCasillasPosibles(e.target, true);
        return anteriorFicha = e.target;
    }
    if (anteriorFicha === e.target) {
        quitarcasillasPosibles();
        e.target.classList.remove('foco');
        return anteriorFicha = null;
    }
    let posiblesCuadros = devolverCasillasPosibles(anteriorFicha);
    quitarcasillasPosibles();

    if (!posiblesCuadros.includes(e.target)) {
        anteriorFicha.classList.remove('foco');
        anteriorFicha = null;
        return false;
    }

    if (e.target.textContent != '') {
        if (!matarFicha(e.target, anteriorFicha)) return false;
    }
    if (siMover) mover(e);
}

function matarFicha(objetivo, atacante) {

    if (objetivo.textContent === '' || atacante.textContent === '') return false;

    if (objetivo.dataset.ficha.includes('N') && atacante.dataset.ficha.includes('N') || objetivo.dataset.ficha.includes('B') && atacante.dataset.ficha.includes('B')) return false;

    return true;


}

function devolverCasillasPosibles(ficha, ponerClase = false, autoinvocado = false) {
    let cuadrosPosibles = [];
    let letra;
    if (ficha.dataset.ficha.includes('N')) letra = 'N';
    else letra = 'B';
    switch (ficha.dataset.ficha) {
        case `peon${letra}`:
            cuadrosPosibles = moverPeon(ficha);
            break;

        case `torre${letra}`:
            cuadrosPosibles = moverTorre(ficha);
            break;
        case `alfil${letra}`:
            cuadrosPosibles = moverAlfil(ficha);
            break;

        case `reina${letra}`:
            cuadrosPosibles = moverAlfil(ficha);
            cuadrosPosibles = cuadrosPosibles.concat(moverTorre(ficha));
            break;

        case `caballo${letra}`:
            cuadrosPosibles = moverCaballo(ficha);
            break;
        case `rey${letra}`:
            cuadrosPosibles = moverRey(ficha);
            break;
    }

    if (ponerClase && cuadrosPosibles.length > 0) dibujarCasillasPosibles(cuadrosPosibles);
    return cuadrosPosibles;

}

function quitarcasillasPosibles() {
    let posibles = tablero.querySelectorAll('.posible-cuadro');
    for (let el of posibles) {
        el.classList.remove('posible-cuadro');
    }
}

function moverPeon(ficha) {
    let lista = [];
    let primerPunto, segundoPunto, letra, killDerecha, killIzquierda;
    if (ficha.dataset.ficha.includes('N')) {
        letra = 'G';
        primerPunto = tablero.querySelector(`#${listaLetras[(listaLetras.indexOf(ficha.id[0]) + -1)]}${ficha.id[1]}`);
        segundoPunto = tablero.querySelector(`#${listaLetras[(listaLetras.indexOf(ficha.id[0]) - 2)]}${ficha.id[1]}`);
        let n = 1;

        if (ficha.id[0] === letra) n = 2;


        killDerecha = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 1]}${parseInt(ficha.id[1]) + 1}`);

        killIzquierda = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 1]}${parseInt(ficha.id[1]) - 1}`);
    } else {
        letra = 'B';
        primerPunto = tablero.querySelector(`#${listaLetras[(listaLetras.indexOf(ficha.id[0]) + 1)]}${ficha.id[1]}`);
        segundoPunto = tablero.querySelector(`#${listaLetras[(listaLetras.indexOf(ficha.id[0]) + 2)]}${ficha.id[1]}`);
        let n = 1;
        if (ficha.id[0] === letra) n = 2;

        killDerecha = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 1]}${parseInt(ficha.id[1]) + 1}`);

        killIzquierda = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 1]}${parseInt(ficha.id[1]) - 1}`);

    }

    if (primerPunto !== null) {
        if (primerPunto.textContent === '') lista.push(primerPunto);
    }

    if (ficha.id[0] === letra && segundoPunto.textContent === '' && segundoPunto !== null) {
        if (segundoPunto.textContent === '') lista.push(segundoPunto);
    }

    if (killDerecha !== null) {
        if (killDerecha.textContent !== '' && matarFicha(killDerecha, ficha)) lista.push(killDerecha);
    }
    if (killIzquierda !== null) {

        if (killIzquierda.textContent !== '' && matarFicha(killIzquierda, ficha)) lista.push(killIzquierda);
    }
    return lista;
}

function moverTorre(ficha) {
    let lista = [];
    let derechaM = true, izquierdaM = true, arribaM = true, abajoM = true;
    for (let i = 1; i < 8; i++) {

        if (!derechaM) break
        let derecha = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0])]}${parseInt(ficha.id[1]) + i}`);
        if (derecha !== null && derecha.textContent !== '') {

            if (matarFicha(derecha, ficha) && derechaM) {
                derechaM = false;
            } else if (!matarFicha(derecha, ficha)) break
        }
        if (derecha !== null) lista.push(derecha);

    }

    for (let i = 1; i < 8; i++) {
        if (!izquierdaM) break;

        let izquierda = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0])]}${(parseInt(ficha.id[1]) - i)}`);

        if (izquierda !== null && izquierda.textContent !== '') {

            if (matarFicha(izquierda, ficha) && izquierdaM) {
                izquierdaM = false;
            } else if (!matarFicha(izquierda, ficha)) break
        }
        if (izquierda !== null) lista.push(izquierda);

    }

    for (let i = 1; i < 8; i++) {
        if (!arribaM) break;

        let arriba = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - i]}${ficha.id[1]}`);
        if (arriba !== null && arriba.textContent !== '') {

            if (matarFicha(arriba, ficha) && arribaM) {
                arribaM = false;
            } else if (!matarFicha(arriba, ficha)) break
        }
        if (arriba !== null) lista.push(arriba);
    }

    for (let i = 1; i < 8; i++) {
        if (!abajoM) break;

        let abajo = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + i]}${parseInt(ficha.id[1])}`);

        if (abajo !== null && abajo.textContent !== '') {

            if (matarFicha(abajo, ficha) && abajoM) {
                abajoM = false;
            } else if (!matarFicha(abajo, ficha)) break
        }
        if (abajo !== null) lista.push(abajo);
    }
    return lista;
}

function moverAlfil(ficha) {
    let derechaM = true,
        izquierdaM = true,
        arribaM = true,
        abajoM = true;
    let lista = [];

    for (let i = 1; i < 9; i++) {
        if (!derechaM) break;
        let derecha = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + i]}${parseInt(ficha.id[1]) + i}`);

        if (derecha !== null && derecha.textContent !== '') {
            if (matarFicha(derecha, ficha) && derechaM) derechaM = false;
            else if (!matarFicha(derecha, ficha)) break
        }

        if (derecha !== null) {
            lista.push(derecha);
        }
    }
    for (let i = 1; i < 9; i++) {
        if (!izquierdaM) break;
        let izquierda = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - i]}${parseInt(ficha.id[1]) + i}`);

        if (izquierda !== null && izquierda.textContent !== '') {
            if (matarFicha(izquierda, ficha) && izquierdaM) izquierdaM = false;
            else if (!matarFicha(izquierda, ficha)) break
        }

        if (izquierda !== null) {
            lista.push(izquierda);
        }
    }
    for (let i = 1; i < 9; i++) {
        if (!arribaM) break;
        let arriba = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + i]}${parseInt(ficha.id[1]) - i}`);

        if (arriba !== null && arriba.textContent !== '') {
            if (matarFicha(arriba, ficha) && arribaM) arribaM = false;
            else if (!matarFicha(arriba, ficha)) break
        }

        if (arriba !== null) {
            lista.push(arriba);
        }
    }
    for (let i = 1; i < 9; i++) {
        if (!abajoM) break;
        let abajo = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - i]}${parseInt(ficha.id[1]) - i}`);

        if (abajo !== null && abajo.textContent !== '') {
            if (matarFicha(abajo, ficha) && abajoM) abajoM = false;
            else if (!matarFicha(abajo, ficha)) break
        }

        if (abajo !== null) {
            lista.push(abajo);
        }
    }

    return lista;
}

function moverCaballo(ficha) {
    let punto1, punto2, punto3, punto4, punto5, punto6, punto7, punto8;
    let lista = [];
    punto1 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 2]}${parseInt(ficha.id[1]) + 1}`);
    punto2 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 2]}${parseInt(ficha.id[1]) - 1}`);
    punto3 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 1]}${parseInt(ficha.id[1]) + 2}`);
    punto4 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 1]}${parseInt(ficha.id[1]) + 2}`);
    punto5 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 2]}${parseInt(ficha.id[1]) + 1}`);
    punto6 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 2]}${parseInt(ficha.id[1]) - 1}`);
    punto7 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 1]}${parseInt(ficha.id[1]) - 2}`);
    punto8 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 1]}${parseInt(ficha.id[1]) - 2}`);
    let puntos = [punto1, punto2, punto3, punto4, punto5, punto6, punto7, punto8];

    for (let i of puntos) {
        if (i !== null && i !== undefined) {
            if (i.textContent !== '' && !matarFicha(i, ficha)) continue;
            lista.push(i);
        }
    }

    return lista;
}

function moverRey(ficha) {
    let punto1, punto2, punto3, punto4, punto5, punto6, punto7, punto8;
    let lista = [];

    punto1 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 1]}${parseInt(ficha.id[1]) + 1}`);
    punto2 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 1]}${parseInt(ficha.id[1])}`);
    punto3 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) + 1]}${parseInt(ficha.id[1] - 1)}`);
    punto4 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0])]}${parseInt(ficha.id[1]) + 1}`);
    punto5 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0])]}${parseInt(ficha.id[1] - 1)}`);
    punto6 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 1]}${parseInt(ficha.id[1] - 1)}`);
    punto7 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 1]}${parseInt(ficha.id[1])}`);
    punto8 = tablero.querySelector(`#${listaLetras[listaLetras.indexOf(ficha.id[0]) - 1]}${parseInt(ficha.id[1]) + 1}`);
    let puntos = [punto1, punto2, punto3, punto4, punto5, punto6, punto7, punto8];

    for (let i of puntos) {
        if (i !== null) {
            if (!matarFicha(i, ficha) && i.textContent !== '') continue;
            lista.push(i);
        }
    }
    return lista;
}

function dibujarCasillasPosibles(lista) {
    for (let elemento of lista) {
        elemento.classList.add('posible-cuadro');
    }
}

function mover(e) {
    e.target.textContent = anteriorFicha.textContent;
    e.target.dataset.ficha = anteriorFicha.dataset.ficha;
    anteriorFicha.classList.remove('foco');
    anteriorFicha.textContent = '';
    anteriorFicha.dataset.ficha = '';
    anteriorFicha = null;

    if (turno) turno = false;
    else turno = true;
}
//------------------Eventos----------------

document.addEventListener('DOMContentLoaded', preparar);
tablero.addEventListener('click', e => {
    if (e.target.matches('.juego-cuadro')) verificarMover(e);
})



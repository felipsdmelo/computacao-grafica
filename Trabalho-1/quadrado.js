"use strict";

function criaCirculo(contexto, x, y, raio, cor) {
    contexto.beginPath();
    contexto.arc(x, y, raio, 0, 2 * Math.PI, false);
    if (cor) {
        contexto.fillStyle = cor;
        contexto.fill();
    }
}

function criaVertices(contexto, vertices) {
    const cores = ["red", "green", "blue", "white"];
    vertices.forEach((ponto, i) => {
        const {x, y} = ponto;

        criaCirculo(contexto, x, y, 5, cores[i]);
    });
}

function criaQuadrado(contexto, pontos) {
    contexto.beginPath();

    pontos.forEach((ponto) => {
        const {x, y} = ponto;
        contexto.lineTo(x, y);
    });

    contexto.fillStyle = "#C71585";
    contexto.fill();
}

/**
 * Muda o vertice que servira como base para a rotacao para a origem do canvas,
 * uma vez que toda transformacao linear preserva a origem
 * @param {*} pontos 
 * @param {*} vertice 
 * @returns 
 */
function moveParaOrigem(pontos, vertice) {
    let deslocamentoX = pontos[vertice].x;
    let deslocamentoY = pontos[vertice].y;
    return pontos.map((ponto) => {
        return new DOMPoint(ponto.x - deslocamentoX, ponto.y - deslocamentoY);
    });
}

function moveBack(pontos, x, y) {
    return pontos.map((ponto) => {
        return new DOMPoint(ponto.x + x, ponto.y + y);
    });
}

function animacao(contexto, pontos, largura, altura) {
    let vertice = 0;

    document.addEventListener('keypress', (e) => {
        const tecla = e.key;

        if (tecla === 'r') {
            vertice = 0;
        } else if (tecla === 'g') {
            vertice = 1;
        } else if (tecla === 'b') {
            vertice = 2;
        } else if (tecla === 'w') {
            vertice = 3;
        }
    });

    // variacao de angulo em cada frame da animacao
    let graus = 2;
    let radianos = graus * Math.PI / 180;

    let executa = () => {
        // salva a posicao com base no vertice utilizado para o giro
        let backupPontos = [pontos[vertice].x, pontos[vertice].y];
        pontos = moveParaOrigem(pontos, vertice);

        // matriz de rotacao
        let rotacao = new DOMMatrix([
            Math.cos(radianos),
            -Math.sin(radianos),
            Math.sin(radianos),
            Math.cos(radianos),
            0,
            0,
        ]);

        // aplica a rotacao para cada ponto
        pontos = pontos.map((ponto) => {
            return ponto.matrixTransform(rotacao);
        });

        pontos = moveBack(pontos, ...backupPontos);

        // remove a figura anterior e cria uma nova
        contexto.clearRect(0, 0, largura, altura);
        criaQuadrado(contexto, pontos);
        criaVertices(contexto, pontos);

        requestAnimationFrame(executa);
    };
    return executa;
}

function main() {
    let canvas = document.querySelector("#theCanvas");
    let contexto = canvas.getContext("2d");

    let lado = 75 // lado do quadrado

    const x = (canvas.width - lado) / 2;
    const y = (canvas.height - lado) / 2;

    let pontos = [
        new DOMPoint(x, y),
        new DOMPoint(x + lado, y),
        new DOMPoint(x + lado, y + lado),
        new DOMPoint(x, y + lado)
    ];

    let executa = animacao(contexto, pontos, canvas.width, canvas.height);

    executa();
}

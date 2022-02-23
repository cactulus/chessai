let board_eval;
let canv;
let ctx;

let board_size;
let square_size;

let board;
let paths_evaluated = 0;
let selected = false;
let selection = {file: 0, rank: 0};
let last_last_move = "";
let last_move = "";

let highlights = [];

const files = "abcdefgh";

const chess = new Chess();

window.onload = function() {
    document.addEventListener("mouseup", click);
    board_eval = document.querySelector("#board-eval");
    canv = document.querySelector("#board_canv");
    ctx = canv.getContext("2d");

    read_openings();
    init_board();
    draw();

    setTimeout(draw, 1000);
}

window.onresize = function() {
    resize();
}

function init_board() {
    board = new Board();

    resize();
}

function draw() {
    for (let rank = 0; rank < 8; ++rank) {
        for (let file = 0; file < 8; ++file) {
            let color;
            let sel = selected && selection.file === file && selection.rank === rank; 
            
            if ((file + rank) % 2 == 0) {
                color = sel ? "#F6F669" : "#EEEED2";
            } else {
                color = sel ? "#BACA2B" : "#769656";
            }

            ctx.fillStyle = color;
            ctx.fillRect(file * square_size, rank * square_size, square_size, square_size);

        }
    }

    board.render();

    if (last_move != last_last_move) {
        let split = last_move.split("");
        let off = 1;
        if (split[split.length - 1] == '+' || split[split.length - 1] == '#') {
            off = 2;
        }
        let lf = files.indexOf(split[split.length - off - 1]);
        let lr = 8 - parseInt(split[split.length - off]);

        ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
        ctx.fillRect(lf * square_size, lr * square_size, square_size, square_size);

        last_last_move = last_move;
    }

    for (let high of highlights) {
        let color = "red";
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(high.file * square_size + square_size / 2, high.rank * square_size + square_size / 2, square_size / 6, 0, 2 * Math.PI);
        ctx.fill();
    }
    
}

function click(e) {    
    let sqx = Math.floor(e.clientX / square_size);
    let sqy = Math.floor(e.clientY / square_size);

    if (sqx >= 8 || sqy >= 8) {
        selected = false;
        draw();
        return;
    }

    if (selection.file === sqx && selection.rank === sqy) {
        selected = false;
        selection.file = -1;
        selection.rank = -1;
        draw();
        return;
    }

    let move = {from: cp(selection), to: cp2(sqx, sqy), promotion: "q"};
    if (selected && chess.turn() == "w" && chess.move(move)) {
        selected = false;
        highlights = [];
        draw();
        setTimeout(ai_move, 50);
    } else {
        selected = true;
        selection.file = sqx;
        selection.rank = sqy;

        let moves = chess.moves({square: cp(selection), promotion: "q"});
        highlights = [];
        for (let move of moves) {
            let split = move.split("");
            let off = 1;
            if (split[split.length - 1] == '+' || split[split.length - 1] == '#') {
                off = 2;
            }
            let file = files.indexOf(split[split.length - off - 1]);
            let rank = 8 - parseInt(split[split.length - off]);
            highlights.push({file: file, rank: rank});
            if (move == "O-O") {
                highlights.push({file: 6, rank: 7});
            }
            if (move == "O-O-O") {
                highlights.push({file: 2, rank: 7});
            }
        }
    }

    draw();
}

function check_win() {
    let eval = board.evaluate() / 10.0;
    board_eval.innerText = "Board Evaluation: " + eval + ", Paths Evaluated: " + paths_evaluated++;;

    if (chess.game_over()) {
        if (chess.in_checkmate()) {
            let t = chess.turn();
            if (t == "b") {
                alert("White won!");
            }

            if (t == "w") {
                alert("Black won!");
            }
        } else {
            alert("Stalemate");
        }
    }

    return chess.game_over();
}

function cp(p) {
    return cp2(p.file, p.rank);
}

function cp2(file, rank) {
    return `${files[file]}${8-rank}`;
}

function resize() {
    let minus = 150;
    if (window.innerWidth < 1000) {
        minus = 20;
    }
    let max_size = Math.min(window.innerWidth - minus, window.innerHeight - minus);
    square_size = Math.floor(max_size / 8);
    board_size = square_size << 3;
    canv.width = board_size;
    canv.height = board_size;

    draw();
}
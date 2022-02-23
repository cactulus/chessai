let openings = null;
let out_of_opening = false;

function ai_move() {
    if (check_win()) {
        return;
    }

    let best_move = search_opening();

    if (best_move != null) {
        chess.move(best_move);
    } else {
        const moves = chess.moves();
        let best_value = -3000;
        let depth = 2;

        if (moves.length <= 20) {
            depth = 3;
        }

        if (moves.length <= 10) {
            depth = 4;
        }

        if (moves.length <= 4) {
            depth = 5;
        }

        for (let move of moves) {
            chess.move(move);
    
            let value = minimax(depth, false, -3000, 3000);
            if (value > best_value) {
                best_value = value;
                best_move = move;
            }
    
            chess.undo();
        }
    }

    if (best_move == null) {
        let moves = chess.moves();
        best_move = moves[Math.floor(Math.random() * moves.length)];
    }

    chess.move(best_move);
    last_move = best_move.to;
    if (last_move == undefined) {
        last_move = best_move;
    }
    draw();

    check_win();
}

function minimax(depth, maximizing, alpha, beta) {
    paths_evaluated++;

    if (depth === 0)
        return -board.evaluate();

    let moves = chess.moves();

    if (maximizing) {
        best_value = -3000;

        for (let move of moves) {
            chess.move(move);
            best_value = Math.max(best_value, minimax(depth - 1, !maximizing, alpha, beta));
            chess.undo();

            alpha = Math.max(alpha, best_value);
            if (beta <= alpha) {
                return best_value;
            }
        }
    } else {
        best_value = 3000;

        for (let move of moves) {
            chess.move(move);
            best_value = Math.min(best_value, minimax(depth - 1, !maximizing, alpha, beta));
            chess.undo();
    
            beta = Math.min(beta, best_value);
            if (beta <= alpha) {
                return best_value;
            }
        }
    }

    return best_value;
}

function search_opening() {
    if (openings == null || out_of_opening) {
        return null;
    }

    let history = chess.history({ verbose: true });
    
outer:
    for (let i = 0; i < openings.length; ++i) {
        let j = 0;

        for (; j < history.length; ++j) {
            let mv = history[j];
            let cv = mv.from + mv.to;
            
            if (j >= openings[i].length || cv !== openings[i][j]) {
                continue outer;
            }
        }
        if (j < openings[i].length) {
            let best_move = openings[i][j];
            let from = best_move.substr(0, 2);
            let to = best_move.substr(2, 2);
            return {from: from, to: to};
        }
    }

    out_of_opening = true;
    return null;
}

function read_openings() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "https://kaipel.net/nikolas/nchess/openings/openings.txt", false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                let lines = rawFile.responseText.split("\n");
                openings = [];

                for (let line of lines) {
                    let moves = line.split(" ");
                    openings.push(moves);
                }
            }
        }
    }
    rawFile.send(null);
}
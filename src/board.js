class Board {
    constructor() {
        this.images = {};

        this.load_images();
    }

    render() {
        let board = chess.board();

        for (let rank = 0; rank < 8; ++rank) {
            for (let file = 0; file < 8; ++file) {
                let square = board[rank][file];

                if (square !== null) {
                    let img_name = square.type + square.color;
                    ctx.drawImage(this.images[img_name], file * square_size, rank * square_size, square_size, square_size);
                }
            }
        }
    }

    evaluate() {
        let board = chess.board();
        let total_value = 0;

        for (let rank = 0; rank < 8; ++rank) {
            for (let file = 0; file < 8; ++file) {
                let square = board[rank][file];

                if (square !== null) {
                    let value = this.square_value(square, rank, file);

                    total_value += square.color == "w" ? value : -value;
                }
            }
        }

        return total_value;
    }
    
    square_value(sq, rank, file) {
        let w = sq.color == "w";
        let value;

        switch (sq.type) {
            case "p": {
                value = 10 + (w ? pawn_table_white[rank][file] : pawn_table_black[rank][file]); 
            } break;
            case "n": {
                value = 30 + knight_table[rank][file]; 
            } break;
            case "b": {
                value = 30 + (w ? bishop_table_white[rank][file] :bishop_table_black[rank][file]); 
            } break;
            case "r": {
                value = 50 + (w ? rook_table_white[rank][file] : rook_table_black[rank][file]); 
            } break;
            case "q": {
                value = 90 + queen_table[rank][file];
            } break;
            case "k": {
                value = 900 + (w ? king_table_white[rank][file] : king_table_black[rank][file]); 
            } break;
        }

        return value;
    }

    load_images() {
        this.images["pb"] = this.load_image("pb");
        this.images["bb"] = this.load_image("bb");
        this.images["rb"] = this.load_image("rb");
        this.images["nb"] = this.load_image("nb");
        this.images["kb"] = this.load_image("kb");
        this.images["qb"] = this.load_image("qb");

        this.images["pw"] = this.load_image("pw");
        this.images["bw"] = this.load_image("bw");
        this.images["rw"] = this.load_image("rw");
        this.images["nw"] = this.load_image("nw");
        this.images["kw"] = this.load_image("kw");
        this.images["qw"] = this.load_image("qw");
    }

    load_image(name) {
        let image = new Image();
        image.src = "https://kaipel.net/nikolas/nchess/rsc/" + name + ".png";
        return image;
    }
}

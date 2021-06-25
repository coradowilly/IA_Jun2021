const express = require('express')
const cors = require('cors');
const port = 5000

const app = express()

app.use(cors())


app.get('/', (req, res) => {
    let { turno, estado } = req.query
    console.log(turno, estado)
    res.send(reversi(turno, estado));

})


var board = []

function reversi(turn, board_state) {
    board = fillBoard(board_state)
    console.table(board)
    let moves = posibleMoves(turn, board_state)
    console.table(moves)
    return '11'
}

function fillBoard(board_state) {
    let new_board = []
    let items = board_state.split('')
    for (i = 0; i < 8; i++) {
        let row = []
        for (j = 0; j < 8; j++) {
            row.push(items[(i * 8) + j])
        }
        new_board.push(row)
    }
    return new_board;
}

function posibleMoves(turn, board_state) {
    let current_board = fillBoard(board_state)
    let moves = []
    for (i = 0; i < 8; i++) {
        for (j = 0; j < 8; j++) {
            // console.log(`Evaluando [${i},${j}] {${current_board[i][j]}} TURNO ${turn}`)
            if (current_board[i][j] == '2') {
                // Ignorar vacios
            } else if (current_board[i][j] == turn) {
                // Ficha del turno actual
                // Buscar movimientos NORTE
                console.log('----NORTE----')
                let possible_move = -1;
                for (x = i - 1; x > 0; x--) {
                    console.log(`NORTE - Evaluando [${x},${j}] {${current_board[x][j]}} TURNO ${turn}`)
                    if ((current_board[x][j] == turn) || (current_board[x][j] == '2')) {
                        // Ignorar fichas del mismo color a la par, o espacios vacios
                        break
                    } else {
                        possible_move = x;
                        console.log(`ENEMIGO EN [${possible_move},${j}]`)

                    }
                }
                if ((possible_move - 1 >= 0) && (current_board[possible_move - 1][j] == '2') && possible_move != -1) {
                    moves.push([possible_move - 1, j])
                }
                console.log('----//NORTE//----')

                // Buscar movimientos SUR
                console.log('----SUR----')
                possible_move = -1
                for (x = i + 1; x <= 8; x++) {
                    console.log(`SUR - Evaluando [${x},${j}] {${current_board[x][j]}} TURNO ${turn}`)
                    if ((current_board[x][j] == turn) || (current_board[x][j] == '2')) {
                        // Ignorar fichas del mismo color a la par, o espacios vacios
                        break
                    } else {
                        possible_move = x;
                        console.log(`ENEMIGO EN [${possible_move},${j}]`)

                    }
                }
                if ((possible_move + 1 <= 8) && (current_board[possible_move + 1][j] == '2') && possible_move != -1) {
                    moves.push([possible_move + 1, j])
                }
                console.log('----//SUR//----')

                // Buscar movimientos ESTE (DERECHA)
                console.log('----ESTE----')
                possible_move = -1
                for (x = j + 1; x <= 8; x++) {
                    console.log(`ESTE - Evaluando [${i},${x}] {${current_board[i][x]}} TURNO ${turn}`)
                    if ((current_board[i][x] == turn) || (current_board[i][x] == '2')) {
                        // Ignorar fichas del mismo color a la par, o espacios vacios
                        break
                    } else {
                        possible_move = x;
                        console.log(`ENEMIGO EN [${i},${possible_move}]`)

                    }
                }
                if ((possible_move + 1 <= 8) && (current_board[i][possible_move + 1] == '2') && possible_move != -1) {
                    console.log('POSIBLE MOVIMIENTO EN ' + [i, possible_move + 1])
                    moves.push([i, possible_move + 1])
                }
                console.log('----//ESTE//----')

                // Buscar movimientos OESTE (IZQUIERDA)
                console.log('----OESTE----')
                possible_move = -1
                for (x = j - 1; x > 0; x--) {
                    console.log(`OESTE - Evaluando [${i},${x}] {${current_board[i][x]}} TURNO ${turn}`)
                    if ((current_board[i][x] == turn) || (current_board[i][x] == '2')) {
                        // Ignorar fichas del mismo color a la par, o espacios vacios
                        break
                    } else {
                        possible_move = x;
                        console.log(`ENEMIGO EN [${i},${possible_move}]`)

                    }
                }
                if ((possible_move - 1 >= 0) && (current_board[i][possible_move - 1] == '2') && possible_move != -1) {
                    moves.push([i,possible_move - 1])
                }
                console.log('----//OESTE//----')

                

            }
        }
    }
    return moves
}


app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
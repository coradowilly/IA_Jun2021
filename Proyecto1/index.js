const express = require("express");
const app = express();
const port = 5000;

var tabla_heuristica = [[120, -20, 20, 5, 5, 20, -20, 120],[-20, -40, -5, -5, -5, -5, -40, -20],[20, -5, 15, 3, 3, 15, -5, 20],[5, -5, 3, 3, 3, 3, -5, 5],[5, -5, 3, 3, 3, 3, -5, 5],[20, -5, 15, 3, 3, 15, -5, 20],[-20, -40, -5, -5, -5, -5, -40, -20],[120, -20, 20, 5, 5, 20, -20, 120],];
var tabla = [[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],];

var movimientos = [];
var movimientos_enemigos = [];

// ./ngrok http 5000
// http://luisespino.com/temp/games/reversi/index.php

app.get("/", (req, res) => {
  //variable reset
  movimientos = [];
  movimientos_enemigos = [];

  var { turno, estado } = req.query;
  estado = estado?.split("");
  fill_board(estado);
  find_spots(turno);
  console.table(movimientos);
  sort_and_clean_movimientos();
  minimax(turno);
  if (movimientos.length > 1 ) {
    if(movimientos.length>3 && movimientos[0].h == movimientos[1].h && movimientos[1].h == movimientos[2].h){
      let indx = getRandomInt(3);
      res.send(movimientos[indx].spot);
    }else{
    if (movimientos[0].h == movimientos[1].h) {
      let indx = getRandomInt(2);
      res.send(movimientos[indx].spot);
    } else res.send(movimientos[0].spot);
  }
  } else res.send(movimientos[0].spot);
});

function sort_and_clean_movimientos() {
  let aux = new Set();
  for (let item of movimientos) {
    aux.add(item.spot);
  }
  movimientos = [];
  for (let item of aux) {
    movimientos.push({
      spot: item,
      h: tabla_heuristica[parseInt(item.split("")[0])][parseInt(item.split("")[1])],
    });
  }
  movimientos.sort((a, b) => {
    if (a.h > b.h) return -1;
    else return 1;
  });
}

function copy_array() {
  let array = [[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 0, 0, 0, 0, 0, 0],];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      array[i][j] = tabla[i][j];
    }
  }

  return array;
}

function find_movimientos_enemigos() {
  if (movimientos_enemigos.length == 0) return 0;

  let aux = new Set();
  for (let item of movimientos_enemigos) {
    aux.add(item.spot);
  }
  movimientos_enemigos = [];
  for (let item of aux) {
    movimientos_enemigos.push({
      spot: item,
      h: tabla_heuristica[parseInt(item.split("")[0])][parseInt(item.split("")[1])],
    });
  }
  movimientos_enemigos.sort((a, b) => {
    if (a.h > b.h) return -1;
    else return 1;
  });
  return movimientos_enemigos[0].h;
}

function minimax(turn) {
  movimientos_enemigos = [];

  var enemy = turn == "1" ? "0" : "1";
  let map;
  let x, y, pos, h;
  movimientos = movimientos.slice(0, 4);
  for (let i = 0; i < movimientos.length; i++) {
    movimientos_enemigos = [];
    map = copy_array();
    pos = movimientos[i].spot;
    y = parseInt(pos.split("")[0]);
    x = parseInt(pos.split("")[1]);
    map[y][x] = turn;
    movimientos_enemigos = [];
    find_enemy_spots(enemy, map);
    h = find_movimientos_enemigos();
    movimientos[i].h = movimientos[i].h - h;
  }

  movimientos.sort((a, b) => {
    if (a.h > b.h) return -1;
    else return 1;
  });
  console.table(movimientos);
}

function find_move(move, rival, x, y, board) {
  var x2 = 0,
    y2 = 0;
  let turno = rival == "1" ? "0" : "1";
  if (move == 0) {
    x2 = x;
    for (y2 = y - 1; y2 > 0; y2--) {
      x2--;
      if (board[y2][x2] == rival && board[y2 - 1][x2 - 1] == "2") {
        return y2 - 1 + "" + (x2 - 1);
      }else if (board[y2][x2] == rival && board[y2 - 1][x2 - 1] == turno)
        return '99'
    }
  } else if (move == 1) {
    x2 = x;
    for (y2 = y - 1; y2 > 0; y2--) {
      if (board[y2][x2] == rival && board[y2 - 1][x2] == "2") {
        return y2 - 1 + "" + x2;
      }else if (board[y2][x2] == rival && board[y2 - 1][x2] == turno)
        return '99'
    }
  } else if (move == 2) {
    x2 = x;
    for (y2 = y - 1; y2 > 0; y2--) {
      x2++;
      if (board[y2][x2] == rival && board[y2 - 1][x2 + 1] == "2") {
        return y2 - 1 + "" + (x2 + 1);
      }else if (board[y2][x2] == rival && board[y2 - 1][x2 + 1] == turno)
        return '99'
    }
  } else if (move == 3) {
    y2 = y;
    for (x2 = x + 1; x2 < 7; x2++) {
      if (board[y2][x2] == rival && board[y2][x2 + 1] == "2") {
        return y2 + "" + (x2 + 1);
      }else if (board[y2][x2] == rival && board[y2][x2 + 1] == turno)
        return '99'
    }
  } else if (move == 4) {
    x2 = x;
    for (y2 = y + 1; y2 < 7; y2++) {
      x2++;
      if (board[y2][x2] == rival && board[y2 + 1][x2 + 1] == "2") {
        return y2 + 1 + "" + (x2 + 1);
      }else if (board[y2][x2] == rival && board[y2 + 1][x2 + 1] == turno)
        return '99';
    }
  } else if (move == 5) {
    x2 = x;
    for (y2 = y + 1; y2 < 7; y2++) {
      if (board[y2][x2] == rival && board[y2 + 1][x2] == "2") {
        return y2 + 1 + "" + x2;
      } else if (board[y2][x2] == rival && board[y2 + 1][x2] == turno)
        return "99";
    }
  } else if (move == 6) {
    x2 = x;
    for (y2 = y + 1; y2 < 7; y2++) {
      x2--;
      if (board[y2][x2] == rival && board[y2 + 1][x2 - 1] == "2") {
        return y2 + 1 + "" + (x2 - 1);
      } else if (board[y2][x2] == rival && board[y2 + 1][x2 - 1] == turno)
        return "99";
    }
  } else if (move == 7) {
    y2 = y;
    for (x2 = x - 1; x2 > 0; x2--) {
      if (board[y2][x2] == rival && board[y2][x2 - 1] == "2") {
        return y2 + "" + (x2 - 1);
      } else if (board[y2][x2] == rival && board[y2][x2 - 1] == turno) 
        return "99";
      
    }
  }
  return "99";
}

function find_spots(turn) {
  let rival = turn == "1" ? "0" : "1";
  let spot;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (tabla[y][x] == turn) {
        if (y - 1 > 0 && x - 1 > 0 && tabla[y - 1][x - 1] == rival) {
          // Arriba a la izq
          spot = find_move(0, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y - 1 > 0 && tabla[y - 1][x] == rival) {
          // Arriba
          spot = find_move(1, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y - 1 > 0 && x + 1 < 7 && tabla[y - 1][x + 1] == rival) {
          // Arriba Derecha
          spot = find_move(2, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (x + 1 < 7 && tabla[y][x + 1] == rival) {
          // Derecha
          spot = find_move(3, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y + 1 < 7 && x + 1 < 7 && tabla[y + 1][x + 1] == rival) {
          // Abajo Derecha
          spot = find_move(4, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y + 1 < 7 && tabla[y + 1][x] == rival) {
          // Abajo
          spot = find_move(5, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y + 1 < 7 && x - 1 > 0 && tabla[y + 1][x - 1] == rival) {
          // Abajo Izq
          spot = find_move(6, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (x - 1 > 0 && tabla[y][x - 1] == rival) {
          // Izquierda
          spot = find_move(7, rival, x, y, tabla);
          if (spot != "99")
            movimientos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
      }
    }
  }
}

function find_enemy_spots(turn, board) {
  let rival = turn == "1" ? "0" : "1";
  let spot;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x] == turn) {
        if (y - 1 > 0 && x - 1 > 0 && board[y - 1][x - 1] == rival) {
          // Arriba a la izq
          spot = find_move(0, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y - 1 > 0 && board[y - 1][x] == rival) {
          // Arriba
          spot = find_move(1, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y - 1 > 0 && x + 1 < 7 && board[y - 1][x + 1] == rival) {
          // Arriba Derecha
          spot = find_move(2, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (x + 1 < 7 && board[y][x + 1] == rival) {
          // Derecha
          spot = find_move(3, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y + 1 < 7 && x + 1 < 7 && board[y + 1][x + 1] == rival) {
          // Abajo Derecha
          spot = find_move(4, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y + 1 < 7 && board[y + 1][x] == rival) {
          // Abajo
          spot = find_move(5, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (y + 1 < 7 && x - 1 > 0 && board[y + 1][x - 1] == rival) {
          // Abajo Izq
          spot = find_move(6, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
        if (x - 1 > 0 && board[y][x - 1] == rival) {
          // Izquierda
          spot = find_move(7, rival, x, y, board);
          if (spot != "99")
            movimientos_enemigos.push({
              spot: spot,
              h: tabla_heuristica[parseInt(spot.split("")[0])][parseInt(spot.split("")[1])],
            });
        }
      }
    }
  }
}

function fill_board(estado) {
  var y = 0,
    x = 0;
  if (estado != undefined) {
    for (let z = 0; z < estado.length; z++) {
      tabla[y][x] = estado[z];
      x++;
      if (x == 8) {
        x = 0;
        y++;
      }
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
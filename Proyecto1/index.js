const express = require('express')
const cors = require('cors');
const port = 5000

const app = express()

app.use(cors())


app.get('/', (req, res) => {
    let { turno, estado } = req.query
    console.log(turno, estado)
    res.send(generar(turno, estado));
})

function generar(turno,matriz){
    
  console.log(matriz)
  var moves = obtenerjugadasperm(matriz,turno)
  console.log(moves)
  //elije posicion al azar
  
  var matrizheuris = [120,-20,20,5,5,20,-20,120,-20,-40,-5,-5,-5,-5,-40,-20,20,-5,15,3,3,15,-5,20,5,-5,3,3,3,3,-5,5,5,-5,3,3,3,3,-5,5,20,-5,15,3,3,15,-5,20,-20,-40,-5,-5,-5,-5,-40,-20,120,-20,20,5,5,20,-20,120];
  var elije = 0;
  var heuris = matrizheuris[moves[0]];
  for(i = 0; i < moves.length; i++){
      console.log(moves[i], matrizheuris[moves[i]])
      if (matrizheuris[moves[i]] > heuris)
      {
          console.log("entro", heuris)
          heuris = matrizheuris[moves[i]];
          console.log("entro", heuris)
          elije = i;
      }
      
  }
  console.log("eligio",heuris)
  console.log(elije)



  //encontrar fila y columna
  var fila = Math.trunc(moves[elije]/8)
  var columna =(moves[elije]%8) 
  console.log(fila,columna)
  var coordenada = fila.toString() + columna.toString();
  return coordenada;
}

function obtenerjugadasperm(matriz,turno){
  var jugadas = [];
  var jugadasposibles = obterposiciones(matriz,turno);
  console.log(jugadasposibles)
  var posi = 0
  var bandera = 0;
  while(posi < jugadasposibles.length){
      var posi2 = 0
      var verifica = verificarjugada(jugadasposibles[posi],matriz,turno)
      while(posi2 < verifica.length){
          if(verifica[posi2]==true){
              jugadas.push(jugadasposibles[posi])
              bandera=1;
          }
          posi2++;
      }
      posi++;
  }
  if(bandera==0){
      return jugadasposibles;
  }
  return jugadas;
}

function obterposiciones(matriz,turno){
 var fila, columna = 0
 var jugadas = [].map(Number)
 //Agregar los espacios al rededor de la ficha de turno
  for ( var i in matriz.map(Number) ){
      if(matriz[i] !=2){
          fila =  Math.trunc(i/8)
          columna = i%8;
          if(columna>0){
              jugadas.push(i - 1)
              if (fila > 0){
                  jugadas.push(i - 9)
              }
              if(fila < 7){
                  jugadas.push(parseInt(i) + 7)
              }
          }
          if(columna<7){
              jugadas.push(parseInt(i)+1)
              if (fila > 0){
                  jugadas.push(i-7)
              }
              if(fila<7){
                  jugadas.push(parseInt(i)+9)
              }
          }
          if(fila>0){
              jugadas.push(i-8)
          }
          if(fila<7){
              jugadas.push(parseInt(i)+8)
          }
      }
  }
  //Elimina los espacios donde ya hay ficha
  var cont = 0;
  var posibles =[]
  while(cont < jugadas.length){
      if(matriz[jugadas[cont]]==2){
          posibles.push(jugadas[cont]);
      }
      cont++;
  }
  
  return posibles;
}

function verificarjugada(posi,matriz,turno){
  var fichaenemiga ;
  if(turno==1){
      fichaenemiga = 0
  }else{
      fichaenemiga = 1
  }

  var eslegal = [false,false,false,false,false,false,false,false]
  if( matriz[posi] != 2){
      return eslegal
  }
  var fila,columna =0;
  fila = Math.trunc(posi/8);
  columna = posi%8;
  var cont = 1;
  var result = 0;
  //Horizontal izq
  if(columna >1){      
      while(cont < parseInt(columna)+1){
          result = verifica(matriz[posi-cont],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[0] =true
              
              break;
          }else{
              break;
          }
          
      }
  }
  //Horizontal der
  if(columna < 6){
      cont = 1
      while(cont < 8-columna){
          result = verifica(matriz[parseInt(posi)+cont],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[1] =true
              
              break;
          }else{
              break;
          }
          
      }
  }
  //Vertical Arriba
  if(fila >1){
      cont=1;
      while(cont < parseInt(fila)+1){
          result = verifica(matriz[posi-cont*8],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[2] = true
              
              break;
          }else{
              break;
          }
          
      }
  }
  //Vertical Abajo
  if(fila < 6){
      cont = 1
      while(cont < 8-columna){
          result = verifica(matriz[parseInt(posi)+cont*8],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[3] = true
              
              break;
          }else{
              break;
          }
          
      }
  }
  //diagonal arriba izq
  var cont = 1;
  if(columna >1 && fila >1){
      while(cont < Math.min(columna,fila)+1){
          result = verifica(matriz[posi-cont*9],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[4] = true
              
              break;
          }else{
              break;
          }
          
      }
  }
  //Diag arriba der
  if(columna < 6 && fila >1){
      cont = 1
      while(cont < Math.min(Math.abs(columna-7),fila)+1){
          result = verifica(matriz[posi-cont*7],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[5] = true
              
              break;
          }else{
              break;
          }
          
      }
  }
  //Diag abajo izq
  var cont = 1;
  if(columna >1 && fila < 6){
      while(cont < Math.min(columna,Math.abs(fila-7))+1){
          result = verifica(matriz[parseInt(posi)+cont*7],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[6] =true
              
              break;
          }else{
              break;
          }
          
      }
  }
  //Diag abajo der
  if(columna < 6 && fila <6){
      cont = 1
      while(cont <Math.min(Math.abs(columna-7),Math.abs(fila-7))+1){
          result = verifica(matriz[parseInt(posi)+cont*9],cont,fichaenemiga);
          if (result == 1){
              cont++;
              continue;
          }else if (result == 2){
              eslegal[7] = true
              
              break;
          }else{
              break;
          }
          
      }
  }
  return eslegal;

}

function verifica(espacio,cont,turno){
  if(espacio == turno){
      return 1;
  }
  else if (espacio == 2){
      return 0;
  }
  else if (cont > 1){
      return 2;
  } 
  return 0;
}
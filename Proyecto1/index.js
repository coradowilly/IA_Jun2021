const express = require('express')
const cors = require('cors');
const port = process.env.PORT || 5000

const app = express()

app.use(cors())

app.get('/', (req, res) => {
    let { turno, estado } = req.query
    var matriz = Array.from(estado).map(Number);
    res.send(generar(turno, matriz));
})

function generar(turno,matriz){
    
    var movimientos = getJugadasPermitidas(matriz,turno)
        
    var heuristica = [120,-20,20,5,5,20,-20,120,-20,-40,-5,-5,-5,-5,-40,-20,20,-5,15,3,3,15,-5,20,5,-5,3,3,3,3,-5,5,5,-5,3,3,3,3,-5,5,20,-5,15,3,3,15,-5,20,-20,-40,-5,-5,-5,-5,-40,-20,120,-20,20,5,5,20,-20,120];
    var valor = heuristica[movimientos[0]];
    var elije = 0;
    for(i = 0; i < movimientos.length; i++){
        if (heuristica[movimientos[i]] > valor)
        {
            valor = heuristica[movimientos[i]];
            elije = i;
        }
        
    }
    
    var fila = Math.trunc(movimientos[elije]/8)
    var columna =(movimientos[elije]%8) 
    console.log('Coordenada:',fila,columna)
    var coordenada = fila.toString() + columna.toString();
    return coordenada;
}

function getJugadasPermitidas(matriz,turno){
    var posicion = 0
    var jugada = getPosiciones(matriz,turno);
    var jugadas = [];
    while(posicion < jugada.length){
        var posicion2 = 0
        var verifica = verificarjugada(jugada[posicion],matriz,turno)
        while(posicion2 < verifica.length){
            if(verifica[posicion2]==true){
                jugadas.push(jugada[posicion])
            }
            posicion2++;
        }
        posicion++;
    }
    return jugadas;
}

function getPosiciones(matriz,turno){
    var fila, columna = 0
    var jugadas = [].map(Number)
    
    
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

function verificarjugada(posicion,matriz,turno){
    var fichaenemiga ;
    if(turno==1){
        fichaenemiga = 0
    }else{
        fichaenemiga = 1
    }
  
    var eslegal = [0,0,0,0,0,0,0,0]
    if( matriz[posicion] != 2){
        return eslegal
    }
    var fila,columna =0;
    fila = Math.trunc(posicion/8);
    columna = posicion%8;
    var cont = 1;
    var result = 0;
    
  
    if(columna >1){      
        while(cont < parseInt(columna)+1){
            result = 0;
            if(matriz[posicion-cont]==fichaenemiga){
                result = 1;
            } else if (matriz[posicion-cont]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[0] =1
                
                break;
            }else{
                break;
            }
            
        }
    }
    
  
    if(columna < 6){
        cont = 1
        while(cont < 8-columna){
            result = 0;
            if(matriz[parseInt(posicion)+cont]==fichaenemiga){
                result = 1;
            } else if (matriz[parseInt(posicion)+cont]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[1] =1
                
                break;
            }else{
                break;
            }
            
        }
    }
    
  
    if(fila >1){
        cont=1;
        while(cont < parseInt(fila)+1){
            result = 0;
            if(matriz[posicion-cont*8]==fichaenemiga){
                result = 1;
            } else if (matriz[posicion-cont*8]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[2] = 1
                
                break;
            }else{
                break;
            }
            
        }
    }
    
  
    if(fila < 6){
        cont = 1
        while(cont < 8-columna){
            result = 0;
            if(matriz[parseInt(posicion)+cont*8]==fichaenemiga){
                result = 1;
            } else if (matriz[parseInt(posicion)+cont*8]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[3] = 1
                
                break;
            }else{
                break;
            }
            
        }
    }
    
  
    var cont = 1;
    if(columna >1 && fila >1){
        while(cont < Math.min(columna,fila)+1){
            result = 0;
            if(matriz[posicion-cont*9]==fichaenemiga){
                result = 1;
            } else if (matriz[posicion-cont*9]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[4] = 1
                
                break;
            }else{
                break;
            }
            
        }
    }
    
  
    if(columna < 6 && fila >1){
        cont = 1
        while(cont < Math.min(Math.abs(columna-7),fila)+1){
            result = 0;
            if(matriz[posicion-cont*7]==fichaenemiga){
                result = 1;
            } else if (matriz[posicion-cont*7]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[5] = 1
                
                break;
            }else{
                break;
            }
            
        }
    }
    
  
    var cont = 1;
    if(columna >1 && fila < 6){
        while(cont < Math.min(columna,Math.abs(fila-7))+1){
            result = 0;
            if(matriz[parseInt(posicion)+cont*7]==fichaenemiga){
                result = 1;
            } else if (matriz[parseInt(posicion)+cont*7]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[6] =1
                
                break;
            }else{
                break;
            }
            
        }
    }
    
  
    if(columna < 6 && fila <6){
        cont = 1
        while(cont <Math.min(Math.abs(columna-7),Math.abs(fila-7))+1){
            result = 0;
            if(matriz[parseInt(posicion)+cont*9]==fichaenemiga){
                result = 1;
            } else if (matriz[parseInt(posicion)+cont*9]==2){
                result = 0;
            } else if (cont>1){
                result =  2;
            } else {
                result =  0;
            }
  
            if (result == 1){
                cont++;
                continue;
            }else if (result == 2){
                eslegal[7] = 1
                break;
            }else{
                break;
            }
            
        }
    }
    return eslegal;
}

app.listen(port, () => {
    console.log(`Server on port ${port}`)
})
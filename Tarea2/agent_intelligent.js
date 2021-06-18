var  recorrido= false;
var states = ["B","Sucio","Sucio"];

function reflex_agent(location, state){
    if (state=="Sucio") return "Limpio";
    else if (location=="A") return "Derecha";
    else if (location=="B") return "Izquierda";
}

function test(states){
       var location = states[0];		
       var state = states[0] == "A" ? states[1] : states[2];
       var action_result = reflex_agent(location, state);
       document.getElementById("algoritmo").innerHTML+="<br> Estado: ".concat(states[1]).concat("/").concat(states[2]).concat("<br>Lugar: ").concat(location).concat(" / Accion: ").concat(action_result);	
       if(states[1]=="Limpio" && states[2]=="Limpio"){
        if(recorrido){
            states = ["A","Sucio","Sucio"];
            recorrido=false;
        }else{ 
            recorrido=true;
            states[1] = "Sucio";
            states[2] = "Sucio";           
        }
    }else if(action_result == "Limpio"){
         if (location == "A") states[1] = "Limpio";
          else if (location == "B") states[2] = "Limpio";
       }
       else if (action_result == "Derecha") states[0] = "B";
       else if (action_result == "Izquierda") states[0] = "A";	
 setTimeout(function(){ test(states); }, 2000);
}

test(states);
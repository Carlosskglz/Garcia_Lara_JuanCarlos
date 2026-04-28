document.querySelector('#p1-input').addEventListener('input', function(){
    this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
});
function problema1(){
    var input = document.querySelector('#p1-input').value;
    var palabras = input.split(' ');
    var palabrasInvertidas = palabras.reverse();
    var resultado = palabrasInvertidas.join(' ');
    
    document.querySelector('#p1-output').textContent = resultado;
}

//______________________________________________________________________________________________
const inputsP2 = document.querySelectorAll('#p2-x1, #p2-x2, #p2-x3, #p2-x4, #p2-x5, #p2-y1, #p2-y2, #p2-y3, #p2-y4, #p2-y5');

inputsP2.forEach(input => {
    input.addEventListener('keydown', function(e) {
        // Bloqueamos la 'e', la 'E', el '+' y el '-' si solo quieres números positivos
        if (['e', 'E', '+'].includes(e.key)) {
            e.preventDefault();
        }
    });
});
function problema2(){
    //primero necesito obtener todos los valores de la tabla
    var p2_x1 = document.querySelector("#p2-x1").value;
    var p2_x2 = document.querySelector('#p2-x2').value;
    var p2_x3 = document.querySelector('#p2-x3').value;
    var p2_x4 = document.querySelector('#p2-x4').value;
    var p2_x5 = document.querySelector('#p2-x5').value;

    //vector 2
    var p2_y1 = document.querySelector('#p2-y1').value;
    var p2_y2 = document.querySelector('#p2-y2').value;
    var p2_y3 = document.querySelector('#p2-y3').value;
    var p2_y4 = document.querySelector('#p2-y4').value;
    var p2_y5 = document.querySelector('#p2-y5').value;

    //creamos los vectores
    var v1 = [p2_x1, p2_x2, p2_x3, p2_x4, p2_x5];
    var v2 = [p2_y1, p2_y2, p2_y3, p2_y4, p2_y5];

    //primero vamos a ordenar los elementos para permutarlos
    v1 = v1.sort(function(a,b){return b-a});
    v2 = v2.sort(function(a,b){return b-a});

    //para hacer la permutacion
    v2 = v2.reverse();

    //para multuplicar necesitamos un for
    var p2_producto = 0;

    for(var i=0; i < v1.length; i++){
        p2_producto += v1[i] * v2[i];
    }
    document.querySelector('#p2-output').textContent = "El producto escalar minimo es de: " + p2_producto;

    
}

//___________________________________________________________________________
document.querySelector('#p3-input').addEventListener('input', function(){
    this.value = this.value.replace(/[^a-zA-ZñÑ,]/g, '');
});

document.querySelector('#p3-input').addEventListener('keydown', function(e){
    if(e.key === ' '){
        e.preventDefault();
    }
});

function problema3(){
    var input = document.querySelector('#p3-input').value;
    var palabras = input.split(',');
    var palabraMasLarga = '';
    var maxCaracteresUnicos = 0;

    palabras.forEach(function(palabra){
        var palabraLimpia = palabra.trim().toUpperCase();
        if(palabraLimpia !== ""){
            var caracteresUnicos = new Set(palabraLimpia).size;
            
            // Si quieres que se quede con la PRIMERA palabra que encontró con ese máximo:
            if(caracteresUnicos > maxCaracteresUnicos){
                maxCaracteresUnicos = caracteresUnicos;
                palabraMasLarga = palabraLimpia;
            }
        }
    });

    document.querySelector('#p3-output').textContent = 
        "La palabra con más caracteres únicos es: " + palabraMasLarga + 
        " (" + maxCaracteresUnicos + " caracteres únicos)";
}

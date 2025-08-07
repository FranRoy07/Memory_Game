// ctr+cierre de llaves hace que se comente la línea

//inicialización de variables
let tarjetasDestapadas = 0; //contador de tarjetas destapadas
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado=null;
let segundoResultado=null;
let movimientos = 0; //contador de movimientos
let aciertos = 0; //contador de aciertos
let temporizador = false; //variable para controlar el temporizador
let timer = 30;
let timerInicial= timer; //variable para guardar el tiempo inicial, para mostrar al final cuánto se demoró el jugador
let tiempoRegresivoId = null; //variable para el temporizador, se usa para detenerlo si es necesario

//apuntando a los elementos del html
let mostrarMovimientos = document.getElementById("movimientos");
let mostrarAciertos = document.getElementById("aciertos");
let mostrarTiempo = document.getElementById("t-restante");

//variables para los sonidos, se usa el constructor Audio() para crear un objeto de audio.
let winAudio = new Audio(`./sounds/win.wav`); //audio de victoria
let loseAudio = new Audio(`./sounds/lose.wav`); //audio de derrota
let clickAudio = new Audio(`./sounds/click.wav`); //audio de clic en las tarjetas
let rightAudio = new Audio(`./sounds/right.wav`); //audio de acierto
let wrongAudio = new Audio(`./sounds/wrong.wav`); //audio de error al destapar tarjetas


//generar array de números aleatorios
let numeros = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];

//el .sort ordena el array aleatoriamente en base a una función que será su parámetro
//crear función que genere números aleatorios "Math.random()", este los hace de 0 a 1, restar por 0,5 para que sea de -0,5 a 0,5 y tome positivos y negativos
numeros=numeros.sort(()=>{return Math.random()-0.5});
console.log(numeros); //verificar que los números se generen aleatoriamente

//Funciones
function contarTiempo() {
    tiempoRegresivoId = setInterval(()=>{
        timer--;
        mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
        if(timer == 0){
            clearInterval(tiempoRegresivoId);
            mostrarTiempo.innerHTML = `¡Se acabó el tiempo!`;
            bloquearTarjetas();
            mostrarFinJuego('¡Se acabó el tiempo!'); // Muestra el modal al acabarse el tiempo
            loseAudio.play(); // Reproduce el sonido de derrota
        }
    }, 1000); //setInterval ejecuta una función cada cierto tiempo, en este caso cada 1000 milisegundos (1 segundo)
}

function bloquearTarjetas(){
    for(let i=0; i<=15; i++){//recorrer todas las tarjetas 
        let tarjetaBloqueada = document.getElementById(i); //obtener el elemento por su id del html
        tarjetaBloqueada.innerHTML = `<img src="./images/${numeros[i]}.png" alt="">`; //mostrar el número en la tarjeta
        tarjetaBloqueada.disabled = true; //deshabilitar el botón de la tarjeta
        //los aciertos y movimientos no se incrementan al finalizar el tiempo, ya que no se puede jugar más.
    } 
}


//funcion principal
function destapar(id){

    if(temporizador == false){
        contarTiempo();
        temporizador = true; //hace que se ejecute una sola vez porque inicialmente está en falso y acá se pone en true
    } 


    tarjetasDestapadas++; //incrementar contador de tarjetas destapadas de a 1
  
    if(tarjetasDestapadas == 1) {
       //Mostrar 1er número
       tarjeta1 = document.getElementById(id); //obtener el elemento por su id del html
       primerResultado=numeros[id]; //guardar el número en una variable
       tarjeta1.innerHTML= `<img src="./images/${primerResultado}.png" alt="">` ; //mostrar imagen en la tarjeta
       //las imagenes deben tener el mismo nombre que los números en el array, por lo tanto números del 1 al 8

         clickAudio.play(); //reproducir el sonido de clic al destapar la tarjeta

       //deshabilitar el primer boton, para que el contador no siga aumentando
       tarjeta1.disabled=true;
    }else if(tarjetasDestapadas == 2) {
        //mostrar 2do número
        tarjeta2 = document.getElementById(id);
        segundoResultado=numeros[id]; //guardar el número en una variable
        tarjeta2.innerHTML= `<img src="./images/${segundoResultado}.png" alt="">`;

        //deshabilitar el segundo botón, para que el contador no siga aumentando
        tarjeta2.disabled=true;

        //aumentar movimientos
        movimientos++;
        // alt+gr para poner las comillas invertidas
        
        mostrarMovimientos.innerHTML =`Movimientos: ${movimientos}`;

        if(primerResultado == segundoResultado){
            //si los números son iguales, reiniciar el contador de tarjetas destapadas
            tarjetasDestapadas = 0;

            //Aumentar aciertos
            aciertos++;
            mostrarAciertos.innerHTML= `Aciertos: ${aciertos}`; // la sintaxis de las comillas invertidas permite insertar variables dentro de un string
            rightAudio.play(); //reproducir el sonido de acierto

            if(aciertos == 8){ //si se aciertan los 8 pares de tarjetas
                winAudio.play(); //reproducir el sonido de victoria
                mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;
                mostrarTiempo.innerHTML = `¡Felicidades! Te demoraste ${timerInicial - timer} segundos`;
                clearInterval(tiempoRegresivoId);
                mostrarMovimientos.innerHTML = `Movimientos totales: ${movimientos}`;
                mostrarFinJuego('¡Ganaste!'); // <-- Cambia aquí
            }

        }else{
            wrongAudio.play(); //reproducir el sonido de error al destapar tarjetas

            //mostrar momentaneamente valores y volver a tapar
            setTimeout(()=>{
                tarjeta1.innerHTML = ' '; //efecto de borrado
                tarjeta2.innerHTML= ' ';
                tarjeta1.disabled=false; //habilitar el primer botón
                tarjeta2.disabled=false; //habilitar el segundo botón
                tarjetasDestapadas = 0; //reiniciar el contador de tarjetas destapadas, y poder elegir otro par de tarjetas
            },800); //esperar 0,8 segundo , está en milisegundos
            // Elimina reiniciarJuego() aquí, no debe reiniciar ni mostrar cartel al fallar
        }

    }
}

function mostrarFinJuego() {
    document.getElementById('modal-fin').style.display = 'none'; // Oculta el modal al finalizar
    setTimeout(() => {
        document.getElementById('modal-fin').style.display = 'flex'; // Muestra el modal después de 8 segundos
        document.getElementById('mensaje-fin').textContent = ''; // No muestra texto extra
        const btn = document.getElementById('btn-reiniciar');
        btn.style.display = 'block'; // Muestra el botón
    }, 5000);
}

function reiniciarJuego() {
    document.getElementById('modal-fin').style.display = 'none';
    location.reload(); // Recarga la página para reiniciar el juego
}

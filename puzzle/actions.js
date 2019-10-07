/**
* Función que se ejecuta al arrastrar el elemento. 
**/
function start(e) {
	e.dataTransfer.effecAllowed = 'move'; // Define el efecto como mover (Es el por defecto)
	e.dataTransfer.setData("Text", e.target.id); // Coje el elemento que se va a mover
	e.target.style.opacity = '0.4'; 
}

/**
* Función que se ejecuta se termina de arrastrar el elemento. 
**/
function end(e){
	e.target.style.opacity = ''; // Restaura la opacidad del elemento			
	e.dataTransfer.clearData("Data");			
}

/**
* Función que se ejecuta cuando un elemento arrastrable entra en el elemento desde del que se llama. 
**/
function enter(e) {
	return true;
}

/**
* Función que se ejecuta cuando un elemento arrastrable esta sobre el elemento desde del que se llama. 
* Devuelve false si el objeto se puede soltar en ese elemento y true en caso contrario.
**/
function over(e) {
	if ((e.target.className == "contenedorPieza") || (e.target.id == "contenedorPiezas")  || (e.target.id == "contenedorPiezas2")  || (e.target.id == "contenedorPiezas3"))
		return false;
	else
	return true;
}
    
/**
* Función que se ejecuta cuando un elemento arrastrable se suelta sobre el elemento desde del que se llama. 
**/
function drop(e){
	e.preventDefault(); // Evita que se ejecute la accion por defecto del elemento soltado.
	var elementoArrastrado = e.dataTransfer.getData("Text");
	e.target.appendChild(document.getElementById(elementoArrastrado)); // Coloca el elemento soltado sobre el elemento desde el que se llamo esta funcion
	comprobarPuzzle();
}

function comprobarPuzzle(){
	if( (document.getElementById('pieza1').parentNode.id=='uno') &&
		(document.getElementById('pieza2').parentNode.id=='dos') &&
		(document.getElementById('pieza3').parentNode.id=='tres') &&
		(document.getElementById('pieza4').parentNode.id=='cuatro')  &&
		(document.getElementById('pieza5').parentNode.id=='cinco') &&
		(document.getElementById('pieza6').parentNode.id=='seis') &&
		(document.getElementById('pieza7').parentNode.id=='siete') &&
		(document.getElementById('pieza8').parentNode.id=='ocho') &&
		(document.getElementById('pieza9').parentNode.id=='nueve') &&
		(document.getElementById('pieza10').parentNode.id=='diez') &&
		(document.getElementById('pieza11').parentNode.id=='once') &&
		(document.getElementById('pieza12').parentNode.id=='doce')  &&
		(document.getElementById('pieza13').parentNode.id=='trece') &&
		(document.getElementById('pieza14').parentNode.id=='catorce') &&
		(document.getElementById('pieza15').parentNode.id=='quince') &&
		(document.getElementById('pieza16').parentNode.id=='dieciseis')
		)
	{
		setTimeout(function() {
			 alert('Felicidades, has logrado completar el diagrama de la Politica de Gobierno Digital');
		}, 800);
					
	}
}

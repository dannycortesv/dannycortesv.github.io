
var modal = document.getElementById("myModal");
var modalbox = document.getElementById("modalbox");
var arrastradoID="";

modalbox.onclick = function() {
  modal.style.display = "none";
  window.location.assign("index.html");
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    window.location.assign("index.html");
  }
}

function comprobarPuzzle(){
	console.log('comprobandoo....');
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
			modal.style.display = "block";
		}, 300);
					
	}
}

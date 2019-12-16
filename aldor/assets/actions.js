const TIME_START=[3,4];
const TIME_360=[7.4, 10.16, 10.3,14];
const TIME_OPEN_BAG=[17,19,21];
const TIME_OPTION1=[24,26, 29, 33, 35, 47.28];
const TIME_OPTION2=[51,53, 56, 59, 62.1, 74.46];
const TIME_OPTION3=[78,80, 83, 86, 89, 101.5];

window.onload = function(){
	setTimeout(function(){ startVideo(); }, 1500);
}

function startVideo(){
	gsap.to('#backvideo', {duration:1, opacity: 1});
	startHome();
	gsap.to("#goback", {duration: 0, scale:0});
	setCssTop("#goback", "10vh");
	setCssTop("#logo", "110vh");
	setEvents();
	if(window.location.hash!=""){
		window.location="";
	} 
}

function setEvents(){
	document.getElementById("zoomfront").addEventListener("click", zoomFrontFn );
	document.getElementById("zoomback").addEventListener("click", zoomBackFn );
	document.getElementById("goback").addEventListener("click", goBack );
	document.getElementById("menu4").addEventListener("click", function(){setMenu(4);});
}

function goBack(){
	window.history.back();
	//(switch) Validar de acuerdo al location.hash y enviar atrá
}

function setCloseModalEvent(){
	setTimeout(function(){ window.onclick = closeAllModals; }, 500);
}

function closeAllModals(){
	document.getElementById("zoomModal").style.display = "none";
	document.getElementById("labelModal").style.display = "none";
	window.onclick=null;
	hideLabel();
}

$(document).ready(function(){
});

window.onpopstate = function(event) {
	console.log(location.hash);
	switch(location.hash){
		case "": startHome(); break;
		case "#home360": view360(); break;
		case "#homeopen": openBag(); break;
		case "#optionview1":openView(3); break;
		case "#optionview2": openView(1); break;
		case "#optionview3": openView(2); break;
		case "#menu1": setMenu(1); break;
		case "#menu2": setMenu(2); break;
		case "#menu3": setMenu(3); break;
		case "#option1": setViewOption(1); break;
		case "#option2": setViewOption(2); break;
		case "#option3": setViewOption(3); break;
	}
}

var newImageUrl;
function zoomBackFn(){
	newImageUrl = 'assets/media/atras.jpg';
	zoomImageBag();
}

function zoomFrontFn(){
	newImageUrl = 'assets/media/frente.jpg';
	zoomImageBag();
}

function zoomImageBag(){
	setCloseModalEvent();
	document.getElementById("imagenzoom").src=newImageUrl;
	document.getElementById("zoomModal").style.display = "block";
	setCssTop("#zoomspan", "4vh");
    $('#zoomspan').trigger('zoom.destroy');
    $('#zoomspan').zoom({url: newImageUrl});
}

function startHome(){
	setGoBack(0);
	setCssTop(".homeoption", "-20vh");
	setCssTop("#optionview1", "-15vh"); setCssTop("#optionview2", "-15vh"); setCssTop("#optionview3", "-15vh");
	playVideoOn(TIME_START[0]);  addVideoEvent(onStopHome);
	setCssTop("#zoomfront", "110vh");
	setCssTop("#zoomback", "110vh");
}

function onStopHome() {
	if(this.currentTime>TIME_START[1]){
		setCssTop(".homeoption", "10vh"); pauseVideoOn(TIME_START[1]); removeVideoEvent(onStopHome);
		setCssTop("#zoomfront", "76vh");
		setCssTop("#zoomback", "110vh");
	}
}

function view360(){
	setGoBack(1);
	setCssTop("#optionview1", "-15vh"); setCssTop("#optionview2", "-15vh"); setCssTop("#optionview3", "-15vh");
	playVideoOn(TIME_360[0]);
	addVideoEvent(on180);
	setCssTop("#zoomfront", "110vh");
	setCssTop("#zoomback", "110vh");
}

function setGoBack(scaleValue){
	gsap.to("#goback", {duration: 0, scale:scaleValue});
}

function on180(){
	if(this.currentTime>TIME_360[1]){
		setCssTop(".homeoption", "10vh");
		pauseVideoOn(TIME_360[2]); removeVideoEvent(on180);
		setCssTop("#zoomback", "76vh");
	}
}

function openBag(){
	setGoBack(1);
	setCssTop(".homeoption", "-20vh"); playVideoOn(TIME_OPEN_BAG[0]); addVideoEvent(onBagButtons);
	gsap.to(".menu", {duration: 0.4, css:{margin: "-20% 0% 0% 30%"}});
	gsap.to(".option", {duration: 0.4, scale:0});
	setCssTop("#zoomfront", "110vh");
	setCssTop("#zoomback", "110vh");
}

function onBagButtons() {
	if(this.currentTime>TIME_OPEN_BAG[1]){
		setCssTop("#optionview1", "18vh"); setCssTop("#optionview2", "15vh"); setCssTop("#optionview3", "18vh");
		removeVideoEvent(onBagButtons); addVideoEvent(onBagStop);
	}
}	

function onBagStop() {
	if(this.currentTime>TIME_OPEN_BAG[2]){
		pauseVideoOn(TIME_OPEN_BAG[2]); removeVideoEvent(onBagStop);
	}
}	

var currentOption=0;

function openView(option){
	removeVideoEvent(onBagButtons); removeVideoEvent(onBagStop); setCssTop(".optionview", "-20vh");
	setNormalMenu();
	hideLabel();

	currentOption=option;
	var stopTime=0;

	switch(option){
		case 1: playVideoOn(TIME_OPTION1[0]); stopTime=TIME_OPTION1[1]; break;
		case 2: playVideoOn(TIME_OPTION2[0]); stopTime=TIME_OPTION2[1]; break;
		case 3: playVideoOn(TIME_OPTION3[0]); stopTime=TIME_OPTION3[1]; break;
	}

	addVideoEvent(onOptionOpened);

	function onOptionOpened() {
		if(this.currentTime>stopTime){ 
			pauseVideoOn(stopTime); removeVideoEvent(onOptionOpened); setOption(option, 0);
			gsap.to(".menu", {duration: 0.8, ease:Strong.easeOut, css:{margin: "2% 0% 0% 30%"}});
			gsap.to(".option", {duration: 0.4, scale:1});
		}
	}	
}

function setViewOption(option){
	removeCurrentVideoEvent();
	hideLabel();
	currentOption=option;
	var stopTime=0;
	switch(option){
		case 1: stopTime=TIME_OPTION1[1]; break;
		case 2: stopTime=TIME_OPTION2[1]; break;
		case 3: stopTime=TIME_OPTION3[1]; break;
	}
	setOption(option); setTimeout(() => {  pauseVideoOn(stopTime); }, 200);
}

function setOption(option, dur=0.5){
	switch(option){
		case 1:
			setBig(1,"#option1", dur); setBig(2,"#option2", dur); setBig(3,"#option3", dur);
		break;
		case 2:
			setBig(2,"#option1", dur); setBig(1,"#option2", dur); setBig(3,"#option3", dur);
		break;
		case 3:
			setBig(3,"#option1", dur); setBig(2,"#option2", dur); setBig(1,"#option3", dur);
		break;
	}
}

function setNormalMenu(){
	gsap.to("#menu1", {duration: 0.4, ease:Strong.easeOut, scale: 1.0}); gsap.to("#menu2", {duration: 0.4, ease:Strong.easeOut, scale: 1.0});
	gsap.to("#menu3", {duration: 0.4, ease:Strong.easeOut, scale: 1.0}); gsap.to("#menu4", {duration: 0.4, ease:Strong.easeOut, scale: 1.0});
}

var stopmenuTime=0;
function setMenu(option){
	setNormalMenu();
	gsap.to("#menu"+option, {duration: 0.4, ease:Strong.easeOut, scale: 1.26}); //gsap.killChildTweensOf("#menu1");

	if(option==4){
		viewLabel();
		return;
	}else{
		hideLabel();
	}

	var nextTime=0;
	switch(option){
		case 1:  
			nextTime=getCurrentTimes()[2]; stopmenuTime=getCurrentTimes()[4];
		break;
		case 2:  
			nextTime=getCurrentTimes()[4]; stopmenuTime=getCurrentTimes()[5];
		break;
		case 3:  
			nextTime=getCurrentTimes()[6]; stopmenuTime=getCurrentTimes()[7];
		break;
		case 4:  
			nextTime=getCurrentTimes()[6]; stopmenuTime=getCurrentTimes()[7];
		break;
	}
	playVideoOn(nextTime);  addVideoEvent(stopMenuOn);
}

function stopMenuOn(){
	if(this.currentTime>stopmenuTime){ 
		removeVideoEvent(stopMenuOn); pauseVideoOn(stopmenuTime); 
	}
}

function getCurrentTimes(){
	switch(currentOption){
		case 1:  return TIME_OPTION1;  break;
		case 2:  return TIME_OPTION2;  break;
		case 3:  return TIME_OPTION3;  break;
	}
}


function setBig(option, id, dur){
	switch(option){
		case 1:
				gsap.to(id, {duration:dur, opacity: -0.2});
				gsap.to(id, {duration: dur+0.1, ease:Strong.easeOut, css:{width:"20%", margin: "0% 0% 0% 40%"}});
		break;
		case 2:
				gsap.to(id, {duration:dur, opacity: 1});
				gsap.to(id, {duration: dur, ease:Strong.easeOut, css:{width:"6%", margin: "0% 0% 0% 75%"}});
		break;
		case 3:
				gsap.to(id, {duration:dur, opacity: 1});
				gsap.to(id, {duration: dur, ease:Strong.easeOut, css:{width:"6%", margin: "0% 0% 0% 83%"}});
		break;
	}
}

var modalOn=false;

function hideLabel(){
	if(modalOn){
		modalOn=false;
		gsap.to("#modalcontent", {duration: 0.3,  ease:Strong.easeIn, scale:0, onComplete:closeAllModals});
		setNormalMenu();
	}
}

function viewLabel(){
	if(!modalOn){
		modalOn=true;
		document.getElementById("labelModal").style.display = "block";
		setCloseModalEvent();

		var imageSRC="";
		switch(currentOption){
			case 1:  imageSRC="assets/media/label1.jpg"; break;
			case 2:  imageSRC="assets/media/label2.jpg"; break;
			case 3:  imageSRC="assets/media/label3.jpg"; break;
		}

		document.getElementById("labelimage").src=imageSRC;

		gsap.to("#modalcontent", {duration: 0, scale:0});
		gsap.to("#modalcontent", {duration: 0.3,  ease:Strong.easeOut, scale:1});
	}
}

// UTILS

function pauseVideoOn(value){
	document.getElementById('backvideo').pause(); document.getElementById('backvideo').currentTime=value;
}

function playVideoOn(value){
	document.getElementById('backvideo').currentTime=value; document.getElementById('backvideo').play();
}

function setCssTop(id, value){
	gsap.to(id, {duration: 0.4, ease:Strong.easeOut, css:{top: value}});
}

var currentVideoFn;

function addVideoEvent(eventFn){
	currentVideoFn=eventFn;
	document.getElementById('backvideo').addEventListener("timeupdate", eventFn);	
}

function removeVideoEvent(eventFn){
	document.getElementById('backvideo').removeEventListener("timeupdate", eventFn);	
}

function removeCurrentVideoEvent(){
	document.getElementById('backvideo').removeEventListener("timeupdate", currentVideoFn);	
}


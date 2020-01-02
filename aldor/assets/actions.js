const TIME_START=[3,4];
const TIME_180=[7.4, 10.16, 10.3,13];
const TIME_OPEN_BAG=[17,19,21];
const TIME_OPTION1=[24,26, 29, 33, 35, 47.28];
const UNWRAP_1=[29, 33, 45.9, 47.4];
const UNWRAP_2=[29, 33, 45.5, 47.5];
const UNWRAP_3=[29, 33, 45.5, 47.5];

const DISCOVER_1=[29, 47.4];
const DISCOVER_2=[29, 47.5];
const DISCOVER_3=[29, 47.5];

const SENSATION_1=[29, 47.4];
const SENSATION_2=[29, 47.5];
const SENSATION_3=[29, 47.5];

const TIME_OPTION2=[51,53, 56, 59, 62.1, 74.46];
const TIME_OPTION3=[78,80, 83, 86, 89, 101.5];

window.onload = function(){
	if(window.location.hash!=""){
		window.location="";
		return;
	} 
	setTimeout(function(){ startVideo(); }, 150);
}

window.onpopstate = function(event) {
	switch(location.hash){
		case "": startHome(); break;
		case "#home180": setGif("home180", "180", "180_O", view180); break;
		case "#homeopen": setGif("homeopen", "open", "open_O", openBag);break;
	}
}

function setEvents(){
	document.getElementById("zoomfront").addEventListener("click", function(){setGif("zoomfront", "zoom", "zoom_O", zoomFrontFn);});
	document.getElementById("zoomback").addEventListener("click", function(){setGif("zoomback", "zoom", "zoom_O", zoomBackFn);});
	document.getElementById("goback").addEventListener("click", goBack );
	document.getElementById("optionview1").addEventListener("click", function(){setGif("optionview1", "circulo", "circulo_O", clickview3);});
	document.getElementById("optionview2").addEventListener("click", function(){setGif("optionview2", "circulo", "circulo_O", clickview1);});
	document.getElementById("optionview3").addEventListener("click", function(){setGif("optionview3", "circulo", "circulo_O", clickview2);});
	document.getElementById("option1").addEventListener("click", function(){setViewOption(1);});
	document.getElementById("option2").addEventListener("click", function(){setViewOption(2);});
	document.getElementById("option3").addEventListener("click", function(){setViewOption(3);});
	document.getElementById("menu1").addEventListener("click", function(){setGif("menu1", "unwrap", "unwrap_O", setMenu1);});
	document.getElementById("menu2").addEventListener("click", function(){setGif("menu2", "discover", "discover_O", setMenu2);});
	document.getElementById("menu3").addEventListener("click", function(){setGif("menu3", "sen", "sen_O", setMenu3);});
	document.getElementById("menu4").addEventListener("click", function(){setGif("menu4", "view-label", "view-label_O", setMenu4);});
}

function setMenu1(){ setMenu(1);} function setMenu2(){ setMenu(2);} function setMenu3(){ setMenu(3);} function setMenu4(){ setMenu(4);}

function startVideo(){
	gsap.to('#backvideo', {duration:1, opacity: 1});
	startHome();
	gsap.to("#goback", {duration: 0, scale:0});
	setCssTop("#goback", "10vh");
	setCssTop("#logo", "110vh");
	setEvents();
}

function goBack(){
	setGif("goback", "back", "back_O", goBackAction);
}

function goBackAction(){
	switch(window.location.hash){
		case "#home180":
				window.location.hash=""; 
				break;
		case "#homeopen":
			window.location.hash="";
			break;
		default:
			window.location.hash="#homeopen";
		break;
	}
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
	console.log('zoom to '+newImageUrl);
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
		setCssTop(".homeoption", "5vh"); pauseVideoOn(TIME_START[1]); removeVideoEvent(onStopHome);
		setCssTop("#zoomfront", "70vh");
		setCssTop("#zoomback", "110vh");
	}
}

function setGif(id, gif, gif2, fn){
	document.getElementById(id).src="buttons/"+gif2+".gif";
	setTimeout(fn, 1000);
	setTimeout(() => {  document.getElementById(id).src="buttons/"+gif+".gif"; }, 2000);
}

var b180 = false;
function view180(){
	if(!b180){
		setCssTop("#optionview1", "-15vh"); setCssTop("#optionview2", "-15vh"); setCssTop("#optionview3", "-15vh");
		playVideoOn(TIME_180[0]);
		addVideoEvent(on180);
	}else{
		playVideoOn(TIME_180[1]);
		addVideoEvent(to0);
	}
	b180=!b180;
	setCssTop(".homeoption", "-20vh");
	setCssTop("#zoomfront", "110vh");
	setCssTop("#zoomback", "110vh");
}

function to0(){
	if(this.currentTime>TIME_180[3]){
		pauseVideoOn(TIME_180[3]); removeVideoEvent(to0);
		setCssTop("#homeopen", "5vh");
		setCssTop("#zoomfront", "70vh");
		setCssTop("#home180", "5vh");
	}
}

function setGoBack(scaleValue){
	gsap.to("#goback", {duration: 0, scale:scaleValue});
}

function on180(){
	if(this.currentTime>TIME_180[1]){
		pauseVideoOn(TIME_180[2]); removeVideoEvent(on180);
		setCssTop("#zoomback", "70vh");
		setCssTop("#home180", "5vh");
	}
}

function openBag(){
	removeVideoEvent(on180);
	setGoBack(1);
	setCssTop(".homeoption", "-20vh"); playVideoOn(TIME_OPEN_BAG[0]); addVideoEvent(onBagButtons);
	gsap.to(".menuitem", {duration: 0.4, css:{width:"0vh"}});
	gsap.to(".option", {duration: 0.4, scale:0});
	setCssTop("#zoomfront", "110vh");
	setCssTop("#zoomback", "110vh");
}

function onBagButtons() {
	if(this.currentTime>TIME_OPEN_BAG[1]){
		setCssTop("#optionview1", "68vh"); setCssTop("#optionview2", "62vh"); setCssTop("#optionview3", "68vh");
		removeVideoEvent(onBagButtons); addVideoEvent(onBagStop);
	}
}	

function onBagStop() {
	if(this.currentTime>TIME_OPEN_BAG[2]){
		pauseVideoOn(TIME_OPEN_BAG[2]); removeVideoEvent(onBagStop);
	}
}	

var currentOption=0;

function clickview1(){ openView(1);} function clickview2(){ openView(2);} function clickview3(){ openView(3);}

function openView(option){
	window.location.hash="#onview";

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

	setOption(option, 0);

	addVideoEvent(onOptionOpened);

	function onOptionOpened() {
		if(this.currentTime>stopTime){ 
			removeVideoEvent(onOptionOpened); 
			pauseVideoOn(stopTime);
			gsap.to(".menuitem", {duration: 0.2, css:{width:"20vh"}});
			setOption(option, 0.6);
			gsap.to(".option", {duration: 0.2, scale:1});
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

function hideOptions(){
	gsap.to(".menuitem", {duration: 0.4, css:{width:"0vh"}});
	gsap.to(".option", {duration: 0.4, scale:0});
	setGoBack(0);
}

function showeOptions(){
	gsap.to(".menuitem", {duration: 0.4, css:{width:"20vh"}});
	gsap.to(".option", {duration: 0.4, scale:1});
}

var stopmenuTime=0;
var TIMES;
function setMenu(option){
	console.log(option);
	setNormalMenu();
	gsap.to("#menu"+option, {duration: 0.4, ease:Strong.easeOut, scale: 1.26}); //gsap.killChildTweensOf("#menu1");

	if(option==4){
		viewLabel();
		return;
	}else{
		hideLabel();
	}

	hideOptions(); 

	switch(option){
		case 1:  
			switch(currentOption){
				case 1:  TIMES=UNWRAP_1;  break;
				case 2:  TIMES=UNWRAP_2;  break;
				case 3:  TIMES=UNWRAP_3;  break;
			}
			playVideoOn(TIMES[0]);  addVideoEvent(stopPlayUnwrapOn);
		break;
		case 2:  
			switch(currentOption){
				case 1:  TIMES=DISCOVER_1;  break;
				case 2:  TIMES=DISCOVER_2;  break;
				case 3:  TIMES=DISCOVER_3;  break;
			}
			playVideoOn(TIMES[0]);  addVideoEvent(stopDiscover);
		break;
		case 3:  
			switch(currentOption){
				case 1:  TIMES=SENSATION_1;  break;
				case 2:  TIMES=SENSATION_2;  break;
				case 3:  TIMES=SENSATION_3;  break;
			}
			playVideoOn(TIMES[0]);  addVideoEvent(stopSensation);
		break;
	}
}

function stopPlayUnwrapOn(){
	if(this.currentTime>TIMES[1]){ 
		removeVideoEvent(stopPlayUnwrapOn); playVideoOn(TIMES[2]); addVideoEvent(stopUnwrap);
	}
}

function stopUnwrap(){
	if(this.currentTime>TIMES[3]){ 
		removeVideoEvent(stopUnwrap); pauseVideoOn(TIMES[3]); showeOptions();
	}
}

function stopDiscover(){
	if(this.currentTime>TIMES[1]){ 
		removeVideoEvent(stopDiscover); pauseVideoOn(TIMES[1]); showeOptions();
	}
}

function stopSensation(){
	if(this.currentTime>TIMES[1]){ 
		removeVideoEvent(stopSensation); pauseVideoOn(TIMES[1]); showeOptions();
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
	console.log("vielabel "+modalOn);
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
	if(value){
		document.getElementById('backvideo').currentTime=value; document.getElementById('backvideo').play();
	}else{
		console.log("Value is not defined");
		console.log(value);
	}
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


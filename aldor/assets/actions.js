const TIME_START=[3,4];
const TIME_180=[7.4, 10.16, 10.3,14];
const TIME_OPEN_BAG=[17,19,21];
const TIME_OPTION1=[24,26, 29, 33, 35, 47.28];
const TIME_OPTION2=[51,53, 56, 59, 62.1, 74.46];
const TIME_OPTION3=[78,80, 83, 86, 89, 101.5];

window.onload = function(){
	if(window.location.hash!=""){
		window.location="";
		return;
	} 
	setTimeout(function(){ startVideo(); }, 1500);
}

window.onpopstate = function(event) {
	switch(location.hash){
		case "": startHome(); break;
		case "#home180": setGif("home180", "180", "180_O", view180); break;
		case "#homeopen": openBag(); break;
	}
}

//setGif("home180", "180", "180_O", view180);
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

var activeButtons = true;
function view180(){
	setGoBack(1);
	setCssTop("#optionview1", "-15vh"); setCssTop("#optionview2", "-15vh"); setCssTop("#optionview3", "-15vh");
	playVideoOn(TIME_180[0]);
	addVideoEvent(on180);
	setCssTop("#zoomfront", "110vh");
	setCssTop("#zoomback", "110vh");
	setCssTop(".homeoption", "-20vh");
	activeButtons=false;
}

function setGoBack(scaleValue){
	gsap.to("#goback", {duration: 0, scale:scaleValue});
}

function on180(){
	if(this.currentTime>TIME_180[1]){
		activeButtons=true;
		pauseVideoOn(TIME_180[2]); removeVideoEvent(on180);
		setCssTop("#zoomback", "70vh");
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
		setCssTop("#optionview1", "46vh"); setCssTop("#optionview2", "37vh"); setCssTop("#optionview3", "45vh");
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


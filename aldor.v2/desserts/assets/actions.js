const TIME_START=[0.01,7.4];
const TIME_180=[7.4, 10.06, 10.2,13];
const TIME_OPEN_BAG=[13.2,18,18];
const TIME_BACK_HOME=[109.4, 114];

const ON_SELECT_1=23;
const ON_SELECT_2=52.5;
const ON_SELECT_3=83;

const SELECT_1=[20.8, ON_SELECT_1];
const SELECT_2=[50, ON_SELECT_2];
const SELECT_3=[80, ON_SELECT_3];

const ON_RETURN_1=45.5;
const ON_RETURN_2=74.8;
const ON_RETURN_3=104.3;

const GO_BAG_1=[ON_RETURN_1, 47.4];
const GO_BAG_2=[ON_RETURN_2, 77];
const GO_BAG_3=[ON_RETURN_3, 106.8];

const ON_UNWWRAP_1=26.5;
const ON_UNWWRAP_2=56;
const ON_UNWWRAP_3=85.4;

const ON_UNWWRAP_2_1=29.5;
const ON_UNWWRAP_2_2=59;
const ON_UNWWRAP_2_3=89;

const ON_UNWWRAP_3_1=42.6;
const ON_UNWWRAP_3_2=72.2;
const ON_UNWWRAP_3_3=101.7;

const UNWRAP_1=[ON_UNWWRAP_1, ON_UNWWRAP_2_1, ON_UNWWRAP_3_1, 45, ON_SELECT_1];
const UNWRAP_2=[ON_UNWWRAP_2, ON_UNWWRAP_2_2, ON_UNWWRAP_3_2, 74.4, ON_SELECT_2];
const UNWRAP_3=[ON_UNWWRAP_3, ON_UNWWRAP_2_3, ON_UNWWRAP_3_3, 104, ON_SELECT_3];

const DISCOVER_1=[ON_UNWWRAP_1, 45, ON_SELECT_1];
const DISCOVER_2=[ON_UNWWRAP_2, 74.4, ON_SELECT_2];
const DISCOVER_3=[ON_UNWWRAP_3, 104, ON_SELECT_3];

const SENSATION_1=[ON_UNWWRAP_1, ON_UNWWRAP_2_1, 53, ON_RETURN_1, ON_SELECT_1];
const SENSATION_2=[ON_UNWWRAP_2, ON_UNWWRAP_2_2, 105, ON_RETURN_2, ON_SELECT_2];
const SENSATION_3=[ON_UNWWRAP_3, ON_UNWWRAP_2_3, 152, ON_RETURN_3, ON_SELECT_3];

const SCREEN_HOME="SCREEN_HOME";
const SCREEN_BAG="SCREEN_BAG";
const SCREEN_VIEW="SCREEN_VIEW";
var activeScreen="";

window.onload = function(){
	if(window.location.hash!=""){
		window.location="";
		return;
	} 
	setTimeout(function(){ startVideo(); }, 4000);
	startItems();
}

function startItems(){
	startItem(".buttonzoom"); startItem(".homeoption");
	startItem(".optionview"); startItem(".option");
	startItem(".menuitem"); startItem("#goback");
	startItem("#start");
}

function setEvents(){
	document.addEventListener("click", freezeClicFn, true);
	document.getElementById("home180").addEventListener("click", function(){setGif("home180", "180", "180_O", view180);});
	document.getElementById("homeopen").addEventListener("click", function(){setGif("homeopen", "open", "open_O", openBag);});
	document.getElementById("zoomfront").addEventListener("click", function(){setGif("zoomfront", "zoom", "zoom_O", zoomFrontFn);});
	document.getElementById("zoomback").addEventListener("click", function(){setGif("zoomback", "zoom", "zoom_O", zoomBackFn);});
	document.getElementById("goback").addEventListener("click", function(){setGif("goback", "back", "back_O", goBackAction);});
	document.getElementById("optionview1").addEventListener("click", function(){setGif("optionview1", "circulo", "circulo_O", clickview3);});
	document.getElementById("optionview2").addEventListener("click", function(){setGif("optionview2", "circulo", "circulo_O", clickview1);});
	document.getElementById("optionview3").addEventListener("click", function(){setGif("optionview3", "circulo", "circulo_O", clickview2);});
	document.getElementById("option1").addEventListener("click", function(){setViewOption(1);});
	document.getElementById("option2").addEventListener("click", function(){setViewOption(2);});
	document.getElementById("option3").addEventListener("click", function(){setViewOption(3);});
	document.getElementById("menu1").addEventListener("click", function(){setGif("menu1", "unwrap", "unwrap_O", setMenu1);});
	document.getElementById("menu2").addEventListener("click", function(){setGif("menu2", "discover", "discover_O", setMenu2);});
	document.getElementById("menu4").addEventListener("click", function(){setGif("menu4", "view-label", "view-label_O", setMenu4);});
	document.getElementById("start").addEventListener("click", function(){startVideoOn();});
}

let freezeClic = false;
function freezeClicFn(e) {
	if(freezeClic){
		e.stopPropagation();
		e.preventDefault();
	}
}

function setFreeze(value){
	if(value){
		freezeClic=true;
	}else{
		freezeClic=false;
	}
}

function setMenu1(){ setMenu(1);} function setMenu2(){ setMenu(2);} function setMenu3(){ setMenu(3);} function setMenu4(){ setMenu(4);}


function startVideo(){
	setEvents();
	gsap.to('#logo', {duration:0.4, opacity: 0});
	setTimeout(() => {  
		show("#start"); 
	}, 600);
}

function startVideoOn(){
	setFreeze(true);
	gsap.to('#backvideo', {duration:1, opacity: 1});
	hide("#start");
	startHome();
	setGoBack(0)
}

function goBackAction(){
	switch(activeScreen){
		case SCREEN_BAG:
			playVideoOn(TIME_BACK_HOME[0]);  addVideoEvent(onStopBackHome);
			setFreeze(true);
			startHomeBase();
		startHomeBase();
		default:
			backOpenBag();
			setGoBack(0);
		break;
	}
}

function onStopBackHome() {
	if(this.currentTime>=TIME_BACK_HOME[1]){
		onStopHomeAnimations();
		pauseVideoOn(TIME_BACK_HOME[1]); removeVideoEvent(onStopBackHome);
		setFreeze(false);
	}
}

var startTimeGB;
var stopTimeGB;

function backOpenBag(){
	baseopenBag();

	switch(currentOption){
		case 1:  startTimeGB=GO_BAG_1[0]; stopTimeGB=GO_BAG_1[1];  break;
		case 2:  startTimeGB=GO_BAG_2[0]; stopTimeGB=GO_BAG_2[1];  break;
		case 3:  startTimeGB=GO_BAG_3[0]; stopTimeGB=GO_BAG_3[1];  break;
	}

	playVideoOn(startTimeGB);  addVideoEvent(onStopGoBag);
}

function onStopGoBag() {
	if(this.currentTime>=stopTimeGB){
		pauseVideoOn(stopTimeGB); removeVideoEvent(onStopGoBag);
		onStopBagAnimations();
		setGoBack(1);
		setFreeze(false);
	}
}

var newImageUrl;
function zoomBackFn(){
	newImageUrl = 'assets/media/atras.png';
	zoomImageBag();
}

function zoomFrontFn(){
	newImageUrl = 'assets/media/frente.png';
	zoomImageBag();
}

function zoomImageBag(){
	setFreeze(false);
	setTimeout(function(){ window.onclick = closeZoomModal; }, 500);
	document.getElementById("imagenzoom").src=newImageUrl;
	document.getElementById("zoomModal").style.display = "block";
	$('#zoomspan').trigger('zoom.destroy');
	$('#zoomspan').zoom({url: newImageUrl});
}

function closeZoomModal(){
	document.getElementById("zoomModal").style.display = "none";
	window.onclick=null;
}

function startHomeBase(){
	activeScreen=SCREEN_HOME;
	setGoBack(0);
	hide(".homeoption");
	hide(".optionview");
}

function startHome(){
	startHomeBase();
	playVideoOn(TIME_START[0]);  addVideoEvent(onStopHome); 
	changeColor("#dddddd", 1, 5000);
	setTimeout(() => {  
		setFreeze(false);
		gsap.to('body', {duration:1, "background-image":"none"});
	}, 4000);
}

function onStopHomeAnimations(){
	hide("#logo");
	show(".homeoption"); 
	show("#zoomfront");
	hide("#zoomback");
	changeColor("#dddddd",1,100);
}

function changeColor(color, dur, delay){
	setTimeout(() => {  
		gsap.to('body', {duration:dur, "background-color":color});
	}, delay);
}

function onStopHome() {
	if(this.currentTime>TIME_START[1]){
		pauseVideoOn(TIME_START[1]); removeVideoEvent(onStopHome); onStopHomeAnimations();
	}
}

function setGif(id, gif, gif2, fn){
	setFreeze(true);
	document.getElementById(id).src="buttons/"+gif2+".gif";
	setTimeout(fn, 1000);
	setTimeout(() => {  document.getElementById(id).src="buttons/"+gif+".gif"; }, 2000);
}

var b180 = false;
function view180(){
	if(!b180){
		hide(".optionview");
		playVideoOn(TIME_180[0]);
		addVideoEvent(on180);
	}else{
		playVideoOn(TIME_180[2]);
		addVideoEvent(to0);
	}
	b180=!b180;
	hide(".homeoption");
	hide("#zoomfront");
	hide("#zoomback");
}

function to0(){
	if(this.currentTime>TIME_180[3]){
		pauseVideoOn(TIME_180[3]); removeVideoEvent(to0);
		show("#homeopen");
		show("#zoomfront");
		show("#home180");
		setFreeze(false);
	}
}

function setGoBack(scaleValue){
	gsap.to("#goback", {duration: 0, scale:scaleValue});
}

function on180(){
	if(this.currentTime>TIME_180[1]){
		pauseVideoOn(TIME_180[2]); removeVideoEvent(on180);
		show("#zoomback");
		show("#home180");
		setFreeze(false);
	}
}

function openBag(){
	removeVideoEvent(on180);
	baseopenBag();
	playVideoOn(TIME_OPEN_BAG[0]); addVideoEvent(onBagButtons);
}

function baseopenBag(){
	changeColor("#ffffff",2, 1000);
	activeScreen=SCREEN_BAG;
	hide(".homeoption"); 
	hide(".menuitem");
	hide(".option");
	hide("#zoomfront");
	hide("#zoomback");
}

function onBagButtons() {
	if(this.currentTime>TIME_OPEN_BAG[1]){
		removeVideoEvent(onBagButtons); addVideoEvent(onBagStop);
	}
}	

function onStopBagAnimations(){
	show(".optionview");
}

function onBagStop() {
	if(this.currentTime>TIME_OPEN_BAG[2]){
		pauseVideoOn(TIME_OPEN_BAG[2]); removeVideoEvent(onBagStop);
		onStopBagAnimations(); 
		setFreeze(false);
		setGoBack(1);
	}
}	

var currentOption=0;

function clickview1(){ openView(1);} function clickview2(){ openView(2);} function clickview3(){ openView(3);}

function openView(option){
	activeScreen=SCREEN_VIEW;
	removeVideoEvent(onBagButtons); removeVideoEvent(onBagStop); hide(".optionview");
	
	currentOption=option;
	var stopTime=0;

	switch(option){
		case 1: playVideoOn(SELECT_1[0]); stopTime=SELECT_1[1]; changeColor("#423519",2, 10);  break;
		case 2: playVideoOn(SELECT_2[0]); stopTime=SELECT_2[1]; changeColor("#14931b",2, 10); break;
		case 3: playVideoOn(SELECT_3[0]); stopTime=SELECT_3[1]; changeColor("#e7c256",2, 10); break;
	}

	setOption(option, 0);

	addVideoEvent(onOptionOpened);

	function onOptionOpened() {
		if(this.currentTime>stopTime){ 
			setFreeze(false);
			removeVideoEvent(onOptionOpened); 
			pauseVideoOn(stopTime);
			show(".menuitem");
			setOption(option, 0.6);
			show(".option");
		}
	}	
}

function setViewOption(option){
	setFreeze(true);
	removeCurrentVideoEvent();
	currentOption=option;
	switch(option){
		case 1: setGif("option1", "p1", "ps1", setViewOptionGo); break;
		case 2: setGif("option2", "p2", "ps2", setViewOptionGo);  break;
		case 3: setGif("option3", "p3", "ps3", setViewOptionGo); break;
	}
}


function setViewOptionGo(){
	var stopTime=0;
	switch(currentOption){
		case 1: stopTime=SELECT_1[1]; changeColor("#423519",0.5, 300);  break;
		case 2: stopTime=SELECT_2[1]; changeColor("#14931b",0.5, 300);  break;
		case 3: stopTime=SELECT_3[1]; changeColor("#e7c256",0.5, 300);  break;
	}

	setOption(currentOption); setTimeout(() => {  pauseVideoOn(stopTime); setFreeze(false); }, 200);
}

var optinDur;
function setOption(option, dur=0.5){
	optinDur=dur;
	switch(option){
		case 1:
			setBig(1,"#option1", optinDur); setBig(2,"#option2", optinDur); setBig(3,"#option3", optinDur);
		break;
		case 2:
			setBig(2,"#option1", optinDur); setBig(1,"#option2", optinDur); setBig(3,"#option3", optinDur);
		break;
		case 3:
			setBig(3,"#option1", optinDur); setBig(2,"#option2", optinDur); setBig(1,"#option3", optinDur);
		break;
	}
}

function hideOptions(){
	hide(".option");
	hide(".menuitem");
	setGoBack(0);
}

function showeOptions(){
	show(".menuitem");
	show(".option");
	setFreeze(false);
}

var stopmenuTime=0;
var TIMES;
function setMenu(option){
	if(option==4){
		viewLabel();
		return;
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
		removeVideoEvent(stopUnwrap); pauseVideoOn(TIMES[4]); showeOptions(); setGoBack(1);
	}
}

function stopDiscover(){
	if(this.currentTime>TIMES[1]){ 
		removeVideoEvent(stopDiscover); pauseVideoOn(TIMES[2]); showeOptions(); setGoBack(1);
	}
}

function stopSensation(){
	if(this.currentTime>TIMES[1]){ 
		removeVideoEvent(stopSensation); playVideoOn(TIMES[2]); addVideoEvent(stopSensation2);
	}
}

function stopSensation2(){
	if(this.currentTime>TIMES[3]){ 
		removeVideoEvent(stopSensation2); pauseVideoOn(TIMES[4]); showeOptions(); setGoBack(1);
	}
}

function setBig(option, id, dur){
	switch(option){
		case 1:
				gsap.to(id, {duration:dur, opacity: -0.2});
				gsap.to(id, {duration: dur+0.1, ease:Strong.easeOut, css:{width:"0%", margin: "-100% 0% 0% 0%"}});
		break;
		case 2:
				gsap.to(id, {duration:dur, opacity: 1});
				gsap.to(id, {duration: dur, ease:Strong.easeOut, css:{width:"6%", margin: "0% 0% 0% 70%"}});
		break;
		case 3:
				gsap.to(id, {duration:dur, opacity: 1});
				gsap.to(id, {duration: dur, ease:Strong.easeOut, css:{width:"6%", margin: "0% 0% 0% 80%"}});
		break;
	}
}

function hideLabel(){
	gsap.to("#modalcontent", {duration: 0.3,  ease:Strong.easeIn, scale:0, onComplete:closeLabelModal});
	window.onclick=null;
}

function closeLabelModal(){
	document.getElementById("labelModal").style.display = "none";
}

function viewLabel(){
	document.getElementById("labelModal").style.display = "block";
	setTimeout(function(){ window.onclick = closeLModal; }, 500);

	var imageSRC="";
	switch(currentOption){
		case 1:  imageSRC="assets/media/label1.png"; break;
		case 2:  imageSRC="assets/media/label2.png"; break;
		case 3:  imageSRC="assets/media/label3.png"; break;
	}

	document.getElementById("labelimage").src=imageSRC;

	gsap.to("#modalcontent", {duration: 0, scale:0});
	gsap.to("#modalcontent", {duration: 0.3,  ease:Strong.easeOut, scale:1});

	setFreeze(false);
}

function closeLModal(){ hideLabel(); }

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

function scaleItem(id, value, dur){
	gsap.to(id, dur, {scaleX: value, scaleY: value, transformOrigin: "50% 50%"});
}

function startItem(id){
	scaleItem(id,0,0);
	gsap.to(id, {duration:0, opacity: 1});
}

function show(id){
	scaleItem(id,1,0.4);
}

function hide(id){
	scaleItem(id,0,0.4);
}
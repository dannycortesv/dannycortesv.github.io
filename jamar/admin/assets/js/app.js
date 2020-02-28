class App {

  
  static init(fromLogin=false) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var uid = user.uid;
        if(fromLogin){
          if(email=="jamareducation@gmail.com"){
            window.location.href = 'admin/index.html';
          }else{
            window.location.href = 'curso.html';
          }
        }else{
          if(email!="jamareducation@gmail.com"){
            window.location.href = '../index.html';
          }
        }
      }else{
        if(!fromLogin){
          window.location.href = '../index.html';
        }             
      } 
    });
  }

  static setLevelScroll(){
    var elmnt = document.getElementById("nivel");
    if(elmnt){
      elmnt.scrollIntoView();
    }
  }

  static setLevelUI(levelID, scroll=1){
   
    if(levelID){
      window.location.hash = '#'+levelID;
    }

    App.setLevelScroll();

    setLevel();

    var levelsRef = firebase.database().ref('niveles/'+levelID);
    levelsRef.on('value', function(snapshot) {
      sessionStorage.setItem(levelID, JSON.stringify(snapshot.val()));
      setLevel();
    });

    function setLevel(){
      var obj=JSON.parse(sessionStorage.getItem(levelID));
      if(obj){
        document.getElementById('titulonivel').innerHTML=obj.name;
        document.getElementById('descripcionivel').innerHTML=obj.descripcion;
        if(obj.documentos){
          var documentos=obj.documentos;
          var itemsd='<div class="row">';
          var index=-1;
          for(var key in documentos) {
              index++;
              if(index % 4==0){
                itemsd+='<div class="row">'
              }
  
              itemsd+='<div class="col-md-3 col-sm-6"> <div class="service box lightblue wow fadeInUp" data-wow-delay="1s"> <div class="service-header"> <span class="service-icon lightbluebg"><i class="fa fa-file"></i></span> <h2>'
              itemsd+=documentos[key].name+'</h2> </div> <p>'+documentos[key].descripcion+'</p> <br/> <a href="https://firebasestorage.googleapis.com/v0/b/jamar-23d18.appspot.com/o/documents%2F';
              itemsd+=documentos[key].file+'?alt=media" class="btn btn-lightblue" title="Descargar" target="_blank">Descargar</a> </div> </div>';
              
              if(index % 4==3){
                itemsd+='</div>';
              }
          }
          if(index % 4!=3){
            itemsd+='</div>'
          }
          document.getElementById('documentos').innerHTML=itemsd;
          document.getElementById('topdocuments').innerHTML="";
        }else{
          document.getElementById('documentos').innerHTML="";
          document.getElementById('topdocuments').innerHTML="No hay documentos aún";
        }
        if(obj.videos){
          var videos=obj.videos;
          var itemsv='<div class="row">';
          var indexv=-1;
          for(var key in videos) {
            indexv++;
            if(indexv % 4==0){
              itemsv+='<div class="row">'
            }

            itemsv+='<div class="col-md-3 col-sm-6"> <div class="service box red wow fadeInUp" data-wow-delay="1s"> <div class="service-header"><h2>'
            itemsv+=videos[key].name+'</h2> </div> <p>'+videos[key].descripcion+'</p> <br/>';

            var titleS='"'+videos[key].name+'"';
            var descS='"'+videos[key].descripcion+'"';
            var yidS='"'+videos[key].youtubeid+'"';

            itemsv+="<a href='javascript:App.openModal("+titleS+","+descS+","+yidS+")'";

            itemsv+='title="Reproducir">  <span class="service-icon redbg"><i class="fa fa-play"></i></span></a> </div> </div>';
            
            if(itemsv % 4==3){
              itemsv+='</div>';
            }
        }
        if(itemsv % 4!=3){
          itemsv+='</div>'
        }
        document.getElementById('videos').innerHTML=itemsv;
        document.getElementById('topvideodescripcion').innerHTML="";
        }else{
          document.getElementById('videos').innerHTML="";
          document.getElementById('topvideodescripcion').innerHTML="No hay videos aún";
        }
      }
    }
  }

  static openModal(title, descripcion, youtubeid){
    document.getElementById('myModalLabel4').innerHTML=title;
    document.getElementById('videodescripcion').innerHTML=descripcion;
    document.getElementById('videoiframe').src='https://www.youtube.com/embed/'+youtubeid+'?autoplay=0&fs=0&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0';
    $('#modalvideo').modal({show:true});
  }

  static setMenuLevels(cursoID){
    setLevels();

    var levelsRef = firebase.database().ref('cursos/'+cursoID+'/niveles');
    levelsRef.on('value', function(snapshot) {
      sessionStorage.setItem("levelsdata", JSON.stringify(snapshot.val()));
      setLevels();
    });

    function setLevels(){
      var obj=JSON.parse(sessionStorage.getItem("levelsdata"));
      var items="";
      var firstID;
      for(var key in obj) {
        // <li class="active"><a href="#home">Inicio</a></li>
          var itemKey="'"+key+"'";
          if(!firstID){
            firstID=key;
          }
          //var itemName="'"+App.getHasVar(obj[key].name)+"'";

          if(window.location.href.indexOf('curso.html')>=0){
            items+='<li><a href="javascript:App.setLevelUI('+itemKey+')">'+obj[key].name+'</a></li>';
          }else{
            items+='<li><a href="curso.html#'+key+'">'+obj[key].name+'</a></li>';
          }
      }

      items+='<li><a href="javascript:App.closesession()"><i class="fa fa-sign-out"></i></a></li>';
      document.getElementById('topmenu').innerHTML=items;

      if(window.location.href.indexOf('curso.html')>=0){
        if(App.getHash()){
          App.setLevelUI(App.getHash());
        }else{
          App.setLevelUI(firstID, 2);
        }
      }
       
    }
  }

  static getHasVar(str){
    str = str.replace(/\s/g, '');
    return str;
  }

  static getHash(){
   return window.location.hash.split('#')[1];
  }

  static gotoCertificado(){
    if(App.getHash()){
      window.location.href = 'certificado.html?#'+App.getHash();
    }
  }

  static gotoEvaluacion(){
    if(App.getHash()){
      window.location.href = 'evaluacion.html?#'+App.getHash();
    }
  }

  static initCurso() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var uid = user.uid;

        if(email=="jamareducation@gmail.com"){
          window.location.href = '../index.html';
        }

        setItems();

        var usersRef = firebase.database().ref('users/'+uid);
        usersRef.on('value', function(snapshot) {

          if(App.getHash()){
            var path='users/'+uid+'/'+App.getHash();
            console.log('path '+path);
            var checkRef = firebase.database().ref(path);

            checkRef.on('value', function(snt) {
              if(snt.val()!=null){
                document.getElementById('certificadolink').innerHTML='<a href="javascript:App.gotoCertificado()" class="btn btn-lg btn-lightblue ">DESCARGAR CERTIFICADO</a>';
              }
            });
          }

          App.setMenuLevels(snapshot.val().cursoid);
          sessionStorage.setItem("userdata", JSON.stringify(snapshot.val()));
          setItems();
        });
        function setItems(){
          var obj=JSON.parse(sessionStorage.getItem("userdata"));
          if(obj){
            document.getElementById('cursoname').innerHTML=obj.curso;
            document.getElementById('cursonamemobile').innerHTML=obj.curso;
            document.getElementById('descripcioncurso').innerHTML=obj.descripcioncurso;
            document.getElementById('descripcioncursomobile').innerHTML=obj.descripcioncurso;
            App.startHome();
          }
        }
      }else{
        window.location.href = '../index.html';
      } 
    });
  }

  static respuestas = {}
  static saveResult(name, valor){
    App.respuestas[name]=valor;
    console.log(App.respuestas);
  }

  static loadQuestions(questionsID){

    setItems();

    var questionsRef = firebase.database().ref('niveles/'+questionsID+'/preguntas');
   
    questionsRef.on('value', function(snapshot) {
      sessionStorage.setItem("preguntas"+questionsID, JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("preguntas"+questionsID));
      if(obj){
        var items=""
        for(var key in obj) {
            //var itemKey="'"+key+"'";
            items+='<div> <h6>'+obj[key].pregunta+'</h6> <br>';
            
            if(obj[key].opcion1){
              items+='<div class="radio"><div class="radio"><label> <input type="radio" onclick="App.saveResult(this.name, this.value)" value="1" name="'+key+'">'
              +obj[key].opcion1+'</label> </div>';
            }
            if(obj[key].opcion2){
              items+='<div class="radio"><div class="radio"><label> <input type="radio" onclick="App.saveResult(this.name, this.value)" value="2" name="'+key+'">'
              +obj[key].opcion2+'</label> </div>';
            }
            if(obj[key].opcion3){
              items+='<div class="radio"><div class="radio"><label> <input type="radio" onclick="App.saveResult(this.name, this.value)" value="3" name="'+key+'">'
              +obj[key].opcion3+'</label> </div>';
            }
            if(obj[key].opcion4){
              items+='<div class="radio"><div class="radio"><label> <input type="radio" onclick="App.saveResult(this.name, this.value)" value="4"  name="'+key+'">'
              +obj[key].opcion4+'</label> </div>';
            }
            if(obj[key].opcion5){
              items+='<div class="radio"><div class="radio"><label> <input type="radio" onclick="App.saveResult(this.name, this.value)" value="5"  name="'+key+'">'
              +obj[key].opcion5+'</label> </div>';
            }

            items+='<br><br> </div>';
        }

        //console.log('VALUEESSS  !!!');
        //console.log(items);

        document.getElementById('preguntas').innerHTML=items;
        document.getElementById("responderbtn").style.display = "block"
      }else{
        document.getElementById('preguntas').innerHTML="No hay preguntas definidas aún<br><br>";
        document.getElementById("responderbtn").style.display = "none"
      }
    }
  }


  static printWindow(){
    document.getElementById("responderbtn").style.display = "none";
    window.print();
    document.getElementById("responderbtn").style.display = "block";
  }

  static sendResultsData(){
    //App.getHash();

    var levelID=App.getHash();

    //console.log(App.userID);

    var obj=JSON.parse(sessionStorage.getItem("preguntas"+App.getHash()));

    var ammount=0;
    var ammount2=0;

    for(var key in obj) {
      ammount++;
    }

    for(var key2 in App.respuestas) {
      ammount2++;
    }

    if(ammount==ammount2){
      document.getElementById("enviar").innerHTML = 'Guardando...';
      document.getElementById("enviar").disabled = true;

      for(var key in obj) {
            console.log();
            firebase.database().ref('respuestas/'+App.userID+'/'+levelID+'/'+key).set({
            respuesta: App.respuestas[key],
            correcta: obj[key].respuesta
          });
      }

      firebase.database().ref('users/'+App.userID+'/'+levelID).set({
        ok: "listo"
      });

      setTimeout(function() {
        document.getElementById('preguntas').innerHTML="Tu evaluación ha sido enviada!<br><br>";
        document.getElementById("responderbtn").innerHTML='<button  onclick="javascript:App.gotoCertificado()" class="btn btn-lightblue btn-rounded btn-lg" type="submit" id="enviar">DESCARGAR CERTIFICADO</button>';
        //document.getElementById("responderbtn").style.display = "none"
        }, 3000);
    }else{
      $.gritter.add({
        title: 'OOps!',
        text: 'Hacen falta preguntas por responder',
        class_name: 'color danger',
        time: 800,
      });
    }
    
  }

  static userID;

  static initEvaluacion() {
    if(!App.getHash()){
      window.location.href = 'curso.html';
    }

    setLevel();

    var levelRef = firebase.database().ref('niveles/'+App.getHash());
    
    levelRef.on('value', function(snapshot) {
      sessionStorage.setItem('nivel/'+App.getHash(), JSON.stringify(snapshot.val()));
      setLevel();
    });

    function setLevel(){
      var obj=JSON.parse(sessionStorage.getItem('nivel/'+App.getHash()));
      if(obj){
        document.getElementById('cursoname').innerHTML=obj.curso;
        document.getElementById('nivelname').innerHTML=obj.name;
        document.getElementById('descripcioncurso').innerHTML=obj.descripcion;
      }
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var email = user.email;
        var uid = user.uid;

        App.userID=user.uid;

        if(email=="jamareducation@gmail.com"){
          window.location.href = 'index.html';
        }

        var usersRef = firebase.database().ref('users/'+uid);
       
        usersRef.on('value', function(snapshot) {
          if(App.getHash()){
            var checkRef = firebase.database().ref('users/'+App.userID+'/'+App.getHash());
            checkRef.on('value', function(snt) {
            console.log('liiiiisto '+snt.val());
              if(snt.val()==null){
                App.loadQuestions(App.getHash());
              }else{
                document.getElementById('preguntas').innerHTML="Tu evaluación ha sido enviada!<br><br>";
                document.getElementById("responderbtn").innerHTML='<button  onclick="javascript:App.gotoCertificado()" class="btn btn-lightblue btn-rounded btn-lg" type="submit" id="enviar">DESCARGAR CERTIFICADO</button>';
                //document.getElementById("responderbtn").style.display = "none"
              }
            });
          }
          App.setMenuLevels(snapshot.val().cursoid);
        });
      }else{
        window.location.href = 'index.html';
      } 
    });
  }

  static initCertificado() {
    if(!App.getHash()){
      window.location.href = 'curso.html';
    }

    setLevel();

    var levelRef = firebase.database().ref('niveles/'+App.getHash());
    
    levelRef.on('value', function(snapshot) {
      sessionStorage.setItem('nivel/'+App.getHash(), JSON.stringify(snapshot.val()));
      setLevel();
    });

    function setLevel(){
      var obj=JSON.parse(sessionStorage.getItem('nivel/'+App.getHash()));
      if(obj){
        document.getElementById('cursoname').innerHTML=obj.curso;
        document.getElementById('nivelname').innerHTML=obj.name;
        document.getElementById('descripcioncurso').innerHTML=obj.descripcion;
      }
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var email = user.email;
        var uid = user.uid;
        document.getElementById('username').innerHTML=user.displayName;

        App.userID=user.uid;

        if(email=="jamareducation@gmail.com"){
          window.location.href = 'index.html';
        }

        var usersRef = firebase.database().ref('users/'+uid);
       
        usersRef.on('value', function(snapshot) {
          if(App.getHash()){
            var checkRef = firebase.database().ref('users/'+App.userID+'/'+App.getHash());
            checkRef.on('value', function(snt) {
              if(snt.val()==null){
                window.location.href = 'curso.html#'+App.getHash();
              }else{

                setCalificacion();

                var levelRef = firebase.database().ref('respuestas/'+user.uid+'/'+App.getHash());
                
                levelRef.on('value', function(snapshot) {
                  sessionStorage.setItem('respuestas/'+user.uid+'/'+App.getHash(), JSON.stringify(snapshot.val()));
                  setCalificacion();
                });
            
                function setCalificacion(){
                  var obj=JSON.parse(sessionStorage.getItem('respuestas/'+user.uid+'/'+App.getHash()));
                  if(obj){
                   var total=0;
                   var cal=0;
                   for(var key in obj) {
                     total++;
                     if(obj[key].correcta==parseInt(obj[key].respuesta)){
                      cal++;
                     }
                   }
                   document.getElementById('calificacion').innerHTML=cal+' / '+total;
                  }
                }
              }
            });
          }
        });
      }else{
        window.location.href = 'index.html';
      } 
    });
  }

  static startHome(){
      jQuery('#revslider').revolution({
          delay:9000,
          startwidth: 1140,
          startheight: 600,
          onHoverStop:"true",
          hideThumbs:0,
          lazyLoad:"on",
          navigationType:"none",
          navigationHAlign:"center",
          navigationVAlign:"bottom",
          navigationHOffset:0,
          navigationVOffset:20,
          soloArrowLeftHalign:"left",
          soloArrowLeftValign:"center",
          soloArrowLeftHOffset:0,
          soloArrowLeftVOffset:0,
          soloArrowRightHalign:"right",
          soloArrowRightValign:"center",
          soloArrowRightHOffset:0,
          soloArrowRightVOffset:0,
          touchenabled:"on",
          stopAtSlide:-1,
          stopAfterLoops:-1,
          dottedOverlay:"none",
          spinned:"spinner5",
          shadow:0,
          hideTimerBar: "on",
          fullWidth:"off",
          fullScreen:"on",
          navigationStyle:"preview3"
        });
  }
  

  static closesession(){
      firebase.auth().signOut().then(function() {
      }).catch(function(error) {
          console.log(error);
      });
  }

  static logIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          $.gritter.add({
            title: 'Oops!',
            text: 'Contaseña errada',
            class_name: 'color danger',
            time: 800,
          });
        } else {
          alert(errorMessage);
        }
        console.log(error);
        document.getElementById('quickstart-sign-in').disabled = false;
      });
  }

  static utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
  }
  
  static b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
  }

  static notification(title, text, color){
    //success info warning danger alt1 alt2 alt3 dark
    $.gritter.add({
      title: title,
      text: text,
      class_name: 'color '+color,
      time: 800,
    });
  }

  static readUsers(){
    setItems();

    var usersRef = firebase.database().ref('users/');
    usersRef.on('value', function(snapshot) {
      sessionStorage.setItem("users", JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("users"));
      var items="";
      for(var key in obj) {
          items+='<tr><td>'+obj[key].name+'</td>'+'<td>'+obj[key].email+'</td>'+'<td>'+obj[key].curso+'</td>';
          var itemKey="'"+key+"'";
          items+='<td><a href="javascript:App.deleteUser('+itemKey+');"> <span class="icon s7-trash"></span></a></td><tr>';
      }
      document.getElementById('listitems').innerHTML=items;
    }
  }

  static readCursos(){
    setItems();

    var usersRef = firebase.database().ref('cursos/');
    usersRef.on('value', function(snapshot) {
      sessionStorage.setItem("cursos", JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("cursos"));
      var items="";
      for(var key in obj) {
        items+='<tr><td>'+obj[key].name+'</td>'+'<td>'+obj[key].descripcion+'</td>';
        var itemKey="'"+key+"'";
        items+='<td><a href="javascript:App.deleteCurso('+itemKey+');"> <span class="icon s7-trash"></span></a></td><tr>';
      }
      document.getElementById('listitems').innerHTML=items;
    }
  }

  static readNivelContent(){
    var url = new URL(window.location.href);
    document.getElementById('niveldetail').innerHTML=url.searchParams.get("curso")+" / "+url.searchParams.get("nivel");
  }

  static readNiveles(){
    setItems();
    var usersRef = firebase.database().ref('niveles/');
    usersRef.on('value', function(snapshot) {
      sessionStorage.setItem("niveles", JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("niveles"));
      var items="";
      for(var key in obj) {
        items+='<tr><td>'+obj[key].name+'</td>'+'<td>'+obj[key].descripcion+'</td>'+'<td>'+obj[key].curso+'</td>';
        var itemKey="'"+key+"'";
        var nivel="'"+obj[key].name+"'";
        var curso="'"+obj[key].curso+"'";
        items+='<td><a class="btn btn-primary btn-rounded" href="javascript:App.addContent('+itemKey+','+nivel+','+curso+');"> Contenido  </a></td>';
        items+='<td><a class="btn btn-primary btn-rounded" href="javascript:App.addQuestion('+itemKey+','+nivel+','+curso+');"> Evaluación  </a></td>';
        //items+='<td><a href="javascript:App.deleteNivel('+itemKey+');"> <span class="icon s7-trash"></span></a></td>';
        items+='<tr>';
      }
      document.getElementById('listitems').innerHTML=items;
    }
  }

  static readNivelesCurso(cursoID, cursoName){
    setItems();
    var usersRef = firebase.database().ref('cursos/'+cursoID+'/niveles/');
    usersRef.on('value', function(snapshot) {
      sessionStorage.setItem("cursoniveles"+cursoID, JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("cursoniveles"+cursoID));
      var items="";
      for(var key in obj) {
        items+='<tr><td>'+obj[key].name+'</td>'+'<td>'+obj[key].descripcion+'</td>'+'<td>'+cursoName+'</td>';
        var itemKey="'"+key+"'";
        var nivel="'"+obj[key].name+"'";
        var curso="'"+cursoName+"'";
        items+='<td><a class="btn btn-primary btn-rounded" href="javascript:App.addContent('+itemKey+','+nivel+','+curso+');"> Contenido  </a></td>';
        items+='<td><a class="btn btn-primary btn-rounded" href="javascript:App.addQuestion('+itemKey+','+nivel+','+curso+');"> Evaluación  </a></td>';
        //items+='<td><a href="javascript:App.deleteNivel('+itemKey+');"> <span class="icon s7-trash"></span></a></td>';
        items+='<tr>';
      }
      document.getElementById('listitems').innerHTML=items;
    }
  }

  static addContent(key, nivel, curso){
    window.location.href = 'contenido.html?key='+key+'&nivel='+nivel+'&curso='+curso;
  }

  static addQuestion(key, nivel, curso){
    window.location.href = 'evaluacion.html?key='+key+'&nivel='+nivel+'&curso='+curso;
  }


  static setCursosSelectLevels(){
    setItems();
    
    var cursosRef = firebase.database().ref('cursos/');
    cursosRef.on('value', function(snapshot) {
      sessionStorage.setItem("cursos", JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("cursos"));
      var items="";
      var selected=true;
      for(var key in obj) {
        items+='<option value="'+key+'">'+obj[key].name+'</option>';
        if(selected){
          App.selectedCurso();
          selected=false;
        }
      }
      document.getElementById('selectitems').innerHTML=items;
    }
  }

  static selectedCurso(){
    var curso = document.getElementById('selectitems');
    if(curso.selectedIndex>=0){
      App.readNivelesCurso(curso[curso.selectedIndex].value, curso[curso.selectedIndex].text);
    }
  }

  static setCursosSelect(){
    setItems();
    
    var cursosRef = firebase.database().ref('cursos/');
    cursosRef.on('value', function(snapshot) {
      sessionStorage.setItem("cursos", JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("cursos"));
      var items="";
      for(var key in obj) {
        items+='<option value="'+key+'">'+obj[key].name+'</option>';
      }
      document.getElementById('selectitems').innerHTML=items;
    }
  }

  static deleteNivel(key){
    firebase.database().ref('niveles/'+key).set({});
    $.gritter.add({
      title: 'Ok!',
      text: 'Nivel eliminado',
      class_name: 'color info',
      time: 800,
    });
  }


  static deleteCurso(key){
    firebase.database().ref('cursos/'+key).set({});
    $.gritter.add({
      title: 'Ok!',
      text: 'Curso eliminado',
      class_name: 'color info',
      time: 800,
    });
  }

  static deleteUser(key){
    firebase.database().ref('users/'+key).set({});
    $.gritter.add({
      title: 'Ok!',
      text: 'Usuario eliminado',
      class_name: 'color info',
      time: 800,
    });
  }
  
  static createUser() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var curso = document.getElementById('selectitems');
    var password = document.getElementById('password').value;

    if (password.length < 6) {
      $.gritter.add({
        title: 'Oops',
        text: 'Por favor ingresa una contraseña de mínimo 6 caracteres',
        class_name: 'color warning',
        time: 800
      });
      return;
    }

    document.getElementById("crear").innerHTML = 'Guardando...';
    document.getElementById("crear").disabled = true;

    firebase.database().ref('users/'+window.btoa(unescape(encodeURIComponent( email )))).set({
      name: name,
      cursoid: curso.value,
      curso: curso[curso.selectedIndex].text,
      password: password,
      email: email
    });

    document.getElementById("crear").innerHTML = 'Crear Usuario';
    document.getElementById("crear").disabled = false;
    document.getElementById('name').value="";
    document.getElementById('email').value="";
    document.getElementById('password').value="";

    $.gritter.add({
      title: 'Ok!',
      text: 'Usuario creado',
      class_name: 'color success',
      time: 800
    });
  }
  

  static createCurso() {
    var name = document.getElementById('name').value;
    var descripcion = document.getElementById('descripcion').value;

    document.getElementById("crear").innerHTML = 'Guardando...';
    document.getElementById("crear").disabled = true;

    firebase.database().ref('cursos/').push().set({
      name: name,
      descripcion: descripcion,
    });

    document.getElementById("crear").innerHTML = 'Crear Curso';
    document.getElementById("crear").disabled = false;
    document.getElementById('name').value="";
    document.getElementById('descripcion').value="";

    $.gritter.add({
      title: 'Ok!',
      text: 'Curso creado',
      class_name: 'color success',
      time: 800,
    });
  }

  static createNivel() {
    var name = document.getElementById('name').value;
    var descripcion = document.getElementById('descripcion').value;
    var curso = document.getElementById('selectitems');

    document.getElementById("crear").innerHTML = 'Guardando...';
    document.getElementById("crear").disabled = true;

    firebase.database().ref('niveles/').push().set({
      name: name,
      descripcion: descripcion,
      curso: curso[curso.selectedIndex].text,
      cursoid: curso.value
    });

    document.getElementById("crear").innerHTML = 'Crear Nivel';
    document.getElementById("crear").disabled = false;
    document.getElementById('name').value="";
    document.getElementById('descripcion').value="";

    $.gritter.add({
      title: 'Ok!',
      text: 'Nivel creado',
      class_name: 'color success',
      time: 800,
    });
  }

  
  static readDocuments(){
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")

    setItems();

    var usersRef = firebase.database().ref('niveles/'+nivelID+'/documentos');

    usersRef.on('value', function(snapshot) {
      sessionStorage.setItem("documentos"+nivelID, JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("documentos"+nivelID));
      var items="";
      for(var key in obj) {
        items+='<tr><td>'+obj[key].name+'</td>'+'<td>'+obj[key].descripcion+'</td>'+'<td><a target="_blank" href="https://firebasestorage.googleapis.com/v0/b/jamar-23d18.appspot.com/o/documents%2F'+obj[key].file+'?alt=media"><span class="s7-link"></span></a></td>';
        var itemKey="'"+key+"'";
        var fileName="'"+obj[key].file+"'";
        items+='<td><a href="javascript:App.deleteDocument('+itemKey+','+fileName+');"> <span class="icon s7-trash"></span></a></td><tr>';
      }
      document.getElementById('listitemsdoc').innerHTML=items;
    }
  }

  static deleteDocument(key, filename){
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")

    var storageRef = firebase.storage().ref();
    var documentsRef = storageRef.child('documents');
    var spaceRef = documentsRef.child(filename);

    spaceRef.delete().then(function() {
      // File deleted successfully
    }).catch(function(error) {
      // Uh-oh, an error occurred!
    });
    
    firebase.database().ref('niveles/'+nivelID+'/documentos/'+key).set({});
    $.gritter.add({
      title: 'Ok!',
      text: 'Documento eliminado',
      class_name: 'color info',
      time: 800,
    });
  }

  
  static readQuestions(){
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")

    setItems();

    var usersRef = firebase.database().ref('niveles/'+nivelID+'/preguntas');
    
    usersRef.on('value', function(snapshot) {
      sessionStorage.setItem("preguntas"+nivelID, JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("preguntas"+nivelID));
      var items="";
      for(var key in obj) {
        items+='<tr><td>'+obj[key].pregunta+'</td>';
        items+='<td>'+obj[key].opcion1+'</td>';
        items+='<td>'+obj[key].opcion2+'</td>';
        items+='<td>'+obj[key].opcion3+'</td>';
        items+='<td>'+obj[key].opcion4+'</td>';
        items+='<td>'+obj[key].opcion5+'</td>';
        items+='<td>'+obj[key].respuesta+'</td>';
        var itemKey="'"+key+"'";
        items+='<td><a href="javascript:App.deleteQuestion('+itemKey+');"> <span class="icon s7-trash"></span></a></td><tr>';
     }
      document.getElementById('listitems').innerHTML=items;
    }
  }
  
  static deleteQuestion(key){
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")
    firebase.database().ref('niveles/'+nivelID+'/preguntas/'+key).set({});
    $.gritter.add({
      title: 'Ok!',
      text: 'Pregunta eliminada',
      class_name: 'color info',
      time: 800,
    });
  }

  static readVideos(){
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key");

    setItems();
    
    var usersRef = firebase.database().ref('niveles/'+nivelID+'/videos');
    usersRef.on('value', function(snapshot) {  
      sessionStorage.setItem("videos"+nivelID, JSON.stringify(snapshot.val()));
      setItems();
    });

    function setItems(){
      var obj=JSON.parse(sessionStorage.getItem("videos"+nivelID));
      var items="";
      for(var key in obj) {
        items+='<tr><td>'+obj[key].name+'</td>'+'<td>'+obj[key].descripcion+'</td>'+'<td><a target="_blank" href="https://www.youtube.com/watch?v='+obj[key].youtubeid+'"><span class="s7-play"></span></a></td>';
        var itemKey="'"+key+"'";
        items+='<td><a href="javascript:App.deleteVideo('+itemKey+');"> <span class="icon s7-trash"></span></a></td><tr>';
      }
      document.getElementById('listitems').innerHTML=items;
    }
  }

  static deleteVideo(key){
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")
    firebase.database().ref('niveles/'+nivelID+'/videos/'+key).set({});
    $.gritter.add({
      title: 'Ok!',
      text: 'Video eliminado',
      class_name: 'color info',
      time: 800,
    });
  }


  static createVideo() {
    var name = document.getElementById('name').value;
    var descripcion = document.getElementById('descripcion').value;
    var youtubeid = document.getElementById('youtubeid').value;
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")

    document.getElementById("crear").innerHTML = 'Guardando...';
    document.getElementById("crear").disabled = true;

    firebase.database().ref('niveles/'+nivelID+'/videos').push().set({
      name: name,
      descripcion: descripcion,
      youtubeid: youtubeid
    });

    document.getElementById("crear").innerHTML = 'Agregar Video';
    document.getElementById("crear").disabled = false;
    document.getElementById('name').value="";
    document.getElementById('descripcion').value="";
    document.getElementById('youtubeid').value="";

    $.gritter.add({
      title: 'Ok!',
      text: 'Video agregado',
      class_name: 'color success',
      time: 800,
    });
  }
  
  static createQuestion(){
    var pregunta = document.getElementById('pregunta').value;
    var opcion1 = document.getElementById('opcion1').value;
    var opcion2 = document.getElementById('opcion2').value;
    var opcion3 = document.getElementById('opcion3').value;
    var opcion4 = document.getElementById('opcion4').value;
    var opcion5 = document.getElementById('opcion5').value;
    var respuesta1 = document.getElementById('respuesta1').checked;
    var respuesta2 = document.getElementById('respuesta2').checked;
    var respuesta3 = document.getElementById('respuesta3').checked;
    var respuesta4 = document.getElementById('respuesta4').checked;
    var respuesta5 = document.getElementById('respuesta5').checked;
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")

    var respuesta=1;

    if(respuesta2){respuesta=2;}
    if(respuesta3){respuesta=3;}
    if(respuesta4){respuesta=4;}
    if(respuesta5){respuesta=5;}

    document.getElementById("crear").innerHTML = 'Guardando...';
    document.getElementById("crear").disabled = true;

    firebase.database().ref('niveles/'+nivelID+'/preguntas').push().set({
      pregunta: pregunta,
      opcion1: opcion1,
      opcion2: opcion2,
      opcion3: opcion3,
      opcion4: opcion4,
      opcion5: opcion5,
      respuesta: respuesta,
    });

    document.getElementById("crear").innerHTML = 'Crear Pregunta';
    document.getElementById("crear").disabled = false;
    document.getElementById('pregunta').value="";
    document.getElementById('opcion1').value="";
    document.getElementById('opcion2').value="";
    document.getElementById('opcion3').value="";
    document.getElementById('opcion4').value="";
    document.getElementById('opcion5').value="";
    
    document.getElementById('respuesta1').checked=true;
    document.getElementById('respuesta2').checked=false;
    document.getElementById('respuesta3').checked=false;
    document.getElementById('respuesta4').checked=false;
    document.getElementById('respuesta5').checked=false;
    
    $.gritter.add({
      title: 'Ok!',
      text: 'Video agregado',
      class_name: 'color success',
      time: 800,
    });
  }

  static uploadDocument(){
    var name = document.getElementById('namedoc').value;
    var descripcion = document.getElementById('descripciondoc').value;
    var url = new URL(window.location.href);
    var nivelID=url.searchParams.get("key")


    var storageRef = firebase.storage().ref();
    var documentsRef = storageRef.child('documents');
   
    var file =  document.getElementById("filedoc").files[0];

    if(file.size>3000000){
      $.gritter.add({
        title: 'Oops',
        text: 'Máximo peso permitido es 3MB',
        class_name: 'color danger',
        time: 1000,
      });
      return;
    }

    var spaceRef = documentsRef.child(file.name);

    document.getElementById("creardoc").innerHTML = 'Guardando...';
    document.getElementById("creardoc").disabled = true;
    
    spaceRef.put(file).then(function(snapshot) {
      firebase.database().ref('niveles/'+nivelID+'/documentos').push().set({
        name: name,
        descripcion: descripcion,
        file: file.name
      });
  
      document.getElementById("creardoc").innerHTML = 'Agregar Documento';
      document.getElementById("creardoc").disabled = false;
      document.getElementById('namedoc').value="";
      document.getElementById('descripciondoc').value="";
      document.getElementById('filedoc').value="";
  
      $.gritter.add({
        title: 'Ok!',
        text: 'Documento agregado',
        class_name: 'color success',
        time: 800,
      });
    });
    
  }

  
}
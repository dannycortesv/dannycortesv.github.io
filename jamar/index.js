const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//https://us-central1-jamar-23d18.cloudfunctions.net/createuserfn
//admin.database().ref('/users/' + snap.key).once('value').then(function(snapshot) {});

exports.createuserfn = functions.https.onRequest((request, response) => {
    admin.auth().createUser({
        email: 'jose@perfo.com',
        emailVerified: false,
        password: '123456',
        displayName: 'Jose Perco',
        disabled: false
      })
        .then(function(userRecord) {
          console.log('Successfully created new user:', userRecord.uid);
        })
        .catch(function(error) {
          console.log('Error creating new user:', error);
        });
});

exports.usercreated = functions.database.ref('/users/{userid}')
.onCreate((snapshot) => {
      admin.auth().createUser({
          uid:snapshot.key,
          email: snapshot.val().email,
          emailVerified: false,
          password: snapshot.val().password,
          displayName: snapshot.val().name,
          disabled: false
        })
          .then(function(userRecord) {
            console.log('Successfully created new user:', userRecord.uid);
          })
          .catch(function(error) {
            console.log('Error creating new user:', error);
          });
       admin.database().ref('/cursos/' + snapshot.val().cursoid).once('value').then(function(snapdata) {
            admin.database().ref('users/'+snapshot.key).update({
              descripcioncurso: snapdata.val().descripcion,
            });
       });
       admin.database().ref('users/'+snapshot.key).update({
          password: null,
       });
}
);

exports.userdelete = functions.database.ref('/users/{userid}')
  .onDelete((snap, context) => {
    admin.auth().deleteUser(snap.key)
      .then(function() {
        console.log('Successfully deleted user');
      })
      .catch(function(error) {
        console.log('Error deleting user:', error);
      });
  }
);


exports.nivelcreated = functions.database.ref('/niveles/{nivelid}')
.onCreate((snap, context) => {
  admin.database().ref('cursos/'+snap.val().cursoid+'/niveles/'+snap.key).update({
    name: snap.val().name,
    descripcion: snap.val().descripcion,
  })
}
);

exports.niveldeleted = functions.database.ref('/niveles/{nivelid}').onDelete((snapshot) => {
      admin.database().ref('cursos/'+snapshot.val().cursoid+'/niveles/'+snapshot.key).update({
        name: null,
        descripcion: null,
      });
  }
);
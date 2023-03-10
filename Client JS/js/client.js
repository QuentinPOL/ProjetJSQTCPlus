// Récupère le chemin du fichier HTML
var path = window.location.pathname;
// Récupère le nom du fichier HTML
var page = path.split("/").pop();
// Création du websocket
const socket = new WebSocket('ws://localhost:81');
// Définition du status
const statusSocket = document.getElementById('status');
// Réponse JSON
var reponseJSON = null;

// Fonction pour crypter un mot de passe en SHA256
function sha256(password) 
{
  return CryptoJS.SHA256(password).toString();
}

function requestUser(type) 
{
  let msg;
  let password = document.getElementById("passwd").value;
  let hashedPassword = sha256(password);

  if (type == 1)
  { 
    msg = {
      type: "inscription",
      username: document.getElementById("username").value,
      password: hashedPassword,
    };
  }
  else if (type == 2)
  {
    msg = {
      type: "connexion",
      username: document.getElementById("username").value,
      password: hashedPassword,
    };
  }

  // Envoie du message sous forme JSON
  socket.send(JSON.stringify(msg));
}

// Fonction pour définir un cookie avec un nom, une valeur et une durée d'expiration
function setCookie(cvalue, exminutes) {
  const d = new Date();
  d.setTime(d.getTime() + (exminutes*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = "loggedIn=" + cvalue + ";" + expires + ";path=/";
}

// Fonction pour vérifier si l'utilisateur est connecter ou pas
function isLoggedIn() 
{
  var cookies = document.cookie.split(";"); // Récupérer tous les cookies

  for (var i = 0; i < cookies.length; i++) 
  {
    var cookie = cookies[i].trim(); // Supprimer les espaces de chaque cookie

    if (cookie.startsWith("loggedIn=")) { // Vérifier si le cookie commence par "loggedIn="
      return cookie.substring("loggedIn=".length, cookie.length) === "true"; // Vérifier si la valeur du cookie est "true"
    }
  }
  return false; // Si le cookie n'est pas défini, retourner false
}

// Tentative Connexion
if (socket.readyState == 0)
{
  statusSocket.innerHTML = "Status : Le socket a été créé ! En attente de connexion ...";
}

// Connexion Ouverte
socket.addEventListener('open', () => {
  statusSocket.innerHTML = "Status : Connecter !";
  //socket.send("verification"); // Pour savoir si l'utilisateur est connecter
});

// Connexion Fermée
socket.addEventListener('close', () => {
  statusSocket.innerHTML = "Status : Fermer (Le serveur à était fermer) !";
});

// Selon ou on se situe
if (path == "/" || page ==  "index.php" || page == "inscription.php")
{
    if (isLoggedIn()) // Si il est connecter
    {
      document.location.href = "client.php";
    }
    else // Si il est pas connecter
    {
      let formSignUp = null;
      let formConnect =  null;
      let reponse = document.getElementById('reponse');
      let type;

      if (path == "/" || page ==  "index.php")
      {
        formConnect = document.getElementById('formConnect');

        formConnect.addEventListener('submit', () => {
          type = 2;
          requestUser(type);
        });
      }
      else if (page == "inscription.php")
      {
        formSignUp = document.getElementById('formSignUp');

        formSignUp.addEventListener('submit', () => {
          type = 1;
          requestUser(type);
        });
      }

      socket.onmessage = function (evt) { 
        console.log(JSON.parse(evt.data));
        reponseJSON = JSON.parse(evt.data);

        if (type == 1) // Si c'est une inscription
        {
          reponse.innerHTML = "1 = " + JSON.stringify(reponseJSON);
          
          if (reponseJSON.Inscription == "ilExiste") // Si il existe déjà
          {
            let noValidate = document.getElementById('noValidate');

            noValidate.style.color = "red";
            noValidate.innerHTML = "Ce nom d'utilsateur existe déjà !";
          }
          else if (reponseJSON.Inscription == "ilEstInscrit")
          {
            reponse.innerHTML = reponseJSON.Inscription;
            setCookie("true", 10);
          }
        }
        else if (type == 2) // Si c'est une connexion
        {
          reponse.innerHTML = "2 = " + JSON.stringify(reponseJSON);

          // On va décomposer la réponse JSON du serveur
        }
      }
    }
}
else if (path == "/client.php")
{
    if (isLoggedIn()) // Si il est connecter
    { 
      const errorSocket = document.getElementById('errorSocket');
      const sendSocket = document.getElementById('sendMessage');
      const receiveSocket = document.getElementById('receiveMessages');

      // Envoie des Messages
      sendSocket.addEventListener('click', () => {
        const message = document.getElementById('saisiMessage').value;
        
        if (message.length != 0)
        {
          socket.send(message);
        }
      });

      // Réception des Messages
      socket.addEventListener('message', function (event) {
        const li = document.createElement('li');
        li.style.listStyleType = "none";

        li.textContent = "Message serveur : " + event.data; // event.data = message recu
        receiveSocket.appendChild(li); // Ajouter un élément à la liste
      });

      // Eventuelles Erreurs
      socket.addEventListener('error', function (event) {
        errorSocket.innerHTML = "Erreur WebSocket : " + event;
      });
    }
    else // Si il est pas connecter
    {
      document.location.href = "index.php";
    }
}


// St Malo ou rennes 
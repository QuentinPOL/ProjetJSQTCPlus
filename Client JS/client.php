<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset='utf-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <title>Client</title>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <link rel="stylesheet" type="text/css" href="style.css">
    </head>

    <body style="text-align: center;">
        <h1 style="color: red;">Websocket Client</h1>

        <!-- Button Connecting -->
        <button type="button" id="btnDisconnecting">Déconnexion</button>

        <!-- Informations -->
        <p id="status">Status : Aucun</p>
        <p id="error">Erreur : Aucune</p>
        
        <!-- Envoie Messages -->
        <form>
          <label for="message">Message a envoyer :</label>
          <input type="text" id="saisiMessage" onkeypress="this.style.width = ((this.value.length + 2) * 7) + 'px';" placeholder="Entrez le texte souhaiter">
          <button type="button" id="sendMessage">Envoyer</button>
        </form>

        <!-- Réception Messages -->
        <div>
            <ul id="receiveMessages"></ul>
        </div>
        
        <script src="js/client.js"></script>
    </body>
</html>
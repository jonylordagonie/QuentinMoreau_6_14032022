// On require les requete http et notre app
const http = require("http");
const app = require("./app");

// On dis sur quel port nous voulons utiliser le serveur
const port = 3000;
app.set("port", port);

// Recherche les différentes erreurs et les gère de manière appropriée.
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// On créer notre server
const server = http.createServer(app);

// Quand le server s'allume affiche l'erreur ou "Listning on port ..."
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// On execute notre fonction
server.listen(port);
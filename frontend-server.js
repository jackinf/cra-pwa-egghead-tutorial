const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('sslcert/localhost.key', 'utf8');
const certificate = fs.readFileSync('sslcert/localhost.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/build'));
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(5000);
httpsServer.listen(8443);
console.log(`Listening on http://localhost:5000 and https://localhost:8443`);

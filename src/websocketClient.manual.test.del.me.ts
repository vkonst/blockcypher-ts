import WebsocketClient from './websocketClient';
import {Subscription} from './websocketClient';
import BlockSypher from './blockcypher';
import {server as WsServer} from 'websocket';
import http = require('http');

let server = http.createServer((req, res) => {
    console.log((new Date()) + ' Received request for ' + req.url);
    res.statusCode = 200;
    res.end();
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

let wsServer = new WsServer({
    httpServer: server,
    autoAcceptConnections: true
});

let wsClient = new WebsocketClient(
    'ws://localhost:3000',
    [Subscription.newBlock]);

wsClient.emitter.on('EHOSTDOWN', (err) => {
    console.log(err);
});

wsClient.emitter.on('connect', ()=> {
    wsServer.closeAllConnections();
});

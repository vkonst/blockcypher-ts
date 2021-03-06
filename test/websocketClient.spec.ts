import 'mocha';
import {server as WsServer} from 'websocket';
import WebsocketClient, {Subscription} from "../src/websocketClient";

const expect = require('chai').expect;

import http = require('http');


describe('blockcypher web socket client', () => {

  let wsClient: WebsocketClient;
  let wsServer: WsServer;
  let server: http.Server;

  before(done => {
    server = http.createServer((req, res) => {
      console.log((new Date()) + ' Received request for ' + req.url);
      res.statusCode = 200;
      res.end();
    });

    server.listen(3000);

    wsServer = new WsServer({
      httpServer: server,
      autoAcceptConnections: true
    });

    wsClient = new WebsocketClient(
      'ws://localhost:3000',
      [Subscription.newBlock],
      {maxRetries: 2});

    wsClient.emitter.once('connect', () => {
      done();
    })
  });

  describe('web socket client "reconnection" event', () => {
    it('should emit "reconnection" event when server disconnects', done => {
      wsClient.emitter.once('reconnection', (reconParams) => {
        expect(reconParams).to.be.a('object');
        expect(reconParams.retriesCount).to.equal(1);
        expect(reconParams.maxRetries).to.equal(2);
        expect(reconParams.shouldRetry).to.equal(true);

        done();
      });

      wsServer.closeAllConnections();
    });
  });

  describe('web web socket client reconnection', () => {
    it('should reconnect web socket client when server disconnects', done => {
      wsClient.emitter.once('connect', () => {
        done();
      });

      wsServer.closeAllConnections();
    })
  });

  describe('web socket client reconnection limit', () => {
    it('should emit "EHOSTDOWN" event when limit of reconnections reached', done => {
      wsClient.emitter.on('EHOSTDOWN', (err) => {
        expect(err).to.equal('Too many failed connection attempts');

        done();
      });

      wsServer.closeAllConnections();
    })
  });


});

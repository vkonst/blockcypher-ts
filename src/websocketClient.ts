import * as Debug from "debug";
import * as events from "events";
import WebSocket = require("websocket");

const WsClient = WebSocket.client;
const debug = Debug("blockcypher:socket");

export interface IMessage {
  type: string;
  utf8Data: string;
}

export enum Subscription {
  unconfirmedTx = "unconfirmed-tx",
  newBlock = "new-block",
  confirmedTx = "confirmed-tx",
  txConfirmation = "tx-confirmation",
}

export default class WebsocketClient {
  private serverUrl: string;
  private wsClient: WebSocket.client;
  private subscriptions: Subscription[];
  private connection: WebSocket.connection;

  constructor(serverUrl: string, subscriptions: Subscription[] = [Subscription.newBlock]) {
    const self = this;
    self.serverUrl = serverUrl;
    self.subscriptions = subscriptions;
    self.wsClient = new WsClient();

    self.wsClient.on("connectFailed", (err) => debug("connectFailed", err));
    self.wsClient.on("connect", (conn: WebSocket.connection) => {
      self.connection = conn;
      self.connection
        .on("message", (msg: IMessage) => self.handleMsg(msg))
        .on("close", (code: number, desc: string): void => { debug("> WsConnection closed", code, desc); })
        .on("error", (err) => debug("connection error", err));
      self.subscriptions.forEach((subscription) => {
        self.connection.send(JSON.stringify({
          event: subscription,
        }));
      });
      self.ping();
    });
    self.connect();
  }

  public get emitter(): events.EventEmitter {
    return this.wsClient as events.EventEmitter;
  }

  protected connect() {
    this.wsClient.connect(this.serverUrl);
  }

  protected disconnect(): void {
    if (!this.connection) { return; }
    if (!this.connection.connected) { return; }
    this.connection.close();
  }

  protected handleMsg(msg: IMessage) {
    const emitter = this.wsClient;
    let invalidMsg = false;
    debug(`> new msg: ${JSON.stringify(msg)}`);

    if (msg.type === "utf8" && msg.utf8Data) {
      const content: object = JSON.parse(msg.utf8Data);
      if (isPongMsg(content as  {event: string})) {
        this.processPong();
      } else if (isNewBlockMsg(content)) {
        emitter.emit(Subscription.newBlock, content);
      } else if (isNewTxMsg(content)) {
        emitter.emit(Subscription.unconfirmedTx, content);
      } else { invalidMsg = true; }
    } else { invalidMsg = true; }
    if (invalidMsg) {
      emitter.emit("error", { code: "unknown_msg", data: msg });
    }

    function isPongMsg(content: {event: string}): boolean {
      return content.event === "pong";
    }
    function isNewBlockMsg(content: object): boolean {
      return content.hasOwnProperty("height");
    }
    function isNewTxMsg(content: object): boolean {
      return content.hasOwnProperty("block_height");
    }
  }

  protected ping() {
    if (!this.connection) { return; }
    if (!this.connection.connected) { return; }

    this.connection.send("{\"event\":\"ping\"}");
  }

  protected processPong() {
    const self = this;
    const pingIntervalInMs = 20000;
    setTimeout(() => { self.ping(); }, pingIntervalInMs);
  }
}

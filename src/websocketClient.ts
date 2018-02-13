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
    private reconnectDelay = 0;
    private retriesCount = 0;
    private shouldRetry = true;
    private maxReconnectionDelay = 10000;
    private minReconnectionDelay = 1500;
    private reconnectionDelayGrowFactor = 1.3;
    private maxRetries = Infinity;

    constructor(serverUrl: string,
                subscriptions: Subscription[] = [Subscription.newBlock],
                reconnectOptions?: {
                    reconnectDelay?: number,
                    shouldRetry?: boolean,
                    maxReconnectionDelay?: number,
                    minReconnectionDelay?: number,
                    reconnectionDelayGrowFactor?: number,
                    maxRetries?: number
                }) {
        const self = this;
        self.serverUrl = serverUrl;
        self.subscriptions = subscriptions;
        self.wsClient = new WsClient();
        if (reconnectOptions) {
            self.reconnectDelay = reconnectOptions.reconnectDelay || 0;
            self.shouldRetry = reconnectOptions.shouldRetry || true;
            self.maxReconnectionDelay = reconnectOptions.maxReconnectionDelay || 10000;
            self.minReconnectionDelay = reconnectOptions.minReconnectionDelay || 1500;
            self.reconnectionDelayGrowFactor = reconnectOptions.reconnectionDelayGrowFactor || 1.3;
            self.maxRetries = reconnectOptions.maxRetries || Infinity
        }

        self.wsClient.on("connectFailed", (err) => debug("connectFailed", err));
        self.wsClient.on("connect", (conn: WebSocket.connection) => {
            self.connection = conn;
            self.connection
                .on("message", (msg: IMessage) => self.handleMsg(msg))
                .on("close", (code: number, desc: string): void => {
                    debug('handleClose', {shouldRetry: self.shouldRetry});
                    self.retriesCount++;
                    debug('retries count:', self.retriesCount);
                    if (self.retriesCount > self.maxRetries) {
                        self.emitter.emit('EHOSTDOWN', 'Too many failed connection attempts');
                        return;
                    }
                    if (!self.reconnectDelay) {
                        self.reconnectDelay = self.minReconnectionDelay + Math.random() * self.minReconnectionDelay;
                    }
                    else {
                        const newDelay = self.reconnectDelay * self.reconnectionDelayGrowFactor;
                        self.reconnectDelay = (newDelay > self.maxReconnectionDelay)
                            ? self.maxReconnectionDelay
                            : newDelay;
                    }
                    debug('handleClose - reconnectDelay:', self.reconnectDelay);
                    if (self.shouldRetry) {
                        setTimeout(() => {
                            this.wsClient.emit('reconnection', {
                                retriesCount: this.retriesCount,
                                shouldRetry: this.shouldRetry,
                                reconnectDelay: this.reconnectDelay,
                                maxRetries: this.maxRetries
                            });
                            self.connect();
                        }, self.reconnectDelay);
                    }

                })
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


    protected connect(): void {
        this.wsClient.connect(this.serverUrl);
    }

    protected disconnect(): void {
        if (!this.connection) {
            return;
        }
        if (!this.connection.connected) {
            return;
        }
        this.connection.close();
    }

    protected handleMsg(msg: IMessage): void {
        const emitter = this.wsClient;
        let invalidMsg = false;
        debug(`> new msg: ${JSON.stringify(msg)}`);

        if (msg.type === "utf8" && msg.utf8Data) {
            const content: object = JSON.parse(msg.utf8Data);
            if (isPongMsg(content as  { event: string })) {
                this.processPong();
            } else if (isNewBlockMsg(content)) {
                emitter.emit(Subscription.newBlock, content);
            } else if (isNewTxMsg(content)) {
                emitter.emit(Subscription.unconfirmedTx, content);
            } else {
                invalidMsg = true;
            }
        } else {
            invalidMsg = true;
        }
        if (invalidMsg) {
            emitter.emit("error", {code: "unknown_msg", data: msg});
        }

        function isPongMsg(content: { event: string }): boolean {
            return content.event === "pong";
        }

        function isNewBlockMsg(content: object): boolean {
            return content.hasOwnProperty("height");
        }

        function isNewTxMsg(content: object): boolean {
            return content.hasOwnProperty("block_height");
        }
    }

    protected ping(): void {
        if (!this.connection) {
            return;
        }
        if (!this.connection.connected) {
            return;
        }

        this.connection.send("{\"event\":\"ping\"}");
    }

    protected processPong(): void {
        const self = this;
        const pingIntervalInMs = 20000;
        setTimeout(() => {
            self.ping();
        }, pingIntervalInMs);
    }
}

import WebSocket = require('websocket');
import events = require('events');

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
    private reconnectDelay: number;
    private retriesCount: number;
    private shouldRetry: boolean;
    private maxReconnectionDelay: number;
    private minReconnectionDelay: number;
    private reconnectionDelayGrowFactor: number;
    private maxRetries: number;

    public emitter(): events.EventEmitter;

    protected setReconnectOpts(reconnectOpts?: {
        reconnectDelay?: number,
        shouldRetry?: boolean,
        maxReconnectionDelay?: number,
        minReconnectionDelay?: number,
        reconnectionDelayGrowFactor?: number,
        connectionTimeout?: number
    }): void;
    protected connect(): void;
    protected disconnect(): void;
    protected handleMsg(msg: IMessage): void;
    protected ping(): void;
    protected processPong(): void;
}

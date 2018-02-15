# BlockCypher-Ts #

A REST API and Websocket client for the BlockCypher Web services written in Typescript with minimal external dependencies.

### Initialisation

Before using Blockcypher methods implement new Blockcypher object
with network name in param (by default network = 'BTC.test').

Blockcypher implementation for "ETH.test" network for example:

```typescript
import Blockcypher from 'blockcypher';
let blockcypher = new Blockcypher('ETH.test', [websocket_reconnection_options]);
```

### WebSocket connections/reconnections

Any implementation of Blockcypher class automatically connect to Blockcypher WebSocket Server
Blockcypher has getter for eventEmmiter:

```typescript
let websocket_reconnection_options: {
  reconnectDelay?: number,
  shouldRetry?: boolean, // if true websocket client will reconnect to server after disconnection
  maxReconnectionDelay?: number,
  minReconnectionDelay?: number,
  reconnectionDelayGrowFactor?: number,
  maxRetries?: number // number of maximum reconnection retries 
}

let blockcypher = new Blockcypher(network, websocket_reconnection_options);
blockcypher.emitter.on('event_name', event_handler);
```

#### Features

AutoReconnection to WebSocket server when server disconnects

### API
#### List of methods:

##### getChain()

```typescript
/**
   * Get Chain
   * Get info about the blockchain.
   * @returns Promise{Object} Chain info (as Promise resolving to IChainData)
   */

blockcypher.getChain().then(chain => {
  // ...
}).catch(err => {
  // error handler
})
```

##### listWallets()

```typescript
/**
   * List wallets
   * Retrieve list of wallet.
   * @returns Promise{Object} List of wallets or undefined (as Promise resolving to IWalletList)
   */

blockcypher.listWallets().then(listOfWallets => {
  // ...
}).catch(err => {
  // error handler
})
```

##### getWallet()

```typescript
/**
   * Get Wallet
   * Retrieve wallet data.
   * @param {string} wallet Name of the wallet
   * @returns Promise{Object} Existing wallet or undefined (as Promise resolving to IWallet)
   */
blockcypher.getWallet(wallet_name).then(wallet => {
  // ...
}).catch(err => {
  // error handler
})
```

##### createWallet()

```typescript
/**
   * Create Wallet
   * Creates a new wallet.
   * @param {string} wallet Name of the wallet
   * @param {string[]} addresses Optional Array of addresses
   * @returns Promise{Object} Created wallet (as Promise resolving to IWallet)
   */
blockcypher.createWallet(wallet_name, addresses_array).then(wallet => {
  // ...
}).catch(err => {
  // error handler
})
```

##### addAddrsToWallet()

```typescript
/**
   * Add Addresses to Wallet
   * Add array of addresses to named wallet.
   * @param {string} wallet Name of the wallet
   * @param {string[]} addresses Array of addresses
   * @returns Promise{Object} Updated wallet (as Promise resolving to IWallet)
   */
blockcypher.addAddrsToWallet(wallet_name, addresses_array).then(updatedWallet => {
  // ...
}).catch(err => {
  // error handler
})
```

##### getAddrsInWallet()

```typescript
/**
   * Get Addresses from Wallet
   * Get array of addresses from named wallet.
   * @param {string} wallet Name of the wallet
   * @returns Promise{Object} Wallet (as Promise resolving to IWallet)
   */
blockcypher.getAddrsInWallet(wallet_name).then(listOfAddresses => {
  // ...
}).catch(err => {
  // error handler
})
```

##### getBlock()

```typescript
/**
   * Get Block
   * Get info about a block defined by either block height or hash.
   * @param {(string|number)} hashOrHeight Hash or height of the block.
   * @param {Object} params Optional additional URL parameters.
   * @returns Promise{Object} Block data (as Promise resolving to IBlockData)
   */
blockcypher.getBlock(block_hash || block_height, [params]).then(block => {
  // ...
}).catch(err => {
  // error handler
})
```

##### getAddrBalance()

```typescript
/**
   * Get Address Balance
   * Get info on address and its "balance".
   * @param {string} addr Address
   * @param {Object} [params] Optional URL parameter ({ omitWalletAddresses:	bool }).
   * @returns Promise{Object} Block data (as Promise resolving to IBlockData)
   */
blochcypher.getAddrBalance(address, [params]).then(addressBalance => {
  // ...
}).catch(err => {
  // error handler
})
```

##### getAddr()

```typescript
/**
   * Get Address Basic info
   * Get info about an address, including concise transaction references.
   * @param {string} addr Address
   * @param {Object} [params] Optional URL parameters.
   * @returns Promise{Object} Block data (as Promise resolving to IBlockData)
   */
blockcypher.getAddr(address, [params]).then(address => {
  // ...
}).catch(err => {
  // error handler
})
```

##### createAddr()

```typescript
/**
   * <b>Create new Address</b>
   * Create new address and return new address data
   * @return {Promise<INewAddress>} new address data(as Promise resolving to INewAddress)
   */
blockcypher.createAddr().then(address => {
  // ...
}).catch(err => {
  // error handler
})
```

##### getAddrFull()

```typescript
/**
   * <b>Get Address Full Info</b>
   * Get info on an address, including full transactions.
   * @param {string} addr Address
   * @param {Object} [params]   Optional URL parameters.
   */
blockcypher.getAddrFull(address, [params]).then(addressFull => {
  // ...
}).catch(err => {
  // error handler
})
```

##### getTX()

```typescript
/**
   * <b>Get Transaction</b>
   * Get transaction by hash.
   * @param {string} hash Hash of the transaction.
   * @param {Object} params Optional URL parameters.
   * @returns Promise{Object} Transaction data (as Promise resolving to ITxData)
   */
blockcypher.getTX(tx_hash, [params]).then(tx => {
  // ...
}).catch(err => {
  // error handler
})
```

#### Events List

##### 'connect' event

Fired when WebSocket client was connected to WebSocket server
Return Websocket.connection object

##### 'connectFailed' event

Fired if WebSocket client didn't connect to WebSocket server
Return error object

##### 'close' event

Fired when WebSocket server disconnects
Return error code and error object

##### 'reconnection' event

This event will be fired if WebSocket server was disconnected and "shouldRetry" option set as "true"

##### 'message' event

Fired when WebSocket server send message to client
Return massage object

##### 'error' event

Fired when any internal event handler return error
Return error object 

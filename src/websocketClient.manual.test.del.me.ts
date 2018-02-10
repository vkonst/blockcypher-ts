import BlockSypher from './blockcypher';

let blockSypher = new BlockSypher();

blockSypher.emitter.on('close', () => {
    console.log(blockSypher.wsClient.socket.connecting);
});

blockSypher.emitter.on('connect', () => {
    console.log(blockSypher.wsClient.url);
    // blockSypher.emitter.emit('close');
});

import * as sinon from "sinon";
import * as should from "chai";
import * as expect from "chai";
import 'mocha';

import Blocksypher from "../src/blockcypher";

describe('blockcypher', () => {
    it('should', (done) => {
        let blockSypher = new Blocksypher();
        blockSypher.emitter.on("connectFailed")
    })
});

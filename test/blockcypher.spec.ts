import * as sinon from "sinon";
import * as should from "chai";
import * as expect from "chai";
import 'mocha';

import Blocksypher from "../src/blockcypher";

describe('blockcypher', () => {
    it('should', (done) => {
        let blockSypher = new Blocksypher();
        blockSypher.listWallets().then(res => {
            console.log(res);

            done();
        }, err => {
            console.log(err);

            done();
        });
    })
});

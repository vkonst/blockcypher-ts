import 'mocha';

import BlockCypher from "../src/blockcypher";
import {
    IAddressData, IAddressFullData, IBlockData, IChainData, INewAddress, ITxData, IWalletData,
    IWalletList
} from "../src/@types/blockcypher.types";

const expect = require('chai').expect;

describe('blockcypher (Ethereum)', () => {

    let blockCypher: BlockCypher;
    let testBlock: IBlockData;
    let testChain: IChainData;
    let testTx: ITxData;
    let testNewAddress: INewAddress;
    let testAddressString: string;
    let testAddressData: IAddressData;
    let testAddressFullData: IAddressFullData;
    const testWalletName = 'a' + (Math.random() * 10e10).toFixed(0).toString();
    let testWallet: IWalletData;
    let testWalletList: IWalletList;

    before(done => {
        blockCypher = new BlockCypher('ETH.test');

        blockCypher.emitter.on('connect', () => {
            done();
        });
    });

    describe('getChain method', () => {
        it('should return current chain', done => {
            blockCypher.getChain().then(chain => {
                testChain = chain;
                expect(testChain).to.be.a('object');
                expect(testChain.name).to.equal('BETH.test');

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('getBlock method', () => {

        let testBlockHash: string;

        it('should find and return block by height', done => {
            blockCypher.getBlock('0').then(block => {
                testBlock = block;
                testBlockHash = block.hash;
                expect(testBlock).to.be.a('object');
                expect(testBlock.chain).to.equal('ETH.main');
                expect(testBlock.height).to.equal(0);
                expect(testBlock.txids).to.be.a('array');

                done();
            }).catch(err => {
                done(err);
            })
        });

        it('should find and return block by hash', done => {
            blockCypher.getBlock(testBlockHash).then(block => {
                expect(block).to.deep.equal(testBlock);

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('getTx method', () => {
        it('should find and return transaction by hash', (done) => {
            blockCypher.getTX(testBlock.txids[0]).then(tx => {
                testTx = tx;
                testAddressString = tx.addresses[0];
                expect(testTx).to.be.a('object');
                expect(testTx.hash).to.equal(testBlock.txids[0]);
                expect(testTx.addresses).to.be.a('array');
                expect(testAddressString).to.be.a('string');

                done();
            }).catch(err => {
                done(err);
            })
        });
    });

    describe('createAddr method', () => {
        it('should create and return new address', done => {
            blockCypher.createAddr().then(addr => {
                testNewAddress = addr;
                expect(testNewAddress).to.be.a('object');

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('getAddr method', () => {
        it('should find and return address by hash', done => {
            blockCypher.getAddr(testAddressString).then(addr => {
                testAddressData = addr;
                expect(testAddressData).to.be.a('object');
                expect(testAddressData.address).to.equal(testAddressString);
                expect(testAddressData.txrefs).to.be.a('array');

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('getAddrFull method', () => {
        it('should find and return full address by hash', done => {
            blockCypher.getAddrFull(testAddressString).then(addr => {
                testAddressFullData = addr;
                expect(testAddressFullData).to.be.a('object');
                expect(testAddressFullData.address).to.equal(testAddressString);

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('getAddrBalance method', () => {
        it('should find address by hash and return its balance', done => {
            blockCypher.getAddrBalance(testAddressString).then(addrBallance => {
                expect(addrBallance).to.be.a('object');
                expect(addrBallance.address).to.equal(testAddressString);
                expect(addrBallance.balance).to.equal(testAddressData.balance);

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('createWallet method', () => {
        it('not realised for "Ethereum"', done => {
            blockCypher.createWallet(testWalletName).then(wallet => {
                done(wallet);
            }).catch(() => {
                done();
            })
        })
    });

    describe('getWallet method', () => {
        it('not realised for "Ethereum"', done => {
            blockCypher.getWallet(testWalletName).then(wallet => {
                done(wallet);
            }).catch(() => {
                done();
            })
        })
    });

    describe('listWallets method', () => {
        it('not realised for "Ethereum"', done => {
            blockCypher.listWallets().then(listWallets => {
                done(listWallets);
            }).catch(() => {
                done();
            })
        })
    });

    describe('addAddrsToWallet method', () => {
        it('not realised for "Ethereum"', done => {
            blockCypher.addAddrsToWallet(testWalletName, [testNewAddress.address])
                .then(updatedWallet => {
                    done(updatedWallet);
                }).catch(() => {
                done();
            })
        })
    });

    describe('getAddrsInWallet method', () => {
        it('not realised for "Ethereum"', done => {
            blockCypher.getAddrsInWallet(testWalletName).then(wallet => {
                done(wallet);
            }).catch(() => {
                done();
            })
        })
    })
});

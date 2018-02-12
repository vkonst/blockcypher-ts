import 'mocha';

import BlockCypher from "../src/blockcypher";
import {
    IAddressData, IAddressFullData, IBlockData, IChainData, INewAddress, ITxData, IWalletData,
    IWalletList
} from "../src/types";

const expect = require('chai').expect;

describe('blockcypher', () => {

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
        blockCypher = new BlockCypher();

        blockCypher.emitter.on('connect', () => {
            done();
        });
    });

    describe('getChain method', () => {
        it('should return current chain', done => {
            blockCypher.getChain().then(chain => {
                testChain = chain;
                expect(testChain).to.be.a('object');
                expect(testChain.name).to.equal('BCY.test');

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('getBlock method', () => {

        let testBlockHash: string;

        it('should found and return block by height', done => {
            blockCypher.getBlock('1').then(block => {
                testBlock = block;
                testBlockHash = block.hash;
                expect(testBlock).to.be.a('object');
                expect(testBlock.chain).to.equal('BCY.test');
                expect(testBlock.height).to.equal(1);
                expect(testBlock.txids).to.be.a('array');
                expect(testBlock.txids[0]).to.be.a('string');

                done();
            }).catch(err => {
                done(err);
            })
        });

        it('should found and return block by hash', done => {
            blockCypher.getBlock(testBlockHash).then(block => {
                    expect(block).to.deep.equal(testBlock);

                    done();
                }).catch(err => {
                    done(err);
            })
        })
    });

    describe('getTx method', () => {
        it('should found and return transaction by hash', (done) => {
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
        it('should found and return address by hash', done => {
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
        it('should found and return full address by hash', done => {
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
        it('should found address by hash and return its balance', done => {
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
        it('should create wallet and return its token', done => {
            blockCypher.createWallet(testWalletName).then(wallet => {
                testWallet = wallet;
                expect(wallet).to.be.a('object');
                expect(wallet.name).to.equal(testWalletName);
                expect(wallet.token).to.equal('');

                done();
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('getWallet method', () => {
        it('should return wallet by wallet name', done => {
            blockCypher.getWallet(testWalletName).then(wallet => {
                if(wallet) {
                    expect(wallet).to.be.a('object');
                    expect(wallet).to.deep.equal(testWallet);

                    done();
                } else {
                    done(new Error('"getWallet" method not found created wallet!'));
                }
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('listWallets method', () => {
        it('should return list of wallets', done => {
            blockCypher.listWallets().then(listWallets => {
                if(listWallets) {
                    testWalletList = listWallets;
                    expect(testWalletList).to.be.a('object');

                    listWallets.wallet_names.forEach((each_name, index) => {
                        if(each_name === testWalletName) {
                            done();
                        } else if(index === listWallets.wallet_names.length) {
                                done(new Error('"listWallets" method return list of ' +
                                    'wallets which not include created wallet: ' + testWalletName +
                                    '\n list of wallets: ' + listWallets.wallet_names
                                ));
                        }
                    })
                } else {
                    done(new Error('listWallets is ' + listWallets));
                }
            }).catch(err => {
                done(err);
            })
        })
    });

    describe('addAddrsToWallet method', () => {
        it('should add address to wallet and return updated wallet', done => {
            blockCypher.addAddrsToWallet(testWalletName, [testNewAddress.address])
                .then(updatedWallet => {
                    expect(updatedWallet).to.be.a('object');
                    expect(updatedWallet.name).to.equal(testWalletName);
                    expect(updatedWallet.token).to.equal('');

                    updatedWallet.addresses.forEach(each_address => {
                        if (each_address === testNewAddress.address) {
                            done();
                        }
                    });
                }).catch(err => {
                    done(err);
                })
        })
    });

    describe('getAddrsInWallet method', () => {
        it('should return wallet which include testing address', done => {
            blockCypher.getAddrsInWallet(testWalletName).then(wallet => {
                expect(wallet).to.be.a('object');
                expect(wallet.name).to.equal(undefined);
                expect(wallet.token).to.equal('');

                wallet.addresses.forEach(each_address => {
                    if (each_address === testNewAddress.address) {
                        done();
                    }
                });
            }).catch(err => {
                done(err);
            })
        })
    })
});

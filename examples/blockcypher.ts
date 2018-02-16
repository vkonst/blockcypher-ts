import Blockcypher from '../src/blockcypher';
import {IBlockData, IChainData, INewAddress, IWalletData} from "../src/@types/blockcypher.types";

let blockCypher = new Blockcypher(); // by default chain = 'BTC.test'

let newBtcAddress: INewAddress;
let btcChain: IChainData;
let btcWallet: IWalletData;
let btcTwelfthBlock: IBlockData;

/**
 * Method: "getChain"
 * Example of using "getChain" method which return chain info of current network
 */

blockCypher.getChain().then(chain => {
  // console.log(chain);
  //
  // must log something like below
  //
  // {
  //   name: 'BCY.test', // here You can check that Blockcypher was connected to correct network
  //   height: 1706947,
  //   hash: '0000814c76d8c166336ffe01a44833ed00cbbe0074cadac47866193a517be10b',
  //   time: '2018-02-13T13:21:17.963876878Z',
  //   latest_url: 'https://api.blockcypher.com/v1/bcy/test/blocks/0000814c76d8c166336ffe01a44833ed00cbbe0074cadac47866193a517be10b',
  //   previous_hash: '000096d7051f237c62e56c2aa5fe9be415cf5e152afaec0901c973b22fbe3ef8',
  //   previous_url: 'https://api.blockcypher.com/v1/bcy/test/blocks/000096d7051f237c62e56c2aa5fe9be415cf5e152afaec0901c973b22fbe3ef8',
  //   peer_count: 0,
  //   unconfirmed_count: 1,
  //   high_fee_per_kb: 83544,
  //   medium_fee_per_kb: 30000,
  //   low_fee_per_kb: 10000,
  //   last_fork_height: 1534326,
  //   last_fork_hash: '0000966a43bb60d61b668b76663875f7bd68aee8f07f7da4410112d58f9ffed4'
  // }
  btcChain = chain;
}).catch(err => {
  console.log(err);
});

/**
 * Methods: "createAddr" & "createWallet"
 * Example of using "createAddr" method which create new address for current network and
 * after that example for using "createWallet" method which create new wallet with
 * new address created before
 */

blockCypher.createAddr().then(newAddress => {
  // console.log(newAddress);
  //
  // must log something like below
  //
  // {
  //   private: 'da128bb664def712c3973923962891159da4790ec6c61fc352c6b16cd36b3a6d',
  //   public: '0350847901c8336b54129d6805a5aeaf8e43e78ead5cd317ee56f7fcb74fbab0a6',
  //   address: 'CAQavfv1J5djHg2NpPMZfizAbVcxXoEJRh',
  //   wif: 'BvdwBxyvSuAhAFNHTCqanFAusskCvqqFMLMkFKqBV9Qjog9N2XvH'
  // }

  newBtcAddress = newAddress;

  // After this You can use created address for creating new wallet with this address for example

  blockCypher.createWallet('wallet_name', [newBtcAddress.address])
    .then(newWallet => {
      // console.log(newWallet);
      //
      // must log something like below
      //
      // {
      //   name: 'wallet_name',
      //   addresses: [ 'C4gyJNGE7XktPyaWA9Wfbm38QYJsoD8mtj' ],
      //   token: '' // it's not error, "Blockcypher" class wipe Your's token after getting answer
      //             // from HTTP API
      // }

      btcWallet = newWallet;

    }).catch(err => {
      console.log(err);
  })
}).catch(err => {
  console.log(err);
});

/**
 * Methods: "getBlock" & "getTX"
 *  Example of using "getBlock" method which can find and return block by height or hash of block
 */

blockCypher.getBlock('12').then(twelfthBlock => {
  // console.log(twelfthBlock)
  //
  // must log something like below
  //
  // {
  //   hash: '000090403cb7e4604c26a59fa682b2d7000f43acab5120e4b10c521512ab95f1',
  //   height: 12, // that confirm of getting twelfth block
  //   chain: 'BCY.test',
  //   total: 0,
  //   fees: 0,
  //   size: 199,
  //   ver: 1,
  //   time: '2015-06-10T04:43:50Z',
  //   received_time: '2015-06-10T04:43:50Z',
  //   coinbase_addr: '',
  //   relayed_by: '',
  //   bits: 520159231,
  //   nonce: 3900,
  //   n_tx: 1,
  //   prev_block: '000056d8114dd7d8751e98ad760c7576d4a60f79d090bb69d7744dc35c2fc021',
  //   mrkl_root: '1e3ff5f2a6cf12e3b9bf40471199deeca5064c61a2784a365747317a4c13bee8',
  //   txids:
  //   [ '1e3ff5f2a6cf12e3b9bf40471199deeca5064c61a2784a365747317a4c13bee8' ],
  //     depth: 1708115,
  //   prev_block_url: 'https://api.blockcypher.com/v1/bcy/test/blocks/000056d8114dd7d8751e98ad760c7576d4a60f79d090bb69d7744dc35c2fc021',
  //   tx_url: 'https://api.blockcypher.com/v1/bcy/test/txs/'
  // }
  //

  btcTwelfthBlock = twelfthBlock;

  // After this You can use some "txids" in "getTX" method for example

  blockCypher.getTX(btcTwelfthBlock.txids[0]).then(tx => {
    // console.log(tx);
    //
    // must log something like below
    //
    // {
    //   block_hash: '000067fc49bf0ebd159e5264ba9d3e1b53648585b8ea0cbe86f48e79cdab0ef7',
    //   block_height: 159905,
    //   block_index: 0,
    //   hash: '1e3ff5f2a6cf12e3b9bf40471199deeca5064c61a2784a365747317a4c13bee8',
    //   addresses: [ 'CFr99841LyMkyX5ZTGepY58rjXJhyNGXHf' ],
    //   total: 5000000000,
    //   fees: 0,
    //   size: 118,
    //   preference: 'low',
    //   confirmed: '2015-06-10T04:43:50.883Z',
    //   received: '2015-06-10T04:43:50.883Z',
    //   ver: 1,
    //   double_spend: false,
    //   vin_sz: 1,
    //   vout_sz: 1,
    //   opt_in_rbf: true,
    //   confirmations: 1548233,
    //   confidence: 1,
    //   inputs:
    //   [ {
    //     output_index: -1,
    //     script: '7465737432353938303231373538373537323930323033',
    //     sequence: 0,
    //     script_type: 'empty',
    //     age: 159905
    //     } ],
    //   outputs:
    //   [ {
    //     value: 5000000000,
    //     script: '2102a44f60c94b840854db8c673e280dbc76b2975c6cf10e351ef6208f7f546e2130ac',
    //     addresses: [Array],
    //     script_type: 'pay-to-pubkey'
    //     } ]
    // }

  }).catch(err => {
    console.log(err);
  })

}).catch(err => {
  console.log(err);
});

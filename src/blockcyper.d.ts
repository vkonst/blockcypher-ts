interface ICoinConf {
  chain: string;
  coin: string;
}

interface IConf {
  apiUrl: string;
  coins: ICoinConf[];
  network: string;
  token: string;
  wsUri: string;
}

interface IChainData {
  name: string;           // ex: "BTC.main"
  height: number;
  hash: string;
  time: string;           // ex.: "2015-06-08T22:57:08.260165627Z",
  previous_hash: string;
  peer_count: number;
  unconfirmed_count: number;
  high_fee_per_kb: number;
  medium_fee_per_kb: number;
  low_fee_per_kb: number;
  last_fork_height: number;
  last_fork_hash: string;
}

interface IWalletData {
  name: string;
  addresses: [string];
  token: string;
}

interface IWalletList {
  wallet_names: string[];
}

interface IBlockData {
  hash: string;
  height: number;
  chain: string;
  total: number;
  fees: number;
  time: string;           // "2014-04-05T07:49:18Z",
  received_time: string;  // "2014-04-05T07:49:18Z",
  nonce: number;
  n_tx: number;
  prev_block: string;
  mrkl_root: string;
  txids: string[];
  depth: number;
}

interface ITxInputData {
  prev_hash: string;
  output_index: number;
  script: string;
  output_value: number;
  sequence: number;
  addresses: string[];
  script_type: string;
}

interface ITxOutputData {
  value: number;
  script: string;
  spent_by: string;
  addresses: string[];
  script_type: string;
}

interface ITxData {
  block_hash: string;
  block_height: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  confirmed: string;      // ex.: "2014-03-29T01:29:19Z"
  received: string;       // ex.: "2014-03-29T01:29:19Z"
  ver: number;
  lock_time: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  inputs: ITxInputData[];
  outputs: ITxOutputData [];
}

interface ITxRefData {
  tx_hash: string;
  block_height: number;
  tx_input_n: number;     // 0 or positive integer for input, -1 for output
  tx_output_n: number;    // 0 or positive integer for output, -1 for input
  value: number;          // in satoshi
  ref_balance: number;    // in satoshi
  confirmations: number;
  confirmed: string;      // ex.: "2018-02-01T19:40:47Z",
  double_spend: boolean;
}

interface IAddressBreifData {
  address: string;
  total_received: number; // in satoshi
  total_sent: number;     // in satoshi
  balance: number;        // in satoshi
  unconfirmed_balance: number;
  final_balance: number;  // includes unconfirmed
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;     // includes unconfirmed
}

interface IAddressData extends IAddressBreifData {
  txrefs: ITxRefData[];   // few entries possible for same transaction
  unconfirmed_txrefs: ITxRefData[];
}

interface IAddressFullData extends IAddressBreifData {
  // FIXME: to be corrected and detailized
  inputs: any[];
  outputs: any[];
}

export {
  IAddressBreifData,
  IAddressData,
  IAddressFullData,
  IBlockData,
  ICoinConf,
  IConf,
  IChainData,
  ITxData,
  ITxInputData,
  ITxOutputData,
  ITxRefData,
  IWalletData,
  IWalletList,
};

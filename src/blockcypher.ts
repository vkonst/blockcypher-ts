import * as Debug from "debug";
import request = require("request");
import conf from "../config/blockcypher.conf";
import {
  IAddressBreifData, IAddressData, IAddressFullData, IBlockData, IChainData,
  ICoinConf, IConf, ITxData, ITxInputData, ITxOutputData, IWalletData, IWalletList,
} from "./types";
import WebsocketClient from "./websocketClient";

const debug = Debug("blockcypher:class");

/** Class to access BlockCypher API. */
class Blockcypher extends WebsocketClient {
  private static API_ROOT: string = (conf as IConf).apiUrl;
  private static WS_ROOT: string = (conf as IConf).wsUri;

  /**
   * <b>Helper for GET XHR calls</b>
   *
   * @private
   * @param {string} url URL to query.
   * @param {Object} params Optional additional URL parameters.
   */
  private static httpGet(url: string, params = {}): Promise<any> {
    params = Object.assign({}, params, {token: (conf as IConf).token});
    debug(`httpGet url, params:\n${url},\n${params}`);
    return new Promise((resolve, reject) => request.get({
      json: true,
      qs: params,
      strictSSL: true,
      url,
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error);
      } else {
        resolve(body);
      }
    }));
  }

  /**
   * <b>Helper for POST XHR calls</b>
   *
   * @private
   * @param {string} url URI to query.
   * @param {Object} params Optional additional URL parameters.
   * @param {Object} data Optional data to post.
   */
  private static httpPost(url: string, params = {}, data = {}): Promise<any> {
    params = Object.assign({}, params, {token: (conf as IConf).token});
    debug(`httpPost url, params, data:\n ${url},\n${params},\n${data}`);
    return new Promise((resolve, reject) => request.post({
      body: data,
      json: true,
      qs: params,
      strictSSL: true,
      url,
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error);
      } else {
        resolve(body);
      }
    }));
  }

  private static wipeToken(wallet: IWalletData): IWalletData {
    const { name, addresses } = wallet;
    return { name, addresses, token: "" };
  }

  private coin: string;
  private chain: string;
  private apiUri: string;
  private wsUri: string;

  /**
   * Creates a new Blockcyper instance.
   * @param {string} chainName Name (ticket) of the coin (as defined in blockcypher.conf)
   */
  constructor(chainName?: string) {
    const network = chainName ? chainName : (conf as IConf).network;
    const coinConf: ICoinConf | undefined = (conf as IConf).coins
      .find((el) => el.chain === network );

    if (coinConf) {
      const {coin, chain} = coinConf as ICoinConf;
      const apiUri = `${Blockcypher.API_ROOT}${coin}/${chain}`;
      const wsUri = `${Blockcypher.WS_ROOT}${coin}/${chain}`;

      super(wsUri);

      this.coin = coin;
      this.chain = chain;
      this.apiUri = apiUri;
      this.wsUri = wsUri;

    } else {
      throw new Error("uknown/invalid chain");
    }
  }

  /**
   * <b>Get Chain</b>
   * Get info about the blockchain.
   * @returns Promise{Object} Chain info (as Promise resolving to IChainData)
   */
  public getChain(): Promise<IChainData> {
    const name = (`${this.coin}.${this.chain}`).toLocaleLowerCase();
    return Blockcypher.httpGet(this.getUrl("/"), {})
      .then((chain: IChainData): IChainData => {
        if (chain.name.toLocaleLowerCase() !== name) {
          throw(new Error(`unexpected response from blockcypher:${chain}`));
        }
        return chain;
      });
  }

  /**
   * <b>List wallets</b>
   * Retrieve list of wallet.
   * @returns Promise{Object} List of wallets or undefined (as Promise resolving to IWalletList)
   */
  public listWallets(): Promise<IWalletList | undefined> {
    return Blockcypher.httpGet(this.getUrl("/wallets"), {});
  }

  /**
   * <b>Get Wallet</b>
   * Retrieve wallet data.
   * @param {string} wallet Name of the wallet
   * @returns Promise{Object} Existing wallet or undefined (as Promise resolving to IWallet)
   */
  public getWallet(wallet: string): Promise<IWalletData | undefined> {
    return Blockcypher.httpGet(this.getUrl(`/wallets/${wallet}`), {})
      .then(Blockcypher.wipeToken);
  }

  /**
   * <b>Create Wallet</b>
   * Creates a new wallet.
   * @param {string} wallet Name of the wallet
   * @param {string[]} addresses Optional Array of addresses
   * @returns Promise{Object} Created wallet (as Promise resolving to IWallet)
   */
  public createWallet(wallet: string, addresses: string[] = []): Promise<IWalletData> {
    const data = Object.assign({}, {name: wallet, addresses: []});
    return Blockcypher.httpPost(this.getUrl("/wallets"), {}, data)
      .then(Blockcypher.wipeToken);
  }

  /**
   * <b>Add Addresses to Wallet</b>
   * Add array of addresses to named wallet.
   * @param {string} wallet Name of the wallet
   * @param {string[]} addresses Array of addresses
   * @returns Promise{Object} Updated wallet (as Promise resolving to IWallet)
   */
  public addAddrsToWallet(wallet: string, addresses: string[]): Promise<IWalletData> {
    return Blockcypher.httpPost(this.getUrl(`/wallets/${wallet}/addresses`), {}, {addresses})
      .then(Blockcypher.wipeToken);
  }

  /**
   * <b>Get Addresses from Wallet</b>
   * Get array of addresses from named wallet.
   * @param {string} wallet Name of the wallet
   * @returns Promise{Object} Wallet (as Promise resolving to IWallet)
   */
  public getAddrsInWallet(wallet: string): Promise<IWalletData> {
    return Blockcypher.httpGet(this.getUrl(`/wallets/${wallet}/addresses`), {})
      .then(Blockcypher.wipeToken);
  }

  /**
   * <b>Get Block</b>
   * Get info about a block defined by either block height or hash.
   * @param {(string|number)} hashOrHeight Hash or height of the block.
   * @param {Object} params Optional additional URL parameters.
   * @returns Promise{Object} Block data (as Promise resolving to IBlockData)
   */
  public getBlock(hashOrHeight: string|number, params?: {}): Promise<IBlockData> {
    return Blockcypher.httpGet(this.getUrl(`/blocks/${hashOrHeight}`), params);
  }

  /**
   * <b>Get Address Balance</b>
   * Get info on address and its "balance".
   * @param {(string|number)} addr Address
   * @param {Object} [params] Optional URL parameter ({ omitWalletAddresses:	bool }).
   * @returns Promise{Object} Block data (as Promise resolving to IBlockData)
   */
  public getAddrBalance(addr: string, params?: {}): Promise<IAddressBreifData> {
    return Blockcypher.httpGet(this.getUrl(`/addrs/${addr}/balance`), params);
  }

  /**
   * <b>Get Address Basic info</b>
   * Get info about an address, including concise transaction references.
   * @param {(string|number)} addr Address
   * @param {Object} [params] Optional URL parameters.
   * @returns Promise{Object} Block data (as Promise resolving to IBlockData)
   */
  public getAddr(addr: string, params?: {}): Promise<IAddressData> {
    return Blockcypher.httpGet(this.getUrl(`/addrs/${addr}`), params);
  }

  /**
   * <b>Get Address Full Info</b>
   * Get info on an address, including full transactions.
   * @param {(string|number)} addr Address
   * @param {Object} [params]   Optional URL parameters.
   */
  public getAddrFull(addr: string, params?: {}): Promise<IAddressFullData> {
    return Blockcypher.httpGet(this.getUrl(`/addrs/${addr}/full`), params);
  }

  /**
   * <b>Get Transaction</b>
   * Get transaction by hash.
   * @param {string} hash Hash of the transaction.
   * @param {Object} params Optional URL parameters.
   * @returns Promise{Object} Transaction data (as Promise resolving to ITxData)
   */
  public getTX(hash: string, params?: {}): Promise<ITxData> {
    return Blockcypher.httpGet(this.getUrl(`/txs/${hash}`), params);
  }

  protected getUrl(endPoint: string): string {
    return `${this.apiUri}${endPoint}`;
  }
}

export default Blockcypher;
export {
  IBlockData,
  IChainData,
  ITxData,
  ITxInputData,
  ITxOutputData,
  IWalletData,
  IWalletList,
};

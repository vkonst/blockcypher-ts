import WebsocketClient from '../websocketClient';
import {
  IAddressBreifData,
  IAddressData,
  IAddressFullData,
  IBlockData,
  IChainData,
  INewAddress,
  ITxData,
  IWalletData,
  IWalletList,
} from "./blockcypher.types";

export default class Blockcypher extends WebsocketClient {

  private static API_ROOT: string;
  private static WS_ROOT: string;

  private static httpGet(url: string, params: Object): Promise<any>;
  private static httpPost(url: string, params: Object, data: Object): Promise<any>;

  private static wipeToken(wallet: IWalletData): IWalletData;

  private name: string;
  private coin: string;
  private chain: string;
  private apiUri: string;
  private wsUri: string;

  public getChain(): Promise<IChainData>;
  public listWallets(): Promise<IWalletList | undefined>;
  public getWallet(wallet: string): Promise<IWalletData | undefined>;
  public createWallet(wallet: string, addresses: string[]): Promise<IWalletData>;
  public addAddrsToWallet(wallet: string, addresses: string[]): Promise<IWalletData>;
  public getAddrsInWallet(wallet: string): Promise<IWalletData>;
  public getBlock(hashOrHeight: string|number, params?: Object): Promise<IBlockData>;
  public getAddrBalance(addr: string, params?: Object): Promise<IAddressBreifData>;
  public getAddr(addr: string, params?: Object): Promise<IAddressData>;
  public createAddr(): Promise<INewAddress>;
  public getAddrFull(addr: string, params?: Object): Promise<IAddressFullData>;
  public getTX(hash: string, params?: Object): Promise<ITxData>;
  protected getUrl(endPoint: string): string;
}

export {
  IAddressBreifData,
  IAddressData,
  IAddressFullData,
  IBlockData,
  IChainData,
  ITxData,
  IWalletData,
  IWalletList,
  INewAddress
};


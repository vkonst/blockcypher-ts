interface ICoinConf {
  name: string;
  chain: string;
  coin: string;
}

interface IConf {
  apiUrl: string;
  chain: string;
  coins: ICoinConf[];
  token: string;
  wsUri: string;
}

export {
  ICoinConf,
  IConf
}
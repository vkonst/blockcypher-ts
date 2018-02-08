import {getEnvParam} from "./configHelpers";

const token: string = getEnvParam(["BLCPH_TOKEN"], "put your token here");
const network: string = `${getEnvParam(["BLCPH_NET"], "test")}`;

const config = {
  apiUrl: "https://api.blockcypher.com/v1/",
  coins: [
    { chain: "main", coin: "btc", _comment_: "Main Bitcoin network"  },
    { chain: "test3", coin: "btc", _comment_: "Bitcoin Test network"  },
    { chain: "test", coin: "bcy", _comment_: "BlockCypher Test network" },
  ],
  network,
  token,
  wsUri: "wss://socket.blockcypher.com/v1/",
};
export default config;

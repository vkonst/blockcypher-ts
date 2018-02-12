import {getEnvParam} from "./configHelpers";

const token: string = getEnvParam(["BLCPH_TOKEN"], "put your token here");
const chain: string = `${getEnvParam(["BLCPH_NET"], "test")}`;

const config = {
    apiUrl: "https://api.blockcypher.com/v1/",  // Resources: https://api.blockcypher.com/v1/${coin}/${chain}/...
    chain,
    coins: [
        { name: "BTC.main",  chain: "main",  coin: "btc",  _comment_: "Main Bitcoin network"  },
        { name: "BTC.test3", chain: "test3", coin: "btc",  _comment_: "Bitcoin Test network"  },
        { name: "BTC.test",  chain: "test",  coin: "bcy",  _comment_: "BlockCypher Test Bitcoin network" },
        { name: "ETH.main",  chain: "main",  coin: "eth",  _comment_: "Main Ethereum network"  },
        { name: "ETH.test",  chain: "test",  coin: "beth", _comment_: "BlockCypher Test Ethereum network" },
    ],
    token,
    wsUri: "wss://socket.blockcypher.com/v1/",
};
export default config;

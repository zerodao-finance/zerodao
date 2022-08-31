const { utils } = require("@renproject/utils");
const {
  generateTransactionHash,
} = require("@renproject/utils");

const version = "1";
const selector = "BTC/toPolygon"
const packValue = {
  "t": {
      "struct": [
          {
              "txid": "bytes"
          },
          {
              "txindex": "u32"
          },
          {
              "amount": "u256"
          },
          {
              "payload": "bytes"
          },
          {
              "phash": "bytes32"
          },
          {
              "to": "string"
          },
          {
              "nonce": "bytes32"
          },
          {
              "nhash": "bytes32"
          },
          {
              "gpubkey": "bytes"
          },
          {
              "ghash": "bytes32"
          }
      ]
  },
  "v": {
      "amount": "12065021",
      "ghash": "-1yGiDfLCvjls-O7rH0__OK_V5JDriOAZNtQjPjtG8E",
      "gpubkey": "A6Auk8-MR7JQB1sK9h-W69EDdsCqp2NRSOiJyytRyWkn",
      "nhash": "Yw3KQXrZP19CDZYvn6dhI5VbBXBGnMOGPYXLjHOnjTA",
      "nonce": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEiwZg",
      "payload": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAABNOGniRR0ou08DrtpgMi6vAekS2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQlRDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "phash": "46D5jFJlVDvwtoATm7jNzzUAWpoRlxNcjTrHf3ZrNKI",
      "to": "AC23817f7E9Ec7EB6B7889BDd2b50e04a44470c5",
      "txid": "nBNHQa1RC40nCX7ofYA6yAtmsmFjkZbKsH0xUyeFPoM",
      "txindex": "0"
  }
}

const hash = utils.toURLBase64(
  generateTransactionHash(version, selector, packValue)
);

console.log("TX HASH\n", hash);
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }

    // loc_dapp_dapp: {
    //   network_id: "*",
    //   port: 8545,
    //   host: "127.0.0.1"
    // }
  },
  compilers: {
    solc: {
      version: "0.8.20",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

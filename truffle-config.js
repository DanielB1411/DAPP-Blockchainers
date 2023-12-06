module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
<<<<<<< HEAD
      network_id: "1701834384963"
=======
      network_id: "*"
>>>>>>> 00d24ed70f1bc149d8fb71a85737d0d20a29a7bf
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

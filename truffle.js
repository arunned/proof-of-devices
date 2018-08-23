/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },

*/
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  networks: {
  development: {
    host: "127.0.0.1",
    port: 7545,
    gas: 4700000,
    network_id: "*" // Match any network id
  }
}
};



/*
module.exports = {
 networks: {
   rinkeby: {
     host: "localhost", // Connect to geth on the specified
     port: 8545,
     from: "0xdC5299b629Ef24fDECfBb240C00Fc79FAbB9cf97", // default address to use for any transaction Truffle makes during migrations
     network_id: 4,
     gas: 4612388 // Gas limit used for deploys
   }
 }
 };

 */

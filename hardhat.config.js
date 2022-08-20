require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_, { web3 }) => {
  const accounts = await web3.eth.getAccounts()
  console.log(accounts);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const memonicPhrase = '{REPLACE_WITH_WALLET_PHRASE}'
const providerUrl = '{REPLACE_WITH_RINKEBY_LINK}'
 
module.exports = {
  solidity: "0.8.4",
  networks: {
    bsc_testnet: {
      url: providerUrl,
      accounts: {
        mnemonic: memonicPhrase
      }
    }
  }
};

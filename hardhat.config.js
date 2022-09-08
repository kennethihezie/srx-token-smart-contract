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
// const memonicPhrase = '{REPLACE_WITH_WALLET_PHRASE}'
// const testnetUrl = '{REPLACE_WITH_BSC_LINK}'
// const mainnetUrl = "{REPLACE_WITH_BSC_LINK}"

module.exports = {
  solidity: "0.8.9",
  networks: {
    testnet: {
      url: testnetUrl,
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: memonicPhrase }
    },
    mainnet: {
      url: mainnetUrl,
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {mnemonic: memonicPhrase }
    },
    bsc_testnet: {
      url: providerUrl,
      accounts: {
        mnemonic: memonicPhrase
      }
    }
  }
};

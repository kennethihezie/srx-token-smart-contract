const { web3 } = require('hardhat');
const { abi, bytecode } = require('../config')
const assert = require('assert')

let accounts;
let tokenContract;
const INITIAL_SUPPLY = '10000000';

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  tokenContract = await new web3.eth.Contract(abi)
  .deploy({ data: bytecode, arguments: [INITIAL_SUPPLY]})
  .send({ from: accounts[0], gas: '5000000'})
})


describe("Token contract", () => {
    it("deploys a contract", async () => {
        //every contract deploy has an address.
        //the ok method checks if the value is defined. if the value is null or undefined the test will fail
        assert.ok(tokenContract.options.address)
    })

    it("transferTokenFromOwner", async() => {
      //transfer from owner to account 1
      await tokenContract.methods.transferTokenFromOwner(accounts[1], '100').send({ from: accounts[0] });
      const balance = await tokenContract.methods.getBalanceOf(accounts[1]).call();
      console.log('transfer balance', balance);
    })

    it("transferToken", async () => {
      //transfer from owner to account 1
      await tokenContract.methods.transferTokenFromOwner(accounts[1], '100').send({ from: accounts[0] });
      const currentBal = await tokenContract.methods.getBalanceOf(accounts[1]).call();
      console.log('current balance ', currentBal);
      //transfer from account[1] to account[2]
      await tokenContract.methods.transferToken(accounts[2], '20').send({ from: accounts[1] })
      const balance = await tokenContract.methods.getBalanceOf(accounts[2]).call();
      console.log('transfer balance', balance);
    })

    it("buyToken", async () => {
      //buy token with account[3]
      await tokenContract.methods.buyToken(accounts[3]).send({ from: accounts[0], value: web3.utils.toWei('0.0000000000000001', 'ether') })
      const balance = await tokenContract.methods.getBalanceOf(accounts[3]).call();
      console.log('transfer balance', balance);
      const ethBalance = await tokenContract.methods.getOwnerEtherBalance().call({ from: accounts[0] })
      console.log('ether balance ', ethBalance);
    })

    it("sellToken", async () =>  {
      await tokenContract.methods.transferTokenFromOwner(accounts[4], '200').send({ from: accounts[0] });
      const userEthBal = await tokenContract.methods.getAddressEtherBalance().call({ from: accounts[4] })
      console.log('userEthBal', userEthBal);
      await tokenContract.methods.sellToken('25').send({ from: accounts[4], value: web3.utils.toWei('1', 'ether') })
      const balance = await tokenContract.methods.getBalanceOf(accounts[4]).call();
      console.log('balance ', balance);
    })

    it('airdrop', async() => {
      const addresses = accounts.slice(1, accounts.length)
      
      //async call using map. nice one gozie.
      await Promise.all(addresses.map(async (address) => {
          await tokenContract.methods.joinAirDrop().send({ from: address })
      }))

      //logs out the address that joined the airdrop
      const airDropAddress = await tokenContract.methods.getAllAirDropAddress().call()
      console.log(airDropAddress);

      //send out tokens
      await tokenContract.methods.sendOutTokensForAirDrop().send({ from: accounts[0]})

      //check if the airdrop array is cleared out after sending out token
      const clearedAirDropAddress = await tokenContract.methods.getAllAirDropAddress().call()
      console.log(clearedAirDropAddress);

      //get balance for one address
      const balance = await tokenContract.methods.getBalanceOf(accounts[1]).call();
      console.log('balance ', balance);
    })

})
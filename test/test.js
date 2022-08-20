const { web3 } = require('hardhat');
const { abi, bytecode } = require('../config')
const assert = require('assert')

let accounts;
let srcContract;
const INITIAL_SUPPLY = '1000000000'

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    srcContract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [INITIAL_SUPPLY] })
    .send({ from: accounts[0], gas: '5000000' })
})

describe('Token Contract', async () => {
    it('deploys a contract', async () => {
        assert.ok(srcContract.options.address)
    })

    it('get account balance', async () => {
        const balance = await srcContract.methods._getBalanceOf(accounts[0]).call()
        assert.notEqual(balance, 0)
        console.log('balance account[0]: ', balance);
    })

    it('transfer token', async () => {
        const address = accounts[1]
        await srcContract.methods._transferToAccount(address, '100').send({ from: accounts[0] })
        const balance = await srcContract.methods._getBalanceOf(address).call()
        assert.ok(balance)
        console.log('balance account[1]: ', balance);
    })
})
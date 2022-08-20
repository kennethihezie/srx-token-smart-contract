const { web3 } = require('hardhat');
const { abi, bytecode } = require('../config')
const INITIAL_SUPPLY = '5000000000000000000000000000000';

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()
    const result = await new web3.eth.Contract(abi)
         .deploy({ data: bytecode, arguments: [INITIAL_SUPPLY]})
         .send({ gas: '10000000', from: accounts[0] })
    console.log('Contracts deployed at: ' + result.options.address);
}

//deployed at 0x4d0893197C21A49E5A4C4047857f7c376C524e62

deploy()
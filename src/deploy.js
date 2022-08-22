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

//deployed at 0x6fd35043d3f463421EcBE1E24F83496a12DF235d

deploy()
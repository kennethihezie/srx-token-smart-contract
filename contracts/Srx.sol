//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Srx is ERC20 {
    string public _tokenName = "StarrexToken";
    string public _tokenSymbol = "STX";
    address public _owner;

    constructor(uint256 initialSupply) ERC20(_tokenName, _tokenSymbol){
        _owner = msg.sender;
        _mint(_owner, initialSupply);
    }

    modifier _amountChecker(uint256 amount){
        require(address(msg.sender).balance > amount);
        _;
    }

    function _getBalanceOf(address account) public view returns(uint256) {
        return balanceOf(account);
    }

    function _transferToAccount(address to, uint256 amount) public payable _amountChecker(amount) returns(bool) {
        return transfer(to, amount);
    } 
}

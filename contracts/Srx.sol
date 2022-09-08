//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Srx is ERC20 {
    string public _tokenName = "StarrexToken";
    string public _tokenSymbol = "SRX";
    address public _owner;
    address[] public _airDropAddress;



    constructor(uint256 initialSupply) ERC20(_tokenName, _tokenSymbol){
        _owner = msg.sender;
        _mint(_owner, initialSupply);
    }

    modifier _restricted() {
        require(msg.sender == _owner);
        _;
    }

   function getEtherBalance() public view returns(uint256) {
        return address(msg.sender).balance;
    }

     function getContractBalance() public view _restricted returns(uint256) {
        return address(this).balance;
    }

     function getBalanceOf(address account) public view returns(uint256) {
        //calling ERC20 contract balanceOf method which returns uint256
        return balanceOf(account);
    }

    function getAllAirDropAddress() public view returns(address[] memory airdrop) {
        return _airDropAddress;
    }

    //call by anyone to transfer token
    function transferToken(address to, uint256 amount) public payable {
        //Set the amount of allowance the spender is allowed to transfer from the function caller balance
        approve(msg.sender, amount);
        transferFrom(msg.sender, to, amount);
    }

    function buyToken() public payable {
        //get user amount to buy
        uint256 amount = msg.value;

        //get the contract srt balance
        uint256 balance = balanceOf(_owner);

        require(amount > 0, "Amount must be greater than 0");
        require(amount < balance, "No srt on the contract");

        _approve(_owner, msg.sender, amount);
        //call the erc20 transfer method
        transferFrom(_owner, msg.sender, amount);
    }

     function sellToken(uint256 amount) public payable {
       require(amount > 0, "Amount must be greater than 0");

        //for you to sell srt token you will need to to pay 20 wei
        require(msg.value >= 20 wei, "20 wei is required");

       //check if the contract have ether.
       require(address(this).balance > amount, "Insufficent ether");

       //call the approve method
        approve(msg.sender, amount);

        //call your transfer token method
        transferToken(address(this), amount);

        //transfer the ether to the address.
        payable(msg.sender).transfer(amount);
    }

    function joinAirDrop() public {
        _airDropAddress.push(msg.sender);
    }

    function sendOutTokensForAirDrop(uint256 amount) public _restricted payable {
        for (uint256 index = 0; index < _airDropAddress.length; index++) {
            approve(_owner, amount);
            //send 100 srt to all addresses that joined the air drop
            transferFrom(_owner, _airDropAddress[index], amount);
        }

        //clear out the airDropAddress
        _airDropAddress = new address[](0);
    }

}

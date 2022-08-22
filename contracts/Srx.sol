//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
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

    modifier _amountChecker(uint256 amount){
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(address(msg.sender).balance > amount);
        _;
    }

    modifier _restricted() {
        require(msg.sender == _owner);
        _;
    }

    function getOwnerEtherBalance() _restricted public view returns(uint256) {
       return address(this).balance;
    }

    function getAddressEtherBalance() public view returns(uint256) {
        return address(msg.sender).balance;
    }

     function getBalanceOf(address account) public view returns(uint256) {
        //calling ERC20 contract balanceOf method which returns uint256
        return balanceOf(account);
    }

    function getAllAirDropAddress() public view returns(address[] memory airdrop) {
        return _airDropAddress;
    }

    //call only by the contract owner
    function transferTokenFromOwner(address to, uint256 amount) _amountChecker(amount) payable public {
        //Set the amount of allowance the owner is allowed to transfer from the function caller balance
        approve(_owner, amount);
        //calling ERC20 contract transfer method which returns boolean
        transfer(to, amount);            
    }

    //call by anyone to transfer token
    function transferToken(address to, uint256 amount) public payable {
        //Set the amount of allowance the spender is allowed to transfer from the function caller balance
        approve(msg.sender, amount);
        transferFrom(msg.sender, to, amount);
    }

    function buyToken(address buyer) public payable {
        //get user amount to buy
        uint256 amountToBuy = msg.value;

        //get the contract srt balance
        uint256 contractBalance = balanceOf(_owner);

        require(amountToBuy > 0, "Amount must be greater than 0");
        require(amountToBuy < contractBalance, "No srt on the contract");

        //call the erc20 transfer method
        transferTokenFromOwner(buyer, amountToBuy);
    }

     function sellToken(uint256 amount) public payable {
       require(amount > 0, "Amount must be greater than 0");

        //for you to sell srt token you will need to to pay .01 ether
       require(msg.value >= .01 ether, "0.01 ether is required");

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

    function sendOutTokensForAirDrop() public _restricted payable {
        for (uint256 index = 0; index < _airDropAddress.length; index++) {
            //send 100 srt to all addresses that joined the air drop
            transferTokenFromOwner(_airDropAddress[index], 100);
        }

        //clear out the airDropAddress
        _airDropAddress = new address[](0);
    }

}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MORTToken is ERC20 {
    IERC20 public tokenOne = IERC20(address(0x));
    IERC20 public tokenTwo=  IERC20(address(this));

    constructor(uint256 initialSupply) ERC20("Choose Your Own NFT", "MORT") {
        _mint(msg.sender, initialSupply);
    }
    
    event TestEmit (uint amount,address sender, bool sent);

    modifier valueNotZero(){
        require(msg.value > 0, 'the amount must be greater than 0');
        _;
    }

    function getBalanceETH() external view returns(uint balance){
		return address(this).balance;
	}
    
    function swapEthereumtoMORT() public payable valueNotZero {
        uint amountTransfert = msg.value * 100 / 1;
        require(amountTransfert < balanceOf(address(this)), 'Total supply Mort token has been sell now');
        bool sent = tokenTwo.transfer(msg.sender, amountTransfert);
        require(sent, "Failed to send MORT");
    }

    function swapMORTtoEthereum(uint _amountMORT) public payable {
        require(_amountMORT >= 100, 'the amount of MORT must be greater than or equal to 100');
        uint amountTransfert = _amountMORT * 1 / 100;
        require(amountTransfert < address(this).balance, 'Total supply ETH has been sell now');
        require(tokenTwo.allowance(msg.sender, address(this)) >= _amountMORT, "Token 2 allowance too low");
        _safeTransferFrom(tokenTwo, msg.sender, address(this), _amountMORT);
        (bool sent, )= address(msg.sender).call{value: amountTransfert}("");
        require(sent, "Failed to send ETH");
    }

    function _safeTransferFrom(IERC20 token, address sender, address recipient, uint amount) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }
    
}

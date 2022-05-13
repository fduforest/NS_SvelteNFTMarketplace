// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

contract SimpleStorage {
    uint256 data = 5;

    function set(uint256 x) public {
        data = x;
    }

    function get() public view returns (uint256) {
        return data;
    }
}

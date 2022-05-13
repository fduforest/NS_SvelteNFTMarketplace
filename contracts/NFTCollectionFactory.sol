// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// importing the ERC-721 contract to deploy a collection
import "./NFTCollection.sol";

/**
 * @notice Give the ability to deploy a contract to manage ERC-721 tokens for a collection.
 * @dev    If the contract is already deployed for a _collectionName, it will revert.
 */
contract NFTCollectionFactory {
    event NFTCollectionCreated(
        string _collectionName,
        string _collectionSymbol,
        address _collectionAddress,
        uint256 _timestamp
    );

    /**
     * @notice Deploy the ERC-721 Collection contract of the artist caller to be able to create NFTs later
     * @return collectionAddress the address of the created collection contract
     */
    function createNFTCollection(
        string memory _collectionName,
        string memory _collectionSymbol
    ) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = abi.encodePacked(
            type(NFTCollection).creationCode,
            abi.encode(_collectionName, _collectionSymbol)
        );
        // Make a random salt based on the artist name
        bytes32 salt = keccak256(
            abi.encodePacked(_collectionName, _collectionSymbol)
        );

        assembly {
            collectionAddress := create2(
                0,
                add(collectionBytecode, 0x20),
                mload(collectionBytecode),
                salt
            )
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, "collectionAddress is empty")
                //revert(0, 0)
            }
        }

        NFTCollection(collectionAddress).initialize(
            _collectionName,
            _collectionSymbol
        );

        emit NFTCollectionCreated(
            _collectionName,
            _collectionSymbol,
            collectionAddress,
            block.timestamp
        );
    }
}

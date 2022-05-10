// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./NFTCollection.sol";

/// @title NFT Factory contract
/// @author Pire Yohan  , Duforest François, Khoury Alexandre
/// @notice Iinitialize collections of NFTs
/// @dev The contract code contains comments for developers only visible in the source code

contract Factory {
    /// @notice event for collection creation
    /// @param _NFTName NFT name
    /// @param _collectionAddress Address of the collection
    /// @param _timestamp Timestamp of the creation
    event NFTCollectionCreated(
        string _NFTName,
        address _collectionAddress,
        uint256 _timestamp,
        address _creator
    );

    /// @notice creation of a NFT Collection
    /// @param _NFTName NFT name
    /// @param _NFTSymbole Symbol of the NFT
    /// @return collectionAddress Address of the collection
    function createNFTCollection(string memory _NFTName,string memory _NFTSymbole) external returns (address collectionAddress) {
        // Import the bytecode of the contract to deploy
        bytes memory collectionBytecode = type(NFTCollection).creationCode;
        
        // Random NFT name
        bytes32 salt = keccak256(abi.encodePacked(_NFTName));
        assembly {
            collectionAddress := create2(
                0,
                add(collectionBytecode, 0x20),
                mload(collectionBytecode),
                salt
            )
            if iszero(extcodesize(collectionAddress)) {
                // revert if something gone wrong (collectionAddress doesn't contain an address)
                revert(0, 0)
            }
        }
        NFTCollection(collectionAddress).initialize(_NFTName, _NFTSymbole);// Initialize the contrat NFTCollection with settings
        emit NFTCollectionCreated(_NFTName, collectionAddress, block.timestamp, msg.sender); // Event to know the timestamp
    }
}

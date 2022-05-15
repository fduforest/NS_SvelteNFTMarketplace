// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

///@title NFT Collection contract.
///@author Duforest François
///@notice Give the ability to create ERC-721 NFT tokens collection
contract NFTCollection is Initializable, ERC721URIStorageUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    /// NFT Structure
    struct NFT {
        address _to;
        string _tokenURI;
        string _hash;
        address _collectionAddress;
        string _name;
        string _description;
        uint256 _price;
    }

    ///Collection Array of NFTs
    NFT[] collection;

    /**
     * @notice initialization of the ERC271 NFT Tokens collection contract
     * @param _collectionName name of the collection
     * @param _collectionSymbol symbol of the collection
     */
    function initialize(
        string memory _collectionName,
        string memory _collectionSymbol
    ) public initializer {
        __ERC721_init(_collectionName, _collectionSymbol);
    }

    /**
     * @notice mint ERC271 NFT Token
     * @param _tokenURI Token URI
     * @param _hash The IPFS CID
     * @param _name Description of the NFT
     * @param _description Description of the NFT
     * @param _price NFT price
     * @return newItemId New id of the item that has been minted
     */

    function mint(
        string memory _tokenURI,
        string memory _hash,
        string memory _name,
        string memory _description,
        uint256 _price
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        collection.push(
            NFT(
                msg.sender,
                _tokenURI,
                _hash,
                address(this),
                _name,
                _description,
                _price
            )
        );
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        return tokenId;
    }
}

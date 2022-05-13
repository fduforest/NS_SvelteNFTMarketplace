// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract NFTCollection is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;
    address collectionAddress;

    /// NFT Structure, description
    struct NFT {
        address _to;
        string _tokenURI;
        address _collectionAddress;
        string _name;
        string _description;
        string _tag;
        uint256 _price;
        bool _favorite;
    }

    NFT[] collection; //Collection Array of NFTs

    constructor(address _collectionAddress) {
        _disableInitializers();
        collectionAddress = _collectionAddress;
    }

    function initialize(
        string memory _collectionName,
        string memory _collectionSymbol
    ) public initializer {
        __ERC721_init(_collectionName, _collectionSymbol);
        __ERC721URIStorage_init();
        __Ownable_init();
    }

    function safeMint(
        address _to,
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        string memory _tag,
        uint256 _price,
        bool _favorite
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        collection.push(
            NFT(
                _to,
                _tokenURI,
                collectionAddress,
                _name,
                _description,
                _tag,
                _price,
                _favorite
            )
        );
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

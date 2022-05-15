// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title An OpenSea clone
/// @notice A simple NFT marketplace contract
/// @author François Duforest
/// @dev Marketplace Contract still under development

contract NFTMarketplace is ReentrancyGuard, Ownable {
    // using is used for including a library within a contract in solidity
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    //mapping(string => uint8) hashes;
    //address contractAddress;
    uint256 listingPrice = 0.025 ether;

    struct NftItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable creator;
        address payable owner;
        address payable seller;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => NftItem) private nftItemIds;

    event nftItemAdded(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address owner,
        uint256 price,
        bool sold
    );

    event sale(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price
    );

    // ::::::::::::: MINT ::::::::::::: //

    /// @notice Function for allowing an address to mint an NFT & authorize the marketplace to transfer sold items from sender address to the buyer's address.
    /// @param _to The address of the recipient (owner of the nft)
    /// @param _hash The CID hash
    /// @param _metadata The json metadata CID hash
    /// @return tokenId The NFT token id
    function mint(
        address _to,
        string memory _hash,
        string memory _metadata
    ) public returns (uint256) {
        // Check if the token has been already minted
        require(hashes[_hash] != 1);
        hashes[_hash] = 1;

        // Set a unique token Id
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        // Mint & set Token URI
        _mint(_to, tokenId);
        _setTokenURI(tokenId, _metadata);

        // Authorize the marketplace to transfer sold items from owner address to the marketplace address.
        setApprovalForAll(contractAddress, true);

        return tokenId;
    }

    // ::::::::::::: ADD NFT ITEM ON THE MARKETPLACE ::::::::::::: //

    /// @notice Function for setting NFT item properties put it on the marketplace.
    /// @param _nftContract The address of the contract
    /// @param _tokenId The NFT token id
    /// @param _price The price of the NFT item
    function PutNftItemOnMarket(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) public payable nonReentrant {
        require(_price > 0, "Price must not be 0");
        require(
            msg.value > listingPrice,
            "Price must be equal to listing price"
        );

        _itemIds.increment();
        uint256 _itemId = _itemIds.current();

        // Transfer the ownership of the NFT item to the marketplace contract allowing it to sell the item
        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        // Add the Nft item to the nftItemIds array, set it an id and the marketplace as the new owner
        nftItemIds[_itemId] = NftItem(
            _itemId,
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            _price,
            false
        );

        emit nftItemAdded(
            _itemId,
            _nftContract,
            _tokenId,
            msg.sender,
            address(0),
            _price,
            false
        );
    }
}

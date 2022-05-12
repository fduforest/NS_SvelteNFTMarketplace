// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";


/// @title NFTCollection contract
/// @author Pire Yohan  , Duforest François, Khoury Alexandre

contract NFTCollection is Initializable, ERC721URIStorageUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// NFT Struture , description
    struct NFT {
        string name; /// nom Nft
        string description; /// blabla
        string tag; /// son tag NFT
        address tokenAddress; /// son adresse
        uint256 price; /// Prix
        bool favorite; /// Favoris oui ou non
     
    }
    NFT[] collection; //Array NFT name Collection

    /// @notice initialization of the ERC271
    /// @param _name name of the collection
    /// @param _symbol symbol of the collection
    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC721_init(_name, _symbol);
    }

    /** @notice mint from the collection
     * @param _user NFT and collection user
     * @param _tokenURI Token
     * @param _name Description of the NFT
     * @param _description Description of the NFT
     * @param _tag Tag of the NFT
     * @param _tokenAddress address du token
     * @param _price NFT price
     * @param _favorite NFT favorite
     * @return newItemId New id of the item that has been minted
     */

    function MintNFTCollection(
        address _user,
        string memory _tokenURI,
        string memory _name,
        string memory _description,
        string memory _tag,
        address _tokenAddress,
        uint256 _price,
        bool _favorite,
    ) public returns (uint256) {
        _tokenIds.increment();
        collection.push(
            NFT(
                _name,
                _description,
                _tag,
                _tokenAddress,
                _price,
                _favorite,
            )
        );
        uint256 newItemId = _tokenIds.current();
        _mint(_user, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }
}

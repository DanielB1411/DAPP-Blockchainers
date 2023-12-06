// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ClubBlockchainers is ERC721URIStorage {
  uint256 private _tokenIds;
  address marketplaceContract;
  event ItemMinted(uint256);

  constructor(address _marketplaceContract) ERC721("Club Blockchainers", "CB") {
    marketplaceContract = _marketplaceContract;
  }

  function mint(string memory _tokenURI) public {
    _tokenIds++;
    uint256 newTokenId = _tokenIds;
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, _tokenURI);
    setApprovalForAll(marketplaceContract, true);
    emit ItemMinted(newTokenId);
  }
}

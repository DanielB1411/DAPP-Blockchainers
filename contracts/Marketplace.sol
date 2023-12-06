// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
  uint256 private _itemsSold;
  uint256 private _itemCount;
  uint256 public LISTING_FEE = 0 ether;
  address payable private _marketOwner;
  mapping(uint256 => Item) private _idToItem;
  mapping(uint256 => Rentable) private _idToRent;

  struct Item {
    address itemContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool listed;
    bool rentable;
    uint256 duration;
  }

  struct Rentable{
    address itemContract;
    uint256 tokenId;
    address payable seller;
    address payable renter;
    uint256 price;
    uint256 duration;
  }

  event ItemListed(
    address itemContract, uint256 tokenId, address seller, address owner, uint256 price
  );

  event ItemListedRent(
    address itemContract, uint256 tokenId, address seller, address owner, uint256 price, uint256 duration
  );

  event ItemSold(
    address itemContract, uint256 tokenId, address seller, address owner, uint256 price
  );

  event ItemRented(
    address itemContract, uint256 tokenId, address seller, address owner, uint256 price, uint256 duration
  );

  constructor() {
    _marketOwner = payable(msg.sender);
  }

  // List item on marketplace
  function listItem(address _itemContract, uint256 _tokenId, uint256 _price) public payable nonReentrant {
    require(_price > 0, "Price must be greater than 0.");
    require(msg.value == LISTING_FEE, "Please remove value before listing item, listing fee is free.");

    IERC721(_itemContract).transferFrom(msg.sender, address(this), _tokenId);
    _marketOwner.transfer(LISTING_FEE);
    _itemCount++;

    _idToItem[_tokenId] = Item(
      _itemContract,
      _tokenId, 
      payable(msg.sender),
      payable(address(this)),
      _price,
      true,
      false,
      0
    );

    emit ItemListed(_itemContract, _tokenId, msg.sender, address(this), _price);
  }

    // List item for rent on marketplace
  function listItemForRent(address _itemContract, uint256 _tokenId, uint256 _price, uint256 rentSeconds) public payable nonReentrant {
    require(_price > 0, "Price must be greater than 0.");
    require(msg.value == LISTING_FEE, "Please remove value before listing item, listing fee is free.");

    IERC721(_itemContract).transferFrom(msg.sender, address(this), _tokenId);
    _marketOwner.transfer(LISTING_FEE);
    _itemCount++;

    _idToRent[_tokenId] = Rentable(
      _itemContract,
      _tokenId, 
      payable(msg.sender),
      payable(address(this)),
      _price,
      rentSeconds
    );

    emit ItemListedRent(_itemContract, _tokenId, msg.sender, address(this), _price, rentSeconds);
  }


  // Buy item
  function buyItem(address _itemContract, uint256 _tokenId) public payable nonReentrant {
    Item storage item = _idToItem[_tokenId];
    require(msg.value >= item.price, "Insufficient funds to purchase item.");

    address payable buyer = payable(msg.sender);
    payable(item.seller).transfer(msg.value);
    IERC721(_itemContract).transferFrom(address(this), buyer, item.tokenId);
    item.owner = buyer;
    item.listed = false;

    _itemsSold++;
    emit ItemSold(_itemContract, item.tokenId, item.seller, buyer, msg.value);
  }

  // Rent item
  function rentItem(address _itemContract, uint256 _tokenId) public payable nonReentrant {
    Rentable storage rentable = _idToRent[_tokenId];
    require(msg.value >= rentable.price, "Insufficient funds to rent item.");

    address payable buyer = payable(msg.sender);
    payable(rentable.seller).transfer(msg.value);

    rentable.renter = buyer;
    uint256 deadline = block.timestamp + rentable.duration;
    _idToRent[_tokenId].duration = deadline;

    _itemsSold++;
    emit ItemRented(_itemContract, rentable.tokenId, rentable.seller, buyer, msg.value, rentable.duration);
  }

  // Recall rented item
  function recallItem(uint256 _tokenId) public payable nonReentrant {
    require(msg.sender == _idToRent[_tokenId].seller, "Must own the item to recall it from renter.");
    require(block.timestamp >= _idToRent[_tokenId].duration, "Cannot recall item yet.");

    _idToRent[_tokenId].renter = _idToRent[_tokenId].seller;

    _itemsSold--;
    delete _idToRent[_tokenId];
  }


  // Resell item
  function resellItem(address _itemContract, uint256 _tokenId, uint256 _price) public payable nonReentrant {
    require(_price > 0, "Price must be at least 1 wei");
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

    IERC721(_itemContract).transferFrom(msg.sender, address(this), _tokenId);

    Item storage item = _idToItem[_tokenId];
    item.seller = payable(msg.sender);
    item.owner = payable(address(this));
    item.listed = true;
    item.price = _price;

    _itemsSold--;
    emit ItemListed(_itemContract, _tokenId, msg.sender, address(this), _price);
  }

  function getListedItems() public view returns (Item[] memory) {
    uint256 itemCount = _itemCount;
    uint256 unsoldItemsCount = itemCount - _itemsSold;

    Item[] memory items = new Item[](unsoldItemsCount);
    uint itemsIndex = 0;
    for (uint i = 0; i < itemCount; i++) {
      if (_idToItem[i + 1].listed) {
        items[itemsIndex] = _idToItem[i + 1];
        itemsIndex++;
      }
    }
    return items;
  }

  function getMyItems() public view returns (Item[] memory) {
    uint itemCount = _itemCount;
    uint myItemCount = 0;
    for (uint i = 0; i < itemCount; i++) {
      if (_idToItem[i + 1].owner == msg.sender) {
        myItemCount++;
      }
    }

    Item[] memory items = new Item[](myItemCount);
    uint itemsIndex = 0;
    for (uint i = 0; i < itemCount; i++) {
      if (_idToItem[i + 1].owner == msg.sender) {
        items[itemsIndex] = _idToItem[i + 1];
        itemsIndex++;
      }
    }
    return items;
  }

  function getMyListedItems() public view returns (Item[] memory) {
    uint itemCount = _itemCount;
    uint myListedItemCount = 0;
    for (uint i = 0; i < itemCount; i++) {
      if (_idToItem[i + 1].seller == msg.sender && _idToItem[i + 1].listed) {
        myListedItemCount++;
      }
    }

    Item[] memory items = new Item[](myListedItemCount);
    uint itemsIndex = 0;
    for (uint i = 0; i < itemCount; i++) {
      if (_idToItem[i + 1].seller == msg.sender && _idToItem[i + 1].listed) {
        items[itemsIndex] = _idToItem[i + 1];
        itemsIndex++;
      }
    }
    return items;
  }
}

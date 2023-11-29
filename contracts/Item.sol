// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Item is Ownable {
    // Variables
    string public itemName;
    address public currentOwner;
    uint256 public price;
    bool public forSale;

    // Events
    event ItemTransferred(address indexed previousOwner, address indexed newOwner, uint256 price);
    event ItemPriceUpdated(uint256 newPrice);
    event ItemStatusChanged(bool forSaleStatus);

    // Constructor
    constructor(string memory _itemName, uint256 _initialPrice) Ownable(msg.sender){
        itemName = _itemName;
        price = _initialPrice;
        currentOwner = msg.sender;
        forSale = false;
    }

    function transferOwnershipNewAddress(address newOwner) external onlyOwner {
        //require(msg.sender == this.currentOwner);
        forSale = false;
        transferOwnership(newOwner);
    }

    function changePrice(uint256 _newPrice) external onlyOwner {
        price = _newPrice;
        emit ItemPriceUpdated(_newPrice);
    }

    function changeSaleStatus(bool _forSale) external onlyOwner {
        forSale = _forSale;
        emit ItemStatusChanged(_forSale);
    }

    function buyItem() external payable {
        require(forSale, "Item is not for sale");
        require(msg.value >= price, "Insufficient funds");

        address payable previousOwner = payable(currentOwner);
        //transferOwnership(address(this));
        //this.transferOwnership(msg.sender);
        forSale = false;

        previousOwner.transfer(price);

        address previousOwnerAddress = currentOwner;
        currentOwner = msg.sender;

        emit ItemTransferred(previousOwnerAddress, msg.sender, price);
    }

    function getItemDetails() external view returns (
        string memory,
        address,
        uint256,
        bool
    ) {
        return (itemName, currentOwner, price, forSale);
    }
}
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Item is Ownable {
    // Variables
    string public itemName;
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
        forSale = false;
    }

    function transferOwnershipNewAddress(address newOwner) external onlyOwner {
        //require(msg.sender == this.currentOwner);
        forSale = false;
        transferOwnership(newOwner);

        
        //also is there really a need for currentOwner if we are using the Ownable module? removed it and used owner() instead each time.
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

        address payable previousOwner = payable(owner());
        //transferOwnership(address(this));
        //this.transferOwnership(msg.sender);
        forSale = false;
        previousOwner.transfer(price);

        //need to transfer ownership but cant because it needs to be done by ownable! :(
        //transferOwnership(msg.sender);
        emit ItemTransferred(owner(), msg.sender, price);
    }

    function getItemDetails() external view returns (
        string memory,
        address,
        uint256,
        bool
    ) {
        return (itemName, owner(), price, forSale);
    }
}
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

contract Time{

    uint public Time;

    constructor(uint _Time){
        Time = _Time;
    }

    function getCurrentTime()public view returns(uint){
        return block.timestamp;
    }

}
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Guestbook {
    // Goal: Users can sign with a message
    // Goal: Users can optionally leave some ETH

    event NewEntry(address signer, uint256 index);

    struct Entry {
        address signer;
        string message;
        uint256 gift;
    }

    Entry[] public entries;

    function getEntries() external view returns (Entry[] memory) {
        return entries;
    }

    function sign(string memory _message) external payable {
        entries.push(
            Entry({signer: msg.sender, message: _message, gift: msg.value})
        );

        uint pseudoRand = uint(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number))));

        emit NewEntry(msg.sender, entries.length - 1);
    }

    function unused(uint256 foo, bool bar) external returns (uint256) {
        require(foo > 0, "foo must be greater than 0");
        if (bar) {
            return block.timestamp;
        } else {
            return 42;
        }
    }
}

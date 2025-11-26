// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReputationNFT {
    string public name = "MatchOS Reputation";
    string public symbol = "REP";
    
    struct Reputation {
        uint256 score;
        string category;
        uint256 timestamp;
    }
    
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => Reputation) public reputationData;
    
    uint256 public nextTokenId;
    address public admin;
    
    event Minted(address indexed to, uint256 tokenId, uint256 score, string category);
    
    constructor() {
        admin = msg.sender;
    }
    
    function mint(address to, uint256 score, string memory category) external {
        require(msg.sender == admin, "Only admin");
        uint256 tokenId = nextTokenId++;
        ownerOf[tokenId] = to;
        balanceOf[to]++;
        reputationData[tokenId] = Reputation(score, category, block.timestamp);
        emit Minted(to, tokenId, score, category);
    }
    
    function transfer(address to, uint256 tokenId) external pure {
        revert("Soulbound: Transfer not allowed");
    }
    
    function transferFrom(address from, address to, uint256 tokenId) external pure {
        revert("Soulbound: Transfer not allowed");
    }
}

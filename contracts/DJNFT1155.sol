// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DJNFT1155 is
    ERC1155,
    Ownable,
    Pausable,
    ERC1155Burnable,
    ERC1155Supply
{
    using Strings for string;

    constructor()
        ERC1155("ipfs://QmUFn4D6frxzELtpHCDSqyx4G4gHjshwvbY8BASqMyMVuF/")
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(
            exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        require(
            balanceOf(msg.sender, tokenId) > 0,
            "You do not own token need to mint to access"
        );
        string memory baseURI = super.uri(tokenId);
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }

    modifier mintCheck(uint256 amount) {
        require(amount >= 1, "Need to mint at least one or more");
        require(
            totalSupply(0) + amount <= 100,
            "Can no longer mint! Out of supply/amount exceeds available"
        );
        require(
            msg.value == 0.0001 ether * amount,
            "Cannot mint without ether!"
        );
        _;
    }

    function mint(uint256 amount) public payable mintCheck(amount) {
        _mint(msg.sender, 0, amount, "");
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}

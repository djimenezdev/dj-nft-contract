// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract DJNFT is ERC721, ERC721Enumerable {
    using Strings for string;

    constructor() ERC721("DJNFT", "DJN") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmUFn4D6frxzELtpHCDSqyx4G4gHjshwvbY8BASqMyMVuF/";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        require(
            msg.sender == ownerOf(tokenId),
            "You are not the owner of this token"
        );

        string memory baseURI = _baseURI();
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

    modifier mintCheck() {
        require(balanceOf(msg.sender) == 0, "You can only mint one!");
        require(totalSupply() < 3, "Can no longer mint!");
        require(msg.value == 0.0001 ether, "Cannot mint without ether!");
        _;
    }

    function mint() external payable mintCheck {
        _safeMint(msg.sender, totalSupply());
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}

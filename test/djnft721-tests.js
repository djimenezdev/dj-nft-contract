const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DJNFT721 Contract", function () {
  let DJNFT, addr1, addr2, addr3, addr4;

  beforeEach(async function () {
    let DJNFTF = await ethers.getContractFactory("DJNFT");

    DJNFT = await DJNFTF.deploy();
    [, addr1, addr2, addr3, addr4] = await ethers.getSigners();
  });
  describe("Minting", function () {
    it("Should mint & console log tokenId", async function () {
      const mintTx = await DJNFT.connect(addr1).mint({
        value: ethers.utils.parseEther("0.0001"),
      });
      // wait until the transaction is mined
      await mintTx.wait();
      expect(await DJNFT.connect(addr1).tokenURI(0)).to.equal(
        "ipfs://QmUFn4D6frxzELtpHCDSqyx4G4gHjshwvbY8BASqMyMVuF/0.json"
      );
    });
  });
  describe("User checks", function () {
    it("Should not mint if balance is insufficient", async function () {
      await expect(
        DJNFT.connect(addr1).mint({
          value: ethers.utils.parseEther("0.0000001"),
        })
      ).to.be.revertedWith("Cannot mint without ether!");
    });
    it("Should return error if not tokenId does not exist", async function () {
      await expect(DJNFT.connect(addr1).tokenURI(1)).to.be.revertedWith(
        "ERC721Metadata: URI query for nonexistent token"
      );
    });
    it("Should return error if not owner of token id", async function () {
      const mintTx = await DJNFT.connect(addr1).mint({
        value: ethers.utils.parseEther("0.0001"),
      });
      await expect(DJNFT.connect(addr2).tokenURI(0)).to.be.revertedWith(
        "You are not the owner of this token"
      );
    });
    it("Should return error if user tries to mint more than once", async function () {
      const mintTx = await DJNFT.connect(addr1).mint({
        value: ethers.utils.parseEther("0.0001"),
      });
      // wait until the transaction is mined
      await mintTx.wait();

      await expect(
        DJNFT.connect(addr1).mint({
          value: ethers.utils.parseEther("0.0001"),
        })
      ).to.be.revertedWith("You can only mint one!");
    });
    it("Should return error if supply is gone", async function () {
      const mintTxOne = await DJNFT.connect(addr1).mint({
        value: ethers.utils.parseEther("0.0001"),
      });
      // wait until the transaction is mined
      await mintTxOne.wait();
      const mintTxTwo = await DJNFT.connect(addr2).mint({
        value: ethers.utils.parseEther("0.0001"),
      });
      // wait until the transaction is mined
      await mintTxTwo.wait();
      const mintTxThree = await DJNFT.connect(addr3).mint({
        value: ethers.utils.parseEther("0.0001"),
      });
      // wait until the transaction is mined
      await mintTxThree.wait();
      const mintTxFour = await expect(
        DJNFT.connect(addr4).mint({
          value: ethers.utils.parseEther("0.0001"),
        })
      ).to.revertedWith("Can no longer mint!");
    });
  });
});

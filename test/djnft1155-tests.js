const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("DJNFT1155 Contract", function () {
  let DJNFT, addr1, addr2, addr3, addr4;
  beforeEach(async function () {
    let DJNFTF = await ethers.getContractFactory("DJNFT1155");
    [, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    DJNFT = await DJNFTF.deploy();
  });

  describe("Minting", function () {
    it("Should mint two tokenIds", async function () {
      const mintTx = await DJNFT.connect(addr1).mint(2, {
        value: ethers.utils.parseEther("0.0002"),
      });
      // wait until the transaction is mined
      await mintTx.wait();

      //   expect token balance to be two
      const ownerBalance = await DJNFT.balanceOf(addr1.address, 0);
      expect(BigNumber.from(ownerBalance)).to.equal(BigNumber.from(2));
    }); //   expect token uri
    it("Expect uri if user owns tokenid", async function () {
      const mintTx = await DJNFT.connect(addr1).mint(1, {
        value: ethers.utils.parseEther("0.0001"),
      });
      // wait until the transaction is mined
      await mintTx.wait();
      expect(await DJNFT.connect(addr1).uri(0)).to.equal(
        "ipfs://QmUFn4D6frxzELtpHCDSqyx4G4gHjshwvbY8BASqMyMVuF/0.json"
      );
    });
  });
  describe("User checks", function () {
    it("Should not mint if amount is not greater than one/undefined", async function () {
      await expect(
        DJNFT.connect(addr1).mint(0, {
          value: ethers.utils.parseEther("0.0002"),
        })
      ).to.be.revertedWith("Need to mint at least one or more");
    });
    it("Amount of minted tokens should not be greater than available supply", async function () {
      await expect(
        DJNFT.connect(addr1).mint(101, {
          value: ethers.utils.parseEther("0.0101"),
        })
      ).to.be.revertedWith(
        "Can no longer mint! Out of supply/amount exceeds available"
      );
    });
    it("Should not be able to mint if eth val is insufficient", async function () {
      await expect(
        DJNFT.connect(addr1).mint(2, {
          value: ethers.utils.parseEther("0.0001"),
        })
      ).to.be.revertedWith("Cannot mint without ether!");
    });
    it("Should not be able to fetch uri if non existent", async function () {
      await expect(DJNFT.connect(addr1).uri(0)).to.be.revertedWith(
        "ERC721Metadata: URI query for nonexistent token"
      );
    });
    it("Should not be able to fetch uri if user does not own token", async function () {
      const mintTx = await DJNFT.connect(addr1).mint(2, {
        value: ethers.utils.parseEther("0.0002"),
      });
      await expect(DJNFT.connect(addr2).uri(0)).to.be.revertedWith(
        "You do not own token need to mint to access"
      );
    });
  });
});

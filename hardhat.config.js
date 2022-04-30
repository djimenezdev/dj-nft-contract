const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  "DJNFT721",
  "deploy DJNFT721 to selected network. Use network param to specify configured network",
  async function (taskArgs, hre) {
    await hre.run("run", {
      script: "scripts/djnft-erc721script.js",
    });
  }
);

task(
  "DJNFT1155",
  "deploy DJNFT1155 to selected network. Use network param to specify configured network",
  async (taskArgs, hre) => {
    await hre.run("run", {
      script: "scripts/djnft-erc1155script.js",
    });
  }
);

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.13",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.PROJECT_ID,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/" + process.env.PROJECT_ID,
      accounts: [`${process.env.PRIVATE_KEY_TWO}`],
    },
  },
};

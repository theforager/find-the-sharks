require("@nomiclabs/hardhat-waffle");

const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;
const ALCHEMY_RINKEBY_KEY = process.env.ALCHEMY_RINKEBY_KEY;
const ALCHEMY_MAINNET_KEY = process.env.ALCHEMY_MAINNET_KEY;



/**
 * Print List of Accounts for the Network
 */
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});



/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
   solidity: "0.8.6",
   networks: {
     rinkeby: {
       url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_KEY}`,
       accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
     },
     mainnet: {
       url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_MAINNET_KEY}`,
       accounts: [`0x${MAINNET_PRIVATE_KEY}`],
     },
   }
 };

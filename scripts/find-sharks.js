const hre = require("hardhat");
const { abi } = require("./abi.js");
const { address } = require("./address.js");



/**
 * Setup
 */
let network = hre.network.name;

var provider;
if (network === 'rinkeby') {
  provider = new hre.ethers.providers.AlchemyProvider(network, process.env.ALCHEMY_RINKEBY_KEY);
} else if (network === 'mainnet') {
  provider = new hre.ethers.providers.AlchemyProvider(network, process.env.ALCHEMY_MAINNET_KEY);
} else {
  throw Error('Network not recognized');
}

const auctionHouse = new hre.ethers.Contract(address.auctionHouseProxy[network], abi.auctionHouseProxy, provider);
const nounsSeeder = new hre.ethers.Contract(address.nounsSeeder[network], abi.nounsSeeder, provider);

var nextNounId, signer, auctionHouseSigner, activeMonitoring;



/**
 * Helper Function
 */
const getTimeSeconds = () => Math.floor(Date.now() / 1000);

// Pause block monitoring for number of seconds
function pauseFor(seconds) {
  new Promise(r => {
    activeMonitoring = false;
    console.log(`😴 Sleeping at ${getTimeSeconds()} for ${seconds}s`);
    setTimeout(r, seconds * 1000);
  }).then(() => {
    activeMonitoring = true;
    console.log(`⏰ Awoke at ${getTimeSeconds()}, monitoring...`);
  });
}

// Check if an auction is ended or near ending
function isAuctionNearEnd(auctionEnd) {
  return auctionEnd < getTimeSeconds()+20;
}

// Retrieve the attributes for the next minted Noun
async function getNounSeed(nextId) {
  return nounsSeeder.generateSeed(nextNounId, address.nounsDescriptor[network]);
}

// Settle the Noun auction as quick as possible
async function settleAuction() {
  const tx = await auctionHouseSigner.settleCurrentAndCreateNewAuction();
  await tx.wait();
  return;
}



/**
 * Next Noun Block Analyzer
 *
 * Checks what Noun would be minted by settling on the current block, and if
 * promising, moves to settle the auction.
 */
async function checkBlockForShark(blockNumber) {
  const nextNoun = await getNounSeed(nextNounId);
  console.log(`🧱 Block: ${blockNumber}  NextNounID: ${nextNounId}  Head: ${nextNoun.head}`);

  if (nextNoun.head === 187) {
    console.log(`🦈🦈🦈: SHARK FOUND, SETTLING...`);
    try {
      // TODO: Convert this to Flashbots as simple transactions are not fast enough
      await settleAuction();
      console.log(` > 🚀 Auction settled at ${getTimeSeconds()}`);
    } catch (err) {
      console.log('... Shark settlement failed');
    }
  }

  const auction = await auctionHouse.auction();

  if (nextNounId === auction.nounId || !isAuctionNearEnd(auction.endTime)) {
    console.log(`🔎 Noun ${auction.nounId} ending at ${auction.endTime}`);

    nextNounId = auction.nounId.add(1);

    pauseFor(auction.endTime-getTimeSeconds()-10);
  }
}



/**
 * Main Loop
 *
 * Retrive trieve a few asynchronous values and then initiative block loop
 */
async function main() {
  [signer] = await hre.ethers.getSigners();
  auctionHouseSigner = new hre.ethers.Contract(address.auctionHouseProxy[network], abi.auctionHouseProxy, signer);
  console.log(`🤖 Launching monitoring on ${network} with ${await signer.getAddress()}...`);

  const auction = await auctionHouse.auction();
  nextNounId = auction.nounId.add(1);

  activeMonitoring = true;

  provider.on('block', async (blockNumber) => {
    if (!activeMonitoring) return;
    checkBlockForShark(blockNumber);
  });
}
main()

# Find the Sharks 🦈

Bot to monitor Nouns auctions and attempt to mint a Shark, on behalf of @sharkdao, in the blocks between the end of an auction and settlement by another party.

### Setup & Installation

Install the NPM packages `npm install`

You need four environment variables to pull and sign data on Rinkeby and Mainnet. Two key are for Alchemy access, which is used as the monitoring and signer. The other two keys are private keys for the account you want to used for settlement. This account must have sufficient ETH to settle if a Shark is found.

You can include them in your `~/.zshrc` or `~/.bash_profile` like:

```
export ALCHEMY_RINKEBY_KEY="<API KEY HERE>"
export ALCHEMY_MAINNET_KEY="<API KEY HERE>"
export ROPSTEN_PRIVATE_KEY="0x<PRIVATE KEY HERE>"
export MAINNET_PRIVATE_KEY="0x<PRIVATE KEY HERE>"
```

**[WARNING] DO NOT PUT YOUR PRIVATE KEYS IN THE SCRIPTS!**


### Run Process

Ethereum Mainnet: `npx hardhat run scripts/find-sharks.js --network mainnet`

Rinkeby Test Network: `npx hardhat run scripts/find-sharks.js --network rinkeby`

# Prerequisites
- git
- curl
- docker 
- jq

- Clone the repo
```git clone https://github.com/Bsc-com-ne-23-20/UmodziRx.git```

- Navigate to fabricNetwork/
```cd fabricNetwork```

# Bootstrap the network
- Make all scripts executable, in current and sub-dirs

```find . -type f -name "*.sh" -exec chmod +x {} \;```

- Add binary files to path

```cd primary-network/bin```
```echo -e "\n### UMODZIRX NETWORK PATH\nexport PATH=\$PATH:$(pwd)" >> ~/.bashrc```
```source ~/.bashrc```
```cd ..```

- You must be in primary-network/ to run the network
```./network.sh up createChannel -ca -s couchdb```

- This launches all relevant docker images for the network:
    - peer nodes
    - orderer nodes
    - Certificate authorities
    - couch databases

# Deploy chaincode 

```./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go```

- Chaincode may be deployed without bringing down the network.
- Several chaincodes may be deployed on a single channel, but each chaincode must be unique to each channel.
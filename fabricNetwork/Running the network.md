# Prerequisites
Ensure you have the following tools installed:
- `git`
- `curl`
- `docker`
- `jq`

# Clone the repository

```bash
git clone https://github.com/Bsc-com-ne-23-20/UmodziRx.git
```

Navigate to the `fabricNetwork` directory:

```bash
cd fabricNetwork
```

# Bootstrap the network

### Make all scripts executable (in current and subdirectories)

```bash
find . -type f -name "*.sh" -exec chmod +x {} \;
```

### Add binary files to the path

Navigate to the `primary-network/bin` directory and update the path:

```bash
cd primary-network/bin
echo -e "\n### UMODZIRX NETWORK PATH\nexport PATH=\$PATH:$(pwd)" >> ~/.bashrc
source ~/.bashrc
cd ..
```

### Run the network

You must be in the `primary-network/` directory to run the network:

```bash
./network.sh up createChannel -ca -s couchdb
```

This will launch the following Docker containers for the network:
- Peer nodes
- Orderer nodes
- Certificate Authorities
- CouchDB databases

# Deploy Chaincode

To deploy the chaincode, use the following command:

```bash
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go
```

- Chaincode may be deployed without bringing down the network.
- Several chaincodes may be deployed on a single channel, but each chaincode must be unique to each channel.
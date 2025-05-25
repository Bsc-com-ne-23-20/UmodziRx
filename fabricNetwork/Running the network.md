# Prerequisites
Ensure you have the following installed:
- `git`
- `curl`
- `docker`
- `jq`

Installing prerequisites
```bash
# Installing git, curl and jq
sudo apt install git curl jq
```

```bash
# Installing Docker
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Installing go (v1.22.1)
```bash
cd ~
mkdir downloads
wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz
sudo tar -xvf go1.22.1.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
source ~/.profile
```

# Clone the repository

```bash
git clone https://github.com/Bsc-com-ne-23-20/UmodziRx.git
```

If using Windows, copy the cloned repository to wsl ubuntu 22.04 or later version home
open explorer from wsl by executing:

```bash
/mnt/c/Windows/explorer.exe .
```
copy the fabric folder to the the repository

Navigate to the `fabricNetwork` directory:

```bash
cd fabricNetwork
```


Navigate to the `fabricNetwork` directory

# Bootstrap the network

### Make all scripts executable (in current and subdirectories)

```bash
find . -type f -name "*.sh" -exec chmod +x {} \;
```

### Make binary files executable and add them to path
```
cd ./bin
find . * -exec chmod +x {} \;
echo -e "\n### UmodziRx bin files\nexport PATH=\$PATH:$(pwd)" >> ~/.bashrc
source ~/.bashrc
```

### Run the network
First, bring down the network, get rid of any files from a previous run.
```bash
cd ../primary-network
./primary-network.sh down
```

You must be in the `primary-network/` directory to run the network:

```bash
./primary-network.sh up createChannel -ca -s couchdb
```

This will launch the following Docker containers for the network, one for each organization:
- Peer nodes
- Orderer nodes
- Certificate Authorities
- CouchDB databases

# Deploy Chaincode

To deploy the chaincode, use the following command:

```bash
./primary-network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go
```

- Chaincode may be re-deployed without bringing down the network.
- Several chaincodes may be deployed on a single channel, but each chaincode must be unique to each channel.

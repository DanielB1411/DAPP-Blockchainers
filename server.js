const { Web3 } = require("web3");
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const fs = require('fs');
const { spawn } = require('child_process');
const Tx = require('ethereumjs-tx').Transaction;


 
const app = express();
const port = 3000;
app.use(express.json());


const { ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } = require("web3");
// Replace 'YOUR_INFURA_API_KEY' with your actual Infura API key
//const infuraUrl = 'https://goerli.infura.io/v3/0c0d8ccd8f2a44af806fcba72afae84f';


const web3 = new Web3(
	new Web3.providers.HttpProvider("localhost:8545"),
);


// contract of marketplace
const contractAddress = '0x9d6bAd04445BABB19D72CE7308Df07B4439b0d4B';
const mintAdress = '0x7ca6fc0E2be6fbD1262144157b7eD740856E90e8';

// Replace with your contract ABI
const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nftContract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "buyNft",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nftContract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listNft",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "ReentrancyGuardReentrantCall",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "nftContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "NFTListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "nftContract",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "NFTSold",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_nftContract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "resellNft",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getListedNfts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "nftContract",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address payable",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "listed",
						"type": "bool"
					}
				],
				"internalType": "struct Marketplace.NFT[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyListedNfts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "nftContract",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address payable",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "listed",
						"type": "bool"
					}
				],
				"internalType": "struct Marketplace.NFT[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyNfts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "nftContract",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "address payable",
						"name": "seller",
						"type": "address"
					},
					{
						"internalType": "address payable",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "listed",
						"type": "bool"
					}
				],
				"internalType": "struct Marketplace.NFT[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "LISTING_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]



const mintAbi =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_marketplaceContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "NFTMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_tokenURI",
				"type": "string"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const marketplace = new web3.eth.Contract(contractAbi, contractAddress);
const minter = new web3.eth.Contract(mintAbi, mintAdress);






//not in use
app.post('/createItem', async (req, res) => {
	try {
		// Log specific values from the request body
		console.log('Address:', req.body.address);
		console.log('Item Name:', req.body.itemName);

		console.log(process.env.PRIVATE_KEY);
		const envData = fs.readFileSync('.env', 'utf8');
		const envConfig = dotenv.parse(envData);
		envConfig.PRIVATE_KEY = req.body.address;


		
		

		res.status(200).json({ message: 'Item created successfully' });
	} catch (error) {
		console.error('Error creating item:', error);
		res.status(500).json({ error: error.message }); // Send detailed error message in the response
	}
  });
  
//not in use
app.get('/checkOutputFile', (req, res) => {
	const fs = require('fs');

	fs.readFile('output.txt', 'utf8', (err, data) => {
		if (!err && data.includes('C:\\Users\\dbbal\\Desktop\\Singapore\\blockchain\\DAPP-Blockchainers>')) {
		console.log('Desired line found in output.txt');

		// Extract and return the relevant information
		const relevantInfo = extractRelevantInfo(data);
		res.json({ status: 'success', info: relevantInfo });
		} else {
		res.json({ status: 'waiting' });
		}
	});
});
//not in use
function extractRelevantInfo(data) {

const matches = data.match(/transaction hash:\s+(0x[a-fA-F0-9]+).*?contract address:\s+(0x[a-fA-F0-9]+).*?total cost:\s+(.*?) ETH/s);

if (matches && matches.length === 4) {
	const [, transactionHash, contractAddress, totalCost] = matches;
	return { transactionHash, contractAddress, totalCost };
}

return null; // Return null if the information couldn't be extracted
}


app.post('/mintItem', async (req, res) => {
    try {


		const userAddress = req.body.address;


		const gasPrice = await web3.eth.getGasPrice();

		const nonce = await web3.eth.getTransactionCount(userAddress);

		const tx = {
			from: userAddress,
			to:mintAdress,
			gasPrice: gasPrice,
			gas: 1000000,
			nonce: nonce,
			data: minter.methods.mint(req.body.itemName).encodeABI(),
		};

		const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
		const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);if (receipt.status === '0x1') {
			// the transaction was successful
		  } else {
			console.log(receipt.status);
		  }
		
		receipt.transactionHash = receipt.transactionHash.toString();
		receipt.blockNumber = receipt.blockNumber.toString();
		receipt.gasUsed = receipt.gasUsed.toString();
		receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString();
		receipt.status = receipt.status.toString();

		console.log('Transaction Hash:', receipt.transactionHash);
		console.log('Block Number:', receipt.blockNumber);
		console.log('Gas Used:', receipt.gasUsed);
		console.log('Cumulative Gas Used:', receipt.cumulativeGasUsed);
		console.log('Contract Address:', receipt.contractAddress);
		console.log('Status:', receipt.status);
  





 

        res.status(200).json({ 'transactionHash': receipt.transactionHash});

    } catch (error) {
        console.error('Error during minting:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

 

// API endpoint to fetch the price
app.post('/listItem', async (req, res) => {
	try {

		console.log("listing time:")

		const userAddress = req.body.address;


		const gasPrice = await web3.eth.getGasPrice();

		const nonce = await web3.eth.getTransactionCount(userAddress);

		
		
		const tx = {
			from: userAddress,
			to: contractAddress,
			gasPrice: gasPrice,
			gas: 1000000,
			nonce: nonce,
			value: 0,
			data: marketplace.methods.listNft(mintAdress,req.body.token,req.body.price).encodeABI(),
		};
		
		console.log("signing");
		const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
		const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);if (receipt.status === '0x1') {
			// the transaction was successful
		  } else {
			console.log('Revert Reason:', receipt);

		  }

		
		receipt.transactionHash = receipt.transactionHash.toString();
		receipt.blockNumber = receipt.blockNumber.toString();
		receipt.gasUsed = receipt.gasUsed.toString();
		receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString();
		receipt.status = receipt.status.toString();

		console.log('Transaction Hash:', receipt.transactionHash);
		console.log('Block Number:', receipt.blockNumber);
		console.log('Gas Used:', receipt.gasUsed);
		console.log('Cumulative Gas Used:', receipt.cumulativeGasUsed);
		console.log('Contract Address:', receipt.contractAddress);
		console.log('Status:', receipt.status);
  

        res.status(200).json({ 'transactionHash': receipt.transactionHash});
		
      
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  });

app.post('/listItem', async (req, res) => {
	try {

		console.log("listing time:")

		const userAddress = req.body.address;


		const gasPrice = await web3.eth.getGasPrice();

		const nonce = await web3.eth.getTransactionCount(userAddress);

		
		
		const tx = {
			from: userAddress,
			to: contractAddress,
			gasPrice: gasPrice,
			gas: 1000000,
			nonce: nonce,
			value: 0,
			data: marketplace.methods.listNft(mintAdress,req.body.token,req.body.price).encodeABI(),
		};
		
		console.log("signing");
		const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
		const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);if (receipt.status === '0x1') {
			// the transaction was successful
		  } else {
			console.log('Revert Reason:', receipt);

		  }

		
		receipt.transactionHash = receipt.transactionHash.toString();
		receipt.blockNumber = receipt.blockNumber.toString();
		receipt.gasUsed = receipt.gasUsed.toString();
		receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString();
		receipt.status = receipt.status.toString();

		console.log('Transaction Hash:', receipt.transactionHash);
		console.log('Block Number:', receipt.blockNumber);
		console.log('Gas Used:', receipt.gasUsed);
		console.log('Cumulative Gas Used:', receipt.cumulativeGasUsed);
		console.log('Contract Address:', receipt.contractAddress);
		console.log('Status:', receipt.status);
  

        res.status(200).json({ 'transactionHash': receipt.transactionHash});
		
      
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  });




  app.post('/getAllListedItems', async (req, res) => {
    try {
        const userAddress = req.body.address;
        console.log(userAddress);

        // Assuming you have the contract ABI loaded in `marketplaceAbi`

        // Call the getListedNfts function
        const gasPrice = await web3.eth.getGasPrice();

		const nonce = await web3.eth.getTransactionCount(userAddress);

		const tx = {
			from: userAddress,
			to:contractAddress,
			gasPrice: gasPrice,
			gas: 1000000,
			nonce: nonce,
			data: marketplace.methods.getMyListedNfts().encodeABI(),
		};

		const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
		const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);if (receipt.status === '0x1') {
			// the transaction was successful
		  } else {
			console.log(receipt.status);
		  }
		
		receipt.transactionHash = receipt.transactionHash.toString();
		receipt.blockNumber = receipt.blockNumber.toString();
		receipt.gasUsed = receipt.gasUsed.toString();
		receipt.cumulativeGasUsed = receipt.cumulativeGasUsed.toString();
		receipt.status = receipt.status.toString();

		console.log('Transaction Hash:', receipt.transactionHash);
		console.log('Block Number:', receipt.blockNumber);
		console.log('Gas Used:', receipt.gasUsed);
		console.log('Cumulative Gas Used:', receipt.cumulativeGasUsed);
		console.log('Contract Address:', receipt.contractAddress);
		console.log('Status:', receipt.status);
  





 

        res.status(200).json({ 'transactionHash': receipt.transactionHash});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
  });




app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
  });
  
  
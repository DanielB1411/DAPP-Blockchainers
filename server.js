const { Web3 } = require("web3");
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const fs = require('fs');
const { spawn } = require('child_process');


const app = express();
const port = 3000;
app.use(express.json());


const { ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } = require("web3");
// Replace 'YOUR_INFURA_API_KEY' with your actual Infura API key
const infuraUrl = 'https://goerli.infura.io/v3/0c0d8ccd8f2a44af806fcba72afae84f';


const web3 = new Web3(
	new Web3.providers.HttpProvider(infuraUrl),
    );
  

// Replace with your deployed contract address
const contractAddress = '0x726BCE22eE350De94fE31DbbFe93f00b0F732495';

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
const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);


const deploy_item = () => {
	const fs = require('fs');
	const truffleProcess = spawn('cmd.exe', ['/K', 'truffle migrate --network goerli']);

	const outputFileStream = fs.createWriteStream('output.txt');
	truffleProcess.stdout.pipe(outputFileStream);
  
	// Listen for data on the standard error
	truffleProcess.stderr.on('data', (data) => {
	  console.error(`stderr: ${data}`);
	});
  
	// Listen for process exit event
	truffleProcess.on('exit', (code) => {
	  if (code !== 0) {
		console.error(`Truffle process exited with code ${code}`);
	  }
  
	  outputFileStream.end();
  
	  // Read the content of the output.txt file
	  fs.readFile('output.txt', 'utf8', (err, data) => {
		if (err) {
		  console.error(`Error reading output.txt: ${err}`);
		  return;
		}
  
		console.log(`Truffle Output:\n${data}`);
	  });
	});
  };
  




app.post('/createItem', async (req, res) => {
	try {
		// Log specific values from the request body
		console.log('Address:', req.body.address);
		console.log('Item Name:', req.body.itemName);

		console.log(process.env.PRIVATE_KEY);
		const envData = fs.readFileSync('.env', 'utf8');
		const envConfig = dotenv.parse(envData);
		envConfig.PRIVATE_KEY = req.body.address;


		
		// deploy the item with truffle 
		deploy_item();

		res.status(200).json({ message: 'Item created successfully' });
	} catch (error) {
		console.error('Error creating item:', error);
		res.status(500).json({ error: error.message }); // Send detailed error message in the response
	}
  });
  

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

function extractRelevantInfo(data) {

const matches = data.match(/transaction hash:\s+(0x[a-fA-F0-9]+).*?contract address:\s+(0x[a-fA-F0-9]+).*?total cost:\s+(.*?) ETH/s);

if (matches && matches.length === 4) {
	const [, transactionHash, contractAddress, totalCost] = matches;
	return { transactionHash, contractAddress, totalCost };
}

return null; // Return null if the information couldn't be extracted
}

  


// API endpoint to fetch the price
app.get('/getItems', async (req, res) => {
	try {
    
        const listing_fee = await contractInstance.methods.LISTING_FEE().call();
        console.log("listing fee: " + listing_fee)
      
	  res.json({ 'message': listing_fee.toString() });
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
  
  
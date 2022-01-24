const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3  = require('web3');
const {interface,bytecode} = require('./compile');

//this is the HDWalletProvider
//with
//first parameter as the account mnemonic to retreve a set of accounts from rinkeby test network
//the second parameter is the infura api a portal to the node of the ethereum network(rinkeby)
const provider = new HDWalletProvider(
  'prize verify carpet deposit game round burden cabin general boil topic world',
  'https://rinkeby.infura.io/v3/68969620eaf84f52b3ac867e7b19eb04'
);

const web3 = new Web3(provider);

const deploy = async () =>{     //deployed script
  const accounts = await web3.eth.getAccounts();    //getting the accounts

  console.log('Attempting a traction of contract from', accounts[0]);

//this is the main deploy phase to deploy to the ehereum network(rinkeby)
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: '0x' + bytecode, arguments: ['Nirmalya']})
    .send({from: accounts[0]});

    console.log(interface);
    console.log('Deployed to', result.options.address);
};

deploy();   //explicitely called for async function

import Web3 from 'web3';

//it is used to as because metamask injects a different web3
const web3 = new Web3(window.web3.currentProvider);

export default web3;

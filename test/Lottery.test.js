const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');   //constructor web3->provider->ganache
const { interface, bytecode } = require('../compile');

const provider = ganache.provider();
const web3 = new Web3(provider); //creating a instance of web3 and providing a provider for the perticular network

let lottery;
let accounts;

//first we deploy the contract by and free account of ganache
//everytime we creates an assertion
beforeEach(async () => {    //mocha
  accounts = await web3.eth.getAccounts();

  //Use one of this accounts to deploy the contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))    //creating contract constructor
    .deploy({ data: bytecode, arguments: ['Nirmalya'] })
    .send({ from: accounts[0], gas: '5000000' });

    lottery.setProvider(provider);
});

describe('Lottery Contract', ()=>{    //mocha
  it('deploys a contract', ()=>{
    assert.ok(lottery.options.address);
  });

  it('default managers name with address', async ()=>{
    const mAddress = await lottery.methods.manager().call();
    const mName = await lottery.methods.managerName().call();
    const isStar = await lottery.methods.isStarted().call();
    assert.equal(mAddress, accounts[0]);
    assert.equal(mName, "Nirmalya");
    assert.equal(isStar, false);
  });

  it('requires manager to start the lottery', async ()=>{
    try{
      await lottery.methods.start("Dear", "Nagraj", "2", "20Jan").send({
        from: accounts[1], gas: '5000000'
      });
      assert(false);
    } catch(err){
      assert(err);
    }
  });

  it('starts the lottery', async ()=>{
    await lottery.methods.start("Dear", "Nagraj", "2", "20Jan").send({
      from: accounts[0], gas: '5000000'
    });

    const ln = await lottery.methods.lotteryName().call();
    const st = await lottery.methods.isStarted().call();
    const aboutLottery = await lottery.methods.getAboutLottery().call();
    const getWinners = await lottery.methods.getLastWinners().call();

    assert.ok(aboutLottery);
    assert.equal(st, true);
    assert.equal(getWinners.length, 0);
    assert.equal(ln, "Dear");
  });

  it('requires the lottery to start to fetch the about result', async ()=>{
    try{
      const about = await lottery.methods.getAboutLottery().call();
      assert(false);
    } catch(err){
      assert(err);
    }
  });

  it('allows one account to enter in the lottery and buy ticket', async () => {
    await lottery.methods.start("Dear", "Nagraj", "2", "20Jan").send({
      from: accounts[0], gas: '5000000'
    });

    await lottery.methods.enter().send({
      from: accounts[1], value: web3.utils.toWei('2', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[1]
    });

    assert.equal(accounts[1], players[0]);
    assert.equal(1, players.length);
  });

  it('requires the manager to start the lottery to enter and buy ticket', async () =>{
    try{
      await lottery.methods.enter().send({
        from: accounts[1], value: web3.utils.toWei('2', 'ether')
      });
      assert(false);
    } catch(err){
      assert(err);
    }
  });

  it('requires the correct amount to pay to buy the ticket', async () =>{
    try{
      await lottery.methods.start("Dear", "Nagraj", "2", "20Jan").send({
        from: accounts[0], gas: '5000000'
      });

      await lottery.methods.enter().send({
        from: accounts[1], value: web3.utils.toWei('0', 'ether')
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('allows multiple accounts to enter and buy ticket', async () => {
    await lottery.methods.start("Dear", "Nagraj", "2", "20Jan").send({
      from: accounts[0], gas: '5000000'
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('2', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('2', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei('2', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[1], players[0]);
    assert.equal(accounts[2], players[1]);
    assert.equal(accounts[3], players[2]);
    assert.equal(3, players.length);
  });

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.start("Dear", "Nagraj", "9", "20Jan").send({
      from: accounts[0], gas: '5000000'
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('9', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('9', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[3],
      value: web3.utils.toWei('9', 'ether')
    });

    const mAddress = await lottery.methods.manager().call();
    const iBalance = await web3.eth.getBalance(mAddress);
    await lottery.methods.pickWinner().send({
      from: accounts[0], gas: '5000000'
    });
    const fBalance = await web3.eth.getBalance(mAddress);
    const winner = await lottery.methods.getLastWinners().call();
    const buyers = await lottery.methods.getPlayers().call();
    const difference = fBalance - iBalance;

    assert.equal(winner.length, 3);
    assert.equal(buyers.length, 0);
    assert(difference > web3.utils.toWei('1', 'ether'));
  });

  it('requires manager to pick a winner', async () =>{
    try{
      await lottery.methods.start("Dear", "Nagraj", "9", "20Jan").send({
        from: accounts[0], gas: '5000000'
      });

      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('9', 'ether')
      });

      await lottery.methods.enter().send({
        from: accounts[2],
        value: web3.utils.toWei('9', 'ether')
      });

      await lottery.methods.enter().send({
        from: accounts[3],
        value: web3.utils.toWei('9', 'ether')
      });

      await lottery.methods.pickWinner().send({
        from: accounts[1], gas: '5000000'
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('requires the lottery to start to pick a winner', async () =>{
    try{
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('9', 'ether')
      });

      await lottery.methods.enter().send({
        from: accounts[2],
        value: web3.utils.toWei('9', 'ether')
      });

      await lottery.methods.enter().send({
        from: accounts[3],
        value: web3.utils.toWei('9', 'ether')
      });

      await lottery.methods.pickWinner().send({
        from: accounts[0], gas: '5000000'
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('requires the minimum number of players to pick the winner', async () =>{
    try{
      await lottery.methods.start("Dear", "Nagraj", "9", "20Jan").send({
        from: accounts[0], gas: '5000000'
      });

      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('9', 'ether')
      });

      await lottery.methods.pickWinner().send({
        from: accounts[1], gas: '5000000'
      });
      assert(false);
    } catch (err){
      assert(err);
    }
  });

  it('cancel lottery', async () =>{
    await lottery.methods.start("Dear", "Nagraj", "2", "20Jan").send({
      from: accounts[0], gas: '5000000'
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('2', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);
    await lottery.methods.cancelLottery().send({
      from: accounts[0], gas: '5000000'
    });
    const buyer = await lottery.methods.getPlayers().call();
    const winner = await lottery.methods.getLastWinners().call();
    const isStart = await lottery.methods.isStarted().call();
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei('1.8', 'ether'));
    assert.equal(buyer.length, 0);
    assert.equal(winner.length, 0);
    assert.equal(isStart, false);
  });

  it('requires to start the lottery to cancel', async () =>{
    try{
      await lottery.methods.cancelLottery().send({
        from: accounts[0], gas: '5000000'
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('requires the manager to cancel the lottery', async () =>{
    try{
      await lottery.methods.start("Dear", "Nagraj", "2", "20Jan").send({
        from: accounts[0], gas: '5000000'
      });

      await lottery.methods.cancelLottery().send({
        from: accounts[1], gas: '5000000'
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });
});

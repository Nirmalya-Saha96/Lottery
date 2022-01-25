import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Accordion from 'react-bootstrap/Accordion';
import { Button, Message } from 'semantic-ui-react';
import web3 from '../../web3';
import lottery from '../../lottery';

class Admin extends Component {
  state = {
    name: "",
    org: "",
    price: "",
    date: "",
    players: [],
    balance: '',
    loading: false,
    message: ""
  };

  async componentDidMount() {
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ players, balance });
  };

  onSubmit = async event => {
    event.preventDefault();

    const { name, org, price, date } = this.state;
    this.setState({ loading: true, message: '' });

    try{
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.start(name, org, price, date).send({
        from: accounts[0]
      });
    }catch(err){
      this.setState({ message: err.message });
    }
    this.setState({ loading: false });
  };

  onClick = async () => {
    this.setState({ loading: true, message: '' });

    try{
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.cancelLottery().send({
        from: accounts[0]
      });
    }catch(err){
      this.setState({ message: err.message });
    }
    this.setState({ loading: false });
  };

  onClickClick = async () => {
    this.setState({ loading: true, message: '' });

    try{
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
    }catch(err){
      this.setState({ message: err.message });
    }
    this.setState({ loading: false });
  };

  render(){
    return (
        <div>
          <div style={{marginTop: "20px", display: 'flex',  justifyContent:'center', alignItems:'center'}}>
              <h1> MANAGER CONTROL PANEL </h1>
          </div>

          <Form style={{padding: "100px"}} onSubmit={this.onSubmit} error={!!this.state.message}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Lottery name</Form.Label>
              <Form.Control type="text" placeholder="Enter Name"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Lottery Organisation</Form.Label>
              <Form.Control type="text" placeholder="Enter Organisation"   value={this.state.org}
                onChange={event => this.setState({ org: event.target.value })} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Lottery Ticket Price</Form.Label>
              <Form.Control type="text" placeholder="Enter in ethers"   value={this.state.price}
                onChange={event => this.setState({ price: event.target.value })} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Label>Lottery Date Announcement</Form.Label>
              <Form.Control type="text" placeholder="Enter date"   value={this.state.date}
                onChange={event => this.setState({ date: event.target.value })} required/>
            </Form.Group>
            {!!this.state.message == true &&
              <Message error header="Something Went Wrong" content={this.state.message} />
            }
            <Button loading={this.state.loading} type="submit" primary>
              START
            </Button>
          </Form>

          <ButtonGroup style={{padding: "90dp", display: "flex",
          justifyContent: "center",
          alignItems: "center"}} aria-label="Basic example" >
            <Button onClick={this.onClickClick} loading={this.state.loading}  primary>
              PICK A WINNER
            </Button>
            <Button onClick={this.onClick} loading={this.state.loading}  primary>
              CANCEL A LOTTERY
            </Button>
          </ButtonGroup>

          <Accordion defaultActiveKey="0" style={{padding: "100px"}}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Total Buyers</Accordion.Header>
              <Accordion.Body>
                {this.state.players.length}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Approximate Comission Generated</Accordion.Header>
              <Accordion.Body>
                {(((this.state.balance)/8)/1000000000000000000)} ethers
              </Accordion.Body>
            </Accordion.Item>
        </Accordion>
        </div>
    );
  }
}

export default Admin;

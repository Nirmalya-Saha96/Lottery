import React, { Component } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Accordion from 'react-bootstrap/Accordion';
import { Button } from 'semantic-ui-react';
import web3 from '../../web3';
import lottery from '../../lottery';

class User extends Component {
  state = {
    isStart: '',
    about: [],
    balance: '',
    loading: false
  };

  async componentDidMount() {
    const isStart = await lottery.methods.isStarted().call();
    const about = await lottery.methods.getAboutLottery().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ isStart, about, balance });
  };

  onClick = async () => {
    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: this.state.about[5]
    });
    this.setState({ loading: false });
  };

  render(){
    if(this.state.isStart){
      return (
          <div>
          <Card style={{display: "flex",
                      justifyContent: "center",
                      alignItems: "center" }}>
              <Card.Body>
                <Card.Title>{this.state.about[1]}</Card.Title>
                <Card.Text>
                  This Lottery is Organised by {this.state.about[0]} and managed by {this.state.about[2]} by address {this.state.about[3]}.
                </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroupItem>Result Date: {this.state.about[4]}</ListGroupItem>
                <ListGroupItem>Ticket Price: {this.state.about[5]/1000000000000000000} ethers</ListGroupItem>
                <ListGroupItem>Number of tickets sold: {this.state.about[6].length}</ListGroupItem>
              </ListGroup>
              <Card.Body>
                <Button onClick={this.onClick} loading={this.state.loading}  primary>
                  BUY 1 TICKET
                </Button>
              </Card.Body>
            </Card>

            <Accordion defaultActiveKey="0" style={{padding: "100px"}}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>First Prize</Accordion.Header>
                <Accordion.Body>
                  {(((this.state.balance)/2)/1000000000000000000)} ethers
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Second Prize</Accordion.Header>
                <Accordion.Body>
                  {(((this.state.balance)/4)/1000000000000000000)} ethers
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Third Prize</Accordion.Header>
                <Accordion.Body>
                  {(((this.state.balance)/8)/1000000000000000000)} ethers
                </Accordion.Body>
              </Accordion.Item>
          </Accordion>

            <h1>{this.state.message}</h1>
          </div>
      );
    } else {
      return (
          <div>
          <Card style={{marginTop: "100px",
                      marginLeft: "50px",
                      padding: "50px",
                      width: "80%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center" }}>
            <Card.Body>
              <Card.Title>Lottery Is Not Started</Card.Title>
              <Card.Text>
                Wait till the manager starts the lottery
                Winners are disclosed.
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Winners are disclosed in the main page</ListGroupItem>
              <ListGroupItem>Congratulations if your address is in the winners tab</ListGroupItem>
            </ListGroup>
            </Card>

            <Accordion defaultActiveKey="0" style={{padding: "100px"}}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>First Prize</Accordion.Header>
                <Accordion.Body>
                  Yet to be calculated
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Second Prize</Accordion.Header>
                <Accordion.Body>
                  Yet to be calculated
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Third Prize</Accordion.Header>
                <Accordion.Body>
                  Yet to be calculated
                </Accordion.Body>
              </Accordion.Item>
          </Accordion>
          </div>
      );
    }

  }
}

export default User;

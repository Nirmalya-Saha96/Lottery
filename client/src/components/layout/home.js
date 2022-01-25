import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import web3 from '../../web3';
import lottery from '../../lottery';
import HomeCaroucel from "../caroucel/HomeCaroucel";
import CardGroup from 'react-bootstrap/CardGroup';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

 class Home extends Component {
  state = {
    winners: [],
  };

  async componentDidMount() {
    const winners = await lottery.methods.getLastWinners().call();

    this.setState({ winners });
  };

  render(){
    return (
      <div>
          <HomeCaroucel/>
          <br />
          <br />
          <CardGroup style={{padding: "50px"}}>
            <Card style={{padding: "50px", margin: "20px"}}>
              <Card.Img style={{width: "300px", align: "center"}} variant="top" src="data:image/jpeg;base64,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" />
              <Card.Body>
                <Card.Title>USER</Card.Title>
                <Card.Text>
                  Try your luck, in this ethereum lottery and win huge ethers
                  Fully transperent as, it discloses the amount of price at each transaction
                </Card.Text>
              </Card.Body>
              <Link to='/user'><button style={{backgroundColor: "yellow", marginLeft: "80px"}}>User</button></Link>
            </Card>
            <Card style={{padding: "50px", margin: "20px"}}>
              <Card.Img style={{width: "300px", align: "center"}} variant="top" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfpbuR_LA9RbFgYICWUb9R0bg3NQyhy5cs5w&usqp=CAU" />
              <Card.Body>
                <Card.Title>MANAGER</Card.Title>
                <Card.Text>
                  Admin/Manager place to control the lottery, by disclosing the winners, cancel the lottery, and conduct any lottery
                </Card.Text>
              </Card.Body>
              <Link to='/admin'><button style={{backgroundColor: "yellow", marginLeft: "80px"}}>Admin</button></Link>
            </Card>
            <Card style={{padding: "50px", margin: "20px", align: "center"}}>
              <Card.Img style={{width: "300px", align: "center"}} variant="top" src="data:image/png;base64,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" />
              <Card.Body>
                <Card.Title>Rules</Card.Title>
                <Card.Text>
                  <ul>
                    <li>Trying your luck by buying the exact amount of ticket</li>
                    <li>Manager has the power to pick the lukiest or cancel the lottery</li>
                    <li>In case of cancellation you will be refunded all your ethers</li>
                    <li>Manager cannot influence the winners it is maintained by the contract</li>
                  </ul>
                </Card.Text>
              </Card.Body>
              <Link to='/'><button style={{backgroundColor: "yellow", marginLeft: "80px"}}>Home</button></Link>
            </Card>
          </CardGroup>
          <hr />
          <br />

          <h1 style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}> Last Winners </h1>
          <div style={{ maxWidth: "1500px", margin: "50px", marginLeft: "50px", marginRight: "50px"}}>
            <ListGroup as="ul" numbered>
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <div className="fw-bold">First Prize To</div>
                  {this.state.winners[0]}
                </div>
                <Badge variant="primary" pill>
                  1st
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <div className="fw-bold">Second Prize To</div>
                  {this.state.winners[1]}
                </div>
                <Badge variant="primary" pill>
                  2nd
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <div className="fw-bold">Third Prize To</div>
                  {this.state.winners[2]}
                </div>
                <Badge variant="primary" pill>
                  3ed
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </div>


         <footer style={{
           backgroundColor: "lightYellow",
           padding: "50px",
           display: "flex",
           justifyContent: "center",
           alignItems: "center"
         }}>
          Nirmalya Saha
         </footer>
       </div>
    );
  }

}

export default Home;

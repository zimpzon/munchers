import './App.css';
import GameControls from './Components/GameControls';
import GameCanvas from './Components/GameCanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';
import game from './Game/game';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className='App'>
      <Container>
        <Row>
          <Col>
            <GameControls />
          </Col>
          <Col>
            <GameCanvas />
          </Col>
        </Row>
        <br></br>
        <Button className='buyButton bg-success' onClick={() => game.resetGame()}>
          Restart
        </Button>
      </Container>
      <Analytics />
    </div>
  );
}

export default App;

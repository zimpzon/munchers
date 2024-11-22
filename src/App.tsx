import React, { useState } from 'react';
import './App.css';
import GameControls from './Components/GameControls';
import GameCanvas from './Components/GameCanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import game from './Game/game';
import { Analytics } from '@vercel/analytics/react';

function App(): JSX.Element {
  const [levelJSON, setLevelJSON] = useState<string>('');

  const handleJSONChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setLevelJSON(event.target.value);
  };

  const applyLevelJSON = (): void => {
    try {
      const levelObject = JSON.parse(levelJSON);
      // Use levelObject as needed, for example:
      console.log(levelObject);
    } catch (error) {
      console.error('Invalid JSON format:', error);
    }
  };

  const restartGame = (): void => {
    game.resetGame();
  };

  return (
    <div className='App'>
      <Container fluid>
        <Row>
          <Col xs={3}>
            <GameControls />
          </Col>
          <Col xs={8}>
            <GameCanvas />
          </Col>
        </Row>
      </Container>
      <Analytics />
    </div>
  );
  }

export default App;

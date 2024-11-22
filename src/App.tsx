import React, { useState } from 'react';
import './App.css';
import GameControls from './Components/GameControls';
import GameCanvas from './Components/GameCanvas';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Form } from 'react-bootstrap';
import game from './Game/game';
import { Analytics } from '@vercel/analytics/react';
import TextMultiline from './Components/GameControls/TextMultiline';

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
      <Container>
        <Row>
          <Col>
            <GameControls />
          </Col>
          <Col>
            <GameCanvas />
          </Col>
        </Row>
        <br />
        <Form>
          <Form.Group controlId='jsonTextArea'>
            <Form.Label>Enter JSON:</Form.Label>
            <Form.Control as='textarea' rows={5} value={levelJSON} onChange={handleJSONChange} />
          </Form.Group>
        </Form>
        <Button className='buyButton bg-success' onClick={applyLevelJSON}>
          Download level
        </Button>
        <Button className='buyButton bg-success' onClick={applyLevelJSON}>
          Upload level
        </Button>
        <Button className='buyButton bg-success' onClick={applyLevelJSON}>
          Apply level JSON
        </Button>
        <Button className='buyButton bg-success' onClick={restartGame}>
          Restart
        </Button>
      </Container>
      <Analytics />
    </div>
  );
}

export default App;

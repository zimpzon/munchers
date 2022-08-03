import './App.css'
import GameControls from './Components/GameControls'
import GameCanvas from './Components/GameCanvas'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

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
      </Container>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import game from '../../Game/game';
import globals from '../../Game/globals';
import 'bootstrap/dist/css/bootstrap.min.css';

function ControlsTop(): JSX.Element {
  const [turbo, setTurbo] = useState(false);
  const [showTrails, setShowTrails] = useState(true);
  const [gameScale, setGameScale] = useState(60);

  useEffect(() => {
    // Set initial scale when component mounts
    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) {
      gameCanvas.style.transform = `scale(${gameScale / 100})`;
      gameCanvas.style.transformOrigin = 'top left';
    }
  }, [gameScale]);

  const onBuy = (amount: number, price: number) => {
    if (price > game.money) return;

    for (let i = 0; i < amount; ++i) game.addAnt();

    game.addMoney(-price);
  };

  const handleTurboChange = () => {
    globals.turbo = !turbo;
    setTurbo(!turbo);
  };

  const handleShowTrailsChange = () => {
    globals.showTrails = !showTrails;
    setShowTrails(!showTrails);
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseInt(event.target.value);
    setGameScale(scale);
    const gameCanvas = document.getElementById('gameCanvas');
    if (gameCanvas) {
      gameCanvas.style.transform = `scale(${scale / 100})`;
      gameCanvas.style.transformOrigin = 'top left';
    }
  };

  const canBuy1 = true || game.money >= 1;
  const canBuy10 = true || game.money >= 9;
  const canBuy100 = true || game.money >= 80;

  return (
    <>
      <div>
        <h1 className='solitAnts' id=''>
          ...ANTS...
        </h1>

        <label className='stats' id='moneyLabel'>
          $-, ants: {game.ants.length}
        </label>
      </div>
      <div className='buyButtonsSection'>
        <Button
          size="sm"
          className={'buyButton bg-success ' + (canBuy1 ? '' : 'bg-secondary')}
          onClick={() => onBuy(1, 1)}>
          Buy 1 ($1)
        </Button>
        <Button
          size="sm"
          className={'buyButton bg-success' + (canBuy10 ? '' : 'bg-secondary')}
          onClick={() => onBuy(10, 9)}>
          Buy 10 ($9)
        </Button>
        <Button
          size="sm"
          className={'buyButton bg-success' + (canBuy100 ? '' : 'bg-secondary')}
          onClick={() => onBuy(100, 80)}>
          Buy 100 ($80)
        </Button>
      </div>
      <div style={{ display: 'inline-flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}>
          <input type='checkbox' checked={turbo} onChange={handleTurboChange} />
          <label onClick={handleTurboChange}>Turbo</label>
        </div>
        <div style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}>
          <input type='checkbox' checked={showTrails} onChange={handleShowTrailsChange} />
          <label onClick={handleShowTrailsChange}>Trails</label>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
        <label>Size:</label>
        <input
          type='range'
          min='25'
          max='200'
          value={gameScale}
          onChange={handleScaleChange}
          style={{ width: '100px' }}
        />
        <span>{gameScale}%</span>
      </div>
    </>
  );
}

export default ControlsTop;

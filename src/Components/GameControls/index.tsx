import { useState } from 'react';
import { Button } from 'react-bootstrap';
import game from '../../Game/game';
import globals from '../../Game/globals';

function ControlsTop(): JSX.Element {
  const [turbo, setTurbo] = useState(false);

  const onBuy = (amount: number, price: number) => {
    if (price > game.money) return;

    for (let i = 0; i < amount; ++i)
      game.addAnt();

    game.addMoney(-price);
  }

  const handleTurboChange = () => {
    globals.turbo = !turbo;
    setTurbo(!turbo);
  }

  return (
    <>
    <div>
      <label className='font-weight-bold' id='moneyLabel'>$-, ants: {game.ants.length}</label>
      </div>
      <Button onClick={() => game.saveGame()}>Save game</Button>
      <Button onClick={() => onBuy(1, 1)}>Buy 1 ($1)</Button>
      <Button onClick={() => onBuy(10, 9)}>Buy 10 ($9)</Button>
      <Button onClick={() => onBuy(100, 80)}>Buy 100 ($80)</Button>
      <label>
        <input type='checkbox' checked={turbo} onChange={handleTurboChange} />
        Turbo
      </label>
      <div>
      <Button onClick={() => game.resetGame()}>Restart game, all progress will be lost (!)</Button>
      </div>
    </>
  );
}

export default ControlsTop;

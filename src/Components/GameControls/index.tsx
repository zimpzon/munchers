import { useState } from 'react';
import { Button } from 'react-bootstrap';
import game from '../../Game/game';
import globals from '../../Game/globals';
import level from '../../Game/level';

function ControlsTop(): JSX.Element {
  const [turbo, setTurbo] = useState(false);

  const onBuy = (amount: number, price: number) => {
    if (price > game.money) return;

    for (let i = 0; i < amount; ++i) game.addAnt(level.getAntDefaultPos());

    game.addMoney(-price);
  };

  const handleTurboChange = () => {
    globals.turbo = !turbo;
    setTurbo(!turbo);
  };

  return (
    <>
      <div>
        <label className='font-weight-bold' id='moneyLabel'>
          $-, ants: {game.ants.length}
        </label>
      </div>
      <input type='checkbox' checked={turbo} onChange={handleTurboChange} />
      Turbo
    </>
  );
}

export default ControlsTop;

import { useState } from 'react';
import { Button } from 'react-bootstrap';
import game from '../../Game/game';
import globals from '../../Game/globals';
import 'bootstrap/dist/css/bootstrap.min.css';

function ControlsTop(): JSX.Element {
  const [turbo, setTurbo] = useState(false);

  const onBuy = (amount: number, price: number) => {
    if (price > game.money) return;

    for (let i = 0; i < amount; ++i) game.addAnt();

    game.addMoney(-price);
  };

  const handleTurboChange = () => {
    globals.turbo = !turbo;
    setTurbo(!turbo);
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
          className={'buyButton bg-success ' + (canBuy1 ? '' : 'bg-secondary')}
          onClick={() => onBuy(1, 1)}>
          Buy 1 ($1)
        </Button>
        <Button
          className={'buyButton bg-success' + (canBuy10 ? '' : 'bg-secondary')}
          onClick={() => onBuy(10, 9)}>
          Buy 10 ($9)
        </Button>
        <Button
          className={'buyButton bg-success' + (canBuy100 ? '' : 'bg-secondary')}
          onClick={() => onBuy(100, 80)}>
          Buy 100 ($80)
        </Button>
      </div>
      <input type='checkbox' checked={turbo} onChange={handleTurboChange} />
      <label onClick={handleTurboChange}> Turbo</label>
    </>
  );
}

export default ControlsTop;

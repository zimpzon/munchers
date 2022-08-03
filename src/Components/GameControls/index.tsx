import { useState } from "react"
import { Button } from "react-bootstrap"
import game from "../../Game/game"
import globals from "../../Game/globals"

function ControlsTop(): JSX.Element {
  const [turbo, setTurbo] = useState(false)

  const onBuy = (amount: number, cheat: boolean = false) => {
    if (amount > game.money && !cheat)
      return

    for (let i = 0; i < amount; ++i)
      game.addAnt()

    if (!cheat)
      game.addMoney(-amount)
  }

  const handleTurboChange = () => {
    globals.turbo = !turbo
    setTurbo(!turbo)
  }

  return (
    <>
    <label id="moneyLabel">$-, ants: {game.ants.length}</label>
    <div>
      <label>Scent trails</label>
      <Button>+1 second</Button>
    </div>
    <div>
      <label>Trails leading to food home</label>
      <Button>+1 second</Button>
    </div>
    <Button onClick={ () => game.saveGame() }>Save game</Button>
    <Button onClick={ () => game.resetGame() }>Reset game</Button>
    <Button onClick={ () => game.expandMap() }>Expand map</Button>
    <Button onClick={ () => onBuy(1) }>Buy 1 (${game.antBuyPrice(1)})</Button>
    <Button onClick={ () => onBuy(10, true) }>Buy 10 (${game.antBuyPrice(10)})</Button>
    <Button onClick={ () => onBuy(100, true) }>Buy 100 (cheat)</Button>
    <label><input type='checkbox' checked={turbo} onChange={handleTurboChange} />Turbo</label>
  </>
  )
}

export default ControlsTop

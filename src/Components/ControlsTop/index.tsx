import { useEffect, useState } from "react"
import game from "../../Game/game"

function ControlsTop(): JSX.Element {
  const [money, setMoney] = useState(10000)
  const [showHomeTrails, setShowHomeTrails] = useState(false)
  const [showFoodTrails, setShowFoodTrails] = useState(false)

  const onBuy = (amount: number) => {
    if (amount > money)
      return

    setMoney(money - amount)
    for (let i = 0; i < amount; ++i)
      game.addAnt()
  }

  const onRecall = () => {
    game.recall()
  }

  const handleShowHomeChange = () => {
    game.showHomeTrails = !showHomeTrails
    setShowHomeTrails(!showHomeTrails)
  }

  const handleFoodHomeChange = () => {
    setShowFoodTrails(!showFoodTrails)
  }

  return (
    <>
    <label>${money}, ants: {game.ants.length}</label>
    <div/>
    <button onClick={ () => onBuy(100) }>Buy 1</button>
    <button onClick={ () => onRecall() }>Recall all ants</button>
    <div/>
    <label><input type='checkbox' checked={showHomeTrails} onChange={handleShowHomeChange} />Show home trails</label>
    <label><input type='checkbox' checked={showFoodTrails} onChange={handleFoodHomeChange}/>Show food trails</label>
  </>
  )
}

export default ControlsTop

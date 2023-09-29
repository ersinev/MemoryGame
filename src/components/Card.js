

function Card({ card, onClick,image }) {
  console.log(image)
  return (
    <div
      className={`memory-card${card.isFlipped ? " flip" : ""}`}
      onClick={onClick}
      style={{ order: card.order }}
      data-testid={card.id}
    >
      <img className="front-face" src={require(`../assets/images/${image}`)} alt="Card" />
      <img className="back-face" src={require('./logo.png')} alt="JS Badge" />
    </div>
  );
}

export default Card;

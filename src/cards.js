const cards = [];

for (var i = 1; i <= 48; i += 4) {
  const imageIndex = i;
  const explanationIndex = i + 1;
  
  cards.push(
    {
      img: `${imageIndex}.png`,
      id: i,
    },
    {
      img: `${explanationIndex}.png`,
      id: i,
    },
    {
      img: `${imageIndex + 2}.png`,
      id: i + 2,
    },
    {
      img: `${explanationIndex + 2}.png`,
      id: i + 2,
    }
  );
}
console.log(cards)
// const cards = [
//   { id: 1, name: "aurelia", image: aurelia },
//   { id: 2, name: "aurelia", image: aurelia },
//   { id: 3, name: "angular", image: angular },
//   { id: 4, name: "angular", image: angular },
//   { id: 5, name: "ember", image: ember },
//   { id: 6, name: "ember", image: ember },
//   { id: 7, name: "vue", image: vue },
//   { id: 8, name: "vue", image: vue },
//   { id: 9, name: "backbone", image: backbone },
//   { id: 10, name: "backbone", image: backbone },
//   { id: 11, name: "react", image: react },
//   { id: 12, name: "react", image: react },
// ];

export const cardsData = cards.map((card) => ({
  ...card,
  order: Math.floor(Math.random() * 12),
  isFlipped: false,
}));

console.log(cardsData)

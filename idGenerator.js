function getId() {
  const randomNumber = Math.random() * 1000000;
  return Math.trunc(randomNumber);
}

module.exports = getId;

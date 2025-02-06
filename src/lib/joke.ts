import JOKES from "../assets/jokes.json";

const jokes = JOKES;
export const getJoke = () =>
  jokes[Math.floor(Math.random() * jokes.length) + 1];

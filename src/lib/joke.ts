import JOKES from "../assets/jokes.json";

const jokes: string[] = JOKES;
export const getJoke = () =>
  jokes[Math.floor(Math.random() * jokes.length) + 1];

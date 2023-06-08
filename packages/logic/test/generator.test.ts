import { generate } from "../src";
import { describe, expect, it } from "vitest";

describe.concurrent("RehashGenerator", () => {
  it.each([
    [
      "hunter2",
      {
        iterations: 15,
        memorySize: 2048,
        parallelism: 2,
      },
      {
        url: "www.google.com",
        username: "jondoe@gmail.com",
        options: { length: 32, iteration: 1 },
      },
      "h5cTlQyD0lyC42l2A6im6evdb4PAlTNS",
    ],
    [
      "hunter2",
      {
        iterations: 15,
        memorySize: 2048,
        parallelism: 2,
      },
      {
        url: "www.google.com",
        username: "janedoe2@gmail.com",
        options: { length: 32, iteration: 1 },
      },
      "Dzy7WnDSccyfYlQ1D5zZa3ug+2T/6q/L",
    ],
    [
      "hunter2",
      {
        iterations: 15,
        memorySize: 2048,
        parallelism: 2,
      },
      {
        url: "www.github.com",
        username: "jondoe@gmail.com",
        options: { length: 32, iteration: 1 },
      },
      "t3uAD/Ww4a81RoF2nzlifSzCDKKnCKbu",
    ],
    [
      "correct-horse-battery-staple",
      {
        iterations: 15,
        memorySize: 2048,
        parallelism: 2,
      },
      {
        url: "www.github.com",
        username: "jondoe@gmail.com",
        options: { length: 32, iteration: 1 },
      },
      "d29xR+GYDQFLswzxDyjYI/ZVZ/ws9wqj",
    ],
  ])(
    "should reliably generate passwords",
    async (password, generatorOptions, entry, expected) => {
      const generated = await generate(
        password,
        generatorOptions,
        entry);
      expect(generated, `password [${password}] for entry [${entry.username}, ${entry.url}]`).toBe(expected);
    }
  );
});

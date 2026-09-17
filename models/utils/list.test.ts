import { describe, test, expect } from "@jest/globals";
import { splitIntoChunks } from "./list";

describe("splitIntoChunks", () => {
  test("should return an empty array when given an empty array", () => {
    expect(splitIntoChunks([], 3)).toEqual([]);
  });

  test.each`
    array     | chunkSize
    ${[]}     | ${0}
    ${[1, 2]} | ${0}
    ${[]}     | ${-1}
    ${[1, 2]} | ${-1}
  `(
    `should throw an error if the chunk size is $chunkSize and array is $array`,
    ({ array, chunkSize }) => {
      expect(() =>
        splitIntoChunks(array as number[], chunkSize as number),
      ).toThrow("Chunk size cannot be smaller than 1");
    },
  );

  test("should return a single chunk when array length is less than chunkSize", () => {
    expect(splitIntoChunks([1, 2], 5)).toEqual([[1, 2]]);
  });

  test("should return a single chunk when array length equals chunkSize", () => {
    expect(splitIntoChunks([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });

  test("should split array evenly when length is a multiple of chunkSize", () => {
    const input = [1, 2, 3, 4, 5, 6];
    expect(splitIntoChunks(input, 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  test("should create a smaller final chunk when array length is not evenly divisible", () => {
    const input = [1, 2, 3, 4, 5];
    expect(splitIntoChunks(input, 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test("should split array into single-element chunks when chunkSize is 1", () => {
    expect(splitIntoChunks(["a", "b", "c"], 1)).toEqual([["a"], ["b"], ["c"]]);
  });

  test("should not mutate the original array", () => {
    const input = [1, 2, 3, 4];
    const copy = [...input];
    splitIntoChunks(input, 2);
    expect(input).toEqual(copy);
  });

  test("should work with arrays containing objects", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    expect(splitIntoChunks([obj1, obj2, obj3], 2)).toEqual([
      [obj1, obj2],
      [obj3],
    ]);
  });
});

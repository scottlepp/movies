/* eslint-disable */

import { pathsToModuleNameMapper } from "ts-jest";
// import * as config from "./tsconfig.node.json" with { type: "json" };

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // modulePaths: [config.compilerOptions.baseUrl],
  // moduleNameMapper: pathsToModuleNameMapper(config.compilerOptions.paths ?? {}),
  transform: {
    ".+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$":
      "jest-transform-stub",
  },
  setupFilesAfterEnv: ['./src/setupTests.ts']
};
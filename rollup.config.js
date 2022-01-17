import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from "@rollup/plugin-typescript";
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import del from 'rollup-plugin-delete';
import dts from "rollup-plugin-dts";
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      del({ targets: ['dist/*'] }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      external(),
      terser(),
    ],
  },
  {
    input: "dist/types/index.d.ts",
    output: [
      {
        file: "dist/index.d.ts",
        format: "esm",
      }
    ],
    plugins: [
      dts()
    ],
  },
];
import { Module } from "module";
import path from 'path';

const oldRequire = Module.prototype.require;
const newRequire = function require(this: any, name: string) {
  const ext = path.extname(name);


  if (ext === '.svg') {
    return '/mock/xxx.svg';
  }
  else {
    return oldRequire.call(this, name);
  }
};

Object.assign(newRequire, oldRequire);
(Module.prototype as any).require = newRequire;

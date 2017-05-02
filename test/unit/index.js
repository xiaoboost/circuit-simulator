import Vue from 'vue';

Vue.config.productionTip = false;

// 匹配 specs 目录，这里是测试用例
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// 匹配 src 目录中除 main.js 以外的所有文件
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/);
srcContext.keys().forEach(srcContext);

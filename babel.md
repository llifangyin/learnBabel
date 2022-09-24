# Babel 把ES6送上天的通天塔
+ Babel is a javascript compiler
+ Babel 是巴比伦文化里的通天塔
+ the tower of Babel （通天塔：圣经故事，上帝惩罚而使彼此无法理解彼此的语言）

## 使用
+ babel cli
+ 配合打包工具 webpack、rollup等

1. npm init -y
2. npm install --save-dev @babel/core @babel/cli @babel/preset-env
3. 配置文件 babel.config.js
```js
const preset = [
    [
        '@babel/env',
        {
            debug: //查看babel转化了哪些与语法
        }
    ]
]
const plugins = []
if(process.env['ENV']==='prod'){
    plugins.push([])
}
module.exports = {presets,plugins}
```
+  preset配置用来编译的预置
+ 

4. package.json配置scripts
"babel": "babel src --out-dir dist",

## Babel工作流程

1. Parser 解析源文件
2. Transform 转换
3. Generator 生成新文件

![babel](./babel.jpg 'babel工作流程')

- Babel使用**acorn**引擎来做解析，这个库会先将源码转化为**抽象语法树AST**,再对AST做转换，最后将转化后的AST输出，得到被Babel编译后的文件

## Babel组成
@babel/core  抽象语法树转换的核心
@babel/cli  命令行工具，执行编译
@babel/plugin* babel插件机制，每一个语法对应一个插件
@babel/preset-env babel插件的集合，避免一个个配置
@babel/polyfiull --> core-js 把浏览器某些不支持的api导入项目中，可以按需导入
@babel/plugin-transform-runtime 缩减代码、解决polyfill直接修改api带来的全局污染的问题。


1. @babel/preset-env
preset-env包含了大部分ES6语法
@babel/plugin-proposal-class-properties 转换ES6 class静态属性的plugin
targets:编译id目标环境（不配置默认ES6语法）

2. babel/polyfill ( 7.4.0之后改为core-js)
polyfill 垫片的意思，
Babel把ES6的标准飞卫syntax 和 built-in 两种类型。syntax（语法）比如const => 等类型。
Babel默认只转译syntax类型的，对于built-in类型的需要通过@babel/polyfill来完成转译。
builtIn类型的语法通过require("core-js/modules/xxx") polyfill的方式来兼容
syntax类型的语法通过注入类似_classCallCheck和_defineProperty的helper函数来实现兼容。
![babel](./syntax%26built-in.jpg 'syntax26built')
+ 安装 core-js 
core-js 要使用 --save 方式安装，因为它是需要被注入到源码中的，在执行代码前提供执行环境，用来实现 built-in 的注入
```js
npm install --save core-js
```
配置useBuiltIns 'entry' ‘usage' false（默认值）
entry：只需要在项目入口处，导入core-js即可
usage: 按需导入

3. @babel/plugin-transfrom-runtime
上述babel/polyfill兼容，模块多时，每个模块都注入helper函数，会造成代码量很大。transform-runtime就是为了复用helper函数，缩小代码体积而生的，它还为编译后的代码提供了一个沙箱环境，避免全局污染。
- 安装
```js
npm install --save-dev @babel-plugin-transform-runtime
npm install --save @babel/runtime
```
- 修改babel plugins配置
+ 配置 plugin-transform-runtime
built-in类型的语法通过rqequire polyfill实现，例如为了支持Array.prototype.includes方法，需要require("core-js/modules/es.array.includes")在Array.prototype添加includes方法实现的，改变了原型，会造成全局污染，如果开发的项目是工具库会被其他项目引用而恰好自身又实现了该方法，就会有大问题。解决这一问题，/plugin-transform-runtime配置参数corejs为2或3，对应着@babel/runtime-corejs2 和@babel/runtime-corejs3

- **把 @babel/plugin-transform-runtime 的 corejs 的值设置为3，把 @babel/runtime 替换为 @babel/runtime-corejs3。**
- **去掉 @babel/preset-env 的 useBuiltIns 和 corejs 的配置，去掉 core-js。因为使用 @babel/runtime-corejs3 来实现对 built-in 类型语法的兼容，不用再使用 useBuiltIns 了**
 
```js
npm uninstall @babel/runtime
npm install --save @babel/runtime-corejs3
npm uninstall core-js
```
```js 
 // babel.config.js
const presets = [
[
    '@babel/env',
    {
    debug: true,
    targets: {}
    }
]
]
const plugins = [
'@babel/plugin-proposal-class-properties',
[
    '@babel/plugin-transform-runtime',
    {
    corejs: 3
    }
]
]

module.exports = { presets, plugins }
```

水太深了，浅尝辄止吧，喘口气😆
[github-babel中文手册传送门](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-stages-of-babel "传送门")
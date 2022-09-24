const presets = [
    [
        "@babel/env",
        {
            debug:true,
            // targets:{
            //     chrome:'58'
            // },
            useBuiltIns:'entry',
            // corejs:3,//指定corejs的版本
        }
    ]
]
const plugins =[
    '@babel/plugin-proposal-class-properties',
    [
        "@babel/plugin-transform-runtime",
        {
            corejs:3
        }
    ]
]
module.exports = {presets,plugins}


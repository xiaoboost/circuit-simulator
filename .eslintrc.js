module.exports = {
    'root': true,
    'parserOptions': {
        'sourceType': 'module'
    },
    'env': {
        'browser': true,
        'node': true,
        'es6': true
    },
    // 自定义规则
    'rules': {
        //允许扩展原生数据结构
        'no-extend-native': 0,
        //允许debugger语句
        'no-debugger': 0,
        //箭头表达式的括号不可省
        'arrow-parens': [2, 'always'],
        //箭头表达式前后空格
        'arrow-spacing': 2,
        //禁止在条件中使用常量表达式
        'no-constant-condition': 2,
        //生成器表达式 *号前有空格，后没有空格
        'generator-star-spacing': [2, 'before'],
        //表达式后必须有分号
        'semi': [2, 'always'],
        //不能存在多余的分号
        'no-extra-semi': 2,
        //允许存在不保存值的new表达式
        'no-new': 0,
        //默认退格为4个空格
        'indent': [2, 4, { 'SwitchCase': 1 }],
        //声明可以不合并
        'one-var': 0,
        //函数名或function关键字之后与括号之间不需要空格
        'space-before-function-paren': [2, 'never'],
        //代码块允许单独一行；多行代码时，起始大括号不换行，终止大括号独立成行
        'brace-style': [2, '1tbs', { 'allowSingleLine': true }],
        //允许在if,for,while,do...while的条件语句中赋值
        'no-cond-assign': 0,
        //允许等号前后有多个空格
        'no-multi-spaces' : 0,
        //禁用 alert、confirm 和 prompt
        'no-alert': 0,
        //禁用 arguments.caller 或 arguments.callee
        'no-caller': 2,
        //禁止使用类似 eval() 的方法
        'no-implied-eval': 2,
        //警告使用未声明的变量
        'no-undef': 1,
        //禁止将undefined作为标识符
        'no-undefined': 0,
        //不允许在变量定义之前使用它们
        'no-use-before-define': 0,
        //禁止混合常规 var 声明和 require 调用
        'no-mixed-requires': 0,
        //禁止调用 require 时使用 new 操作符
        'no-new-require': 2,
        //禁止对 __dirname 和 __filename进行字符串连接
        'no-path-concat': 0,
        //逗号后空格，前不空格
        'comma-spacing': [2, { 'before': false, 'after': true }],
        //以方括号取对象属性时，内部不需要空格
        'computed-property-spacing': [2, 'never'],
        //强制使用具名函数表达式
        'func-names': 0,
        //文件末尾强制换行
        'eol-last': 2,
        //不允许空格和 tab 混合缩进
        'no-mixed-spaces-and-tabs': 2,
        //禁用行尾空格
        'no-trailing-spaces':2,
        //关键字前后需要空格
        'keyword-spacing': 2,
        //禁用var
        'no-var': 2,
        //字符串全部为单引号
        'quotes': [2, 'single'],
        //变量未改变时强制使用const
        'prefer-const': 2,
        //强制使用ES6缩写
        'object-shorthand': 2,
        //类继承的构造函数强制使用super
        'constructor-super': 2,
        //super之前禁止使用this
        'no-this-before-super': 2,
        //除函数外，变量和类都在定义前使用时警告
        'no-use-before-define': [1, { 'functions': false }]
    }
}

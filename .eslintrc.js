module.exports = {
    'root': true,
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 7,
        'sourceType': 'module',
    },
    'env': {
        'browser': true,
        'node': true,
        'es6': true,
    },
    globals: {
        'window': true,
        'global': true,
    },
    // 自定义规则
    rules: {
        // 允许扩展原生数据结构
        'no-extend-native': 0,
        // 允许 debugger 语句
        'no-debugger': 0,
        // 箭头表达式的括号不可省
        'arrow-parens': [2, 'always'],
        // 箭头表达式前后空格
        'arrow-spacing': 2,
        // 禁止在条件中使用常量表达式
        'no-constant-condition': 2,
        // 生成器表达式 *号前有空格，后没有空格
        'generator-star-spacing': [2, 'before'],
        // 表达式后必须有分号
        'semi': [2, 'always'],
        // 不能存在多余的分号
        'no-extra-semi': 2,
        // 允许存在不保存值的new表达式
        'no-new': 0,
        // 默认退格为4个空格
        'indent': [2, 4, { 'SwitchCase': 1 }],
        // 声明可以不合并
        'one-var': 0,
        // 函数名或function关键字之后与括号之间不需要空格
        'space-before-function-paren': [2, 'never'],
        // 代码块允许单独一行；多行代码时，起始大括号不换行，终止大括号独立成行
        'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
        // 允许在if,for,while,do...while的条件语句中赋值
        'no-cond-assign': 0,
        // 允许等号前后有多个空格
        'no-multi-spaces' : 0,
        // 禁用 alert、confirm 和 prompt
        'no-alert': 0,
        // 禁用 arguments.caller 或 arguments.callee
        'no-caller': 2,
        // 禁止使用类似 eval() 的方法
        'no-implied-eval': 2,
        // 警告使用未声明的变量
        'no-undef': 1,
        // 禁止将 undefined 作为标识符
        'no-undefined': 0,
        // 不允许在变量定义之前使用它们
        'no-use-before-define': 0,
        // 禁止混合常规 var 声明和 require 调用
        'no-mixed-requires': 0,
        // 禁止调用 require 时使用 new 操作符
        'no-new-require': 2,
        // 禁止对 __dirname 和 __filename进行字符串连接
        'no-path-concat': 0,
        // 逗号后空格，前不空格
        'comma-spacing': [2, { 'before': false, 'after': true }],
        // 以方括号取对象属性时，内部不需要空格
        'computed-property-spacing': [2, 'never'],
        // 强制使用具名函数表达式
        'func-names': 0,
        // 文件末尾强制换行
        'eol-last': 2,
        // 不允许空格和 tab 混合缩进
        'no-mixed-spaces-and-tabs': 2,
        // 禁用行尾空格
        'no-trailing-spaces':2,
        // 关键字前后需要空格
        'keyword-spacing': 2,
        // 禁用var
        'no-var': 2,
        // 字符串全部为单引号
        'quotes': [2, 'single'],
        // 变量未改变时强制使用 const
        'prefer-const': 2,
        // 强制使用 ES6 缩写
        'object-shorthand': 2,
        // 类继承的构造函数强制使用 super
        'constructor-super': 2,
        // super之前禁止使用this
        'no-this-before-super': 2,
        // 除函数外，变量和类都在定义前使用时警告
        'no-use-before-define': [1, { 'functions': false }],
        // 强制驼峰
        'camelcase': [0, { 'properties': 'always' }],
        // 对象末尾与另一个元素或属性的结尾处于不同的行时需要逗号，同一行时不需要
        'comma-dangle': ['error', 'always-multiline'],
        // 强制 getter/setter 成对出现在对象中 
        'accessor-pairs': 2,
        // 强制在单行代码块中使用空格 
        'block-spacing': [2, 'always'],
        // 强制在单行块内使用空格
        'comma-style': [2, 'last'],
        // 允许单行代码块省略大括号
        'curly': [2, 'multi-line'],
        // 允许点运算符换行，切不允许点运算符放在行末
        'dot-location': [2, 'property'],
        // 除了和 null 比较之外，全部强制使用 === 和 !==
        'eqeqeq': [2, "always", {"null": "ignore"}],
        // 事件完成回调时的 error 参数的名字
        'handle-callback-err': [2, '^(err|error)$' ],
        // 在 jsx 中使用单引号
        'jsx-quotes': [2, 'prefer-single'],
        // 对象字面量中，冒号和键之间不要空格，冒号和值之间需要空格
        'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }],
        // 使用 new 运算符的函数首字母必须大写；首字母大写的函数不一定需要 new 运算符
        'new-cap': [2, { 'newIsCap': true, 'capIsNew': false }],
        // 使用 new 的构造函数必须带圆括号
        'new-parens': 2,
        // 使用 Array 构造函数创建数组时，只允许单参数
        'no-array-constructor': 2,
        // 不允许修改类声明的变量
        'no-class-assign': 2,
        // 不允许修改 const 声明的变量
        'no-const-assign': 2,
        // 禁止怼变量使用 delete 运算
        'no-delete-var': 2,
        // 禁止函数声明中存在重名的变量
        'no-dupe-args': 2,
        // 不允许类成员中有重复的名称
        'no-dupe-class-members': 2,
        // 禁止在对象字面量中出现重复的键 
        'no-dupe-keys': 2,
        // 禁止重复 case 标签
        'no-duplicate-case': 2,
        // 禁止在正则表达式中出现空字符集 
        'no-empty-character-class': 2,
        // 解构模式不允许为空
        'no-empty-pattern': 2,
        // 禁用 eval()
        'no-eval': 2,
        // 禁止对 catch 子句中的异常重新赋值
        'no-ex-assign': 2,
        // 禁止不必要的函数绑定 bind
        'no-extra-bind': 2,
        // 禁止不必要的布尔类型转换
        'no-extra-boolean-cast': 2,
        // 禁止在 function 周围多余的括号
        'no-extra-parens': [2, 'functions'],
        // 除最后一个外，禁止 case 语句落空（缺少return, break）
        'no-fallthrough': 2,
        // 禁止浮点小数
        'no-floating-decimal': 2,
        // 禁止对 function 声明的函数名重新赋值
        'no-func-assign': 2,
        // 禁止在嵌套的语句块中出现 function 声明
        'no-inner-declarations': [2, 'functions'],
        // 禁止在 RegExp 构造函数中出现无效的正则表达式
        'no-invalid-regexp': 2,
        // 禁止不规则的空白
        'no-irregular-whitespace': 2,
        // 禁用迭代器（这里并不是指ES6的迭代器）
        'no-iterator': 2,
        // 禁用与变量同名的标签
        'no-label-var': 2,
        // 在循环和 switch 语句之外，禁用标签语句
        'no-labels': [2, { 'allowLoop': false, 'allowSwitch': false }],
        // 禁用不必要的嵌套块
        'no-lone-blocks': 2,
        // 禁止多行字符串
        'no-multi-str': 2,
        // 最多允许一个空行
        'no-multiple-empty-lines': [2, { 'max': 1 }],
        // 禁止原生内置变量的重新赋值
        'no-global-assign': 2,
        // 禁止不安全的 ! 运算
        'no-unsafe-negation': 2,
        // 禁止使用 Object 构造函数来创建对象
        'no-new-object': 2,
        // 禁止 Symbol 使用 new 运算符
        'no-new-symbol': 2,
        // 使用 String, Number, Boolean 创建变量时禁止使用 new
        'no-new-wrappers': 2,
        // 禁止将全局对象当作函数进行调用（比如 Math）
        'no-obj-calls': 2,
        // 禁用八进制字面量
        'no-octal': 2,
        // 禁止在字符串字面量中使用八进制转义序列
        'no-octal-escape': 2,
        // 禁用 __proto__
        'no-proto': 2,
        // 禁止重新声明变量
        'no-redeclare': 2,
        // 禁止正则表达式字面量中出现多个空格
        'no-regex-spaces': 2,
        // 禁止在返回语句中赋值，除非将赋值语句用括号括起来
        'no-return-assign': [2, 'except-parens'],
        // 禁止自身赋值
        'no-self-assign': 2,
        // 禁止自身比较
        'no-self-compare': 2,
        // 关键字不能被遮蔽
        'no-shadow-restricted-names': 2,
        // 函数调用时，函数名和括号之间不允许空格和换行
        'func-call-spacing': [2, 'never'],
        // 禁用稀疏数组
        'no-sparse-arrays': 2,
        // 抛出异常时必须使用 Error
        'no-throw-literal': 2,
        // 不允许初始化变量值为 undefined 
        'no-undef-init': 2,
        // 禁止使用令人困惑的多行表达式
        'no-unexpected-multiline': 2,
        // 禁用一成不变的循环条件
        'no-unmodified-loop-condition': 2,
        // 禁止可以表达为更简单结构的三元操作符
        'no-unneeded-ternary': 2,
        // 禁止在 return、throw、continue 和 break 语句后出现不可达代码 
        'no-unreachable': 2,
        // 禁止在 finally 语句块中出现控制流语句
        'no-unsafe-finally': 2,
        // 禁止未使用过的变量，在函数参数中，最后一个参数必须使用
        'no-unused-vars': [2, { 'vars': 'all', 'args': 'after-used' }],
        // 禁用不必要的 .call() 和 .apply()
        'no-useless-call': 2,
        // 禁止对象中不必要的计算属性键
        'no-useless-computed-key': 2,
        // 禁用不必要的构造函数
        'no-useless-constructor': 2,
        // 禁用不必要的转义
        'no-useless-escape': 2,
        // 点运算前后禁止空白
        'no-whitespace-before-property': 2,
        // 禁用 with 语句
        'no-with': 2,
        // 换行符放在操作符后面，但是对于 ?, : ，操作符会放在它们俩之前
        'operator-linebreak': [2, 'after', { 'overrides': { '?': 'before', ':': 'before' } }],
        // 禁止块内填充
        'padded-blocks': [2, 'never'],
        // 强制分号前没有空格，强制分号后需要空格
        'semi-spacing': [2, { 'before': false, 'after': true }],
        // 强制要求语句块之前的空格
        'space-before-blocks': [2, 'always'],
        // 圆括号内前后不需要空格
        'space-in-parens': [2, 'never'],
        // 要求中缀操作符周围有空格
        'space-infix-ops': 2,
        // 单词运算符后需要空格，符号一元运算符不需要
        'space-unary-ops': [2, { 'words': true, 'nonwords': false }],
        // 注释符号后需要至少一个空格
        'spaced-comment': [2, 'always', { 'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ','] }],
        // 模板字符串中变量不允许存在空格
        'template-curly-spacing': [2, 'never'],
        // 检查 NaN 必须使用 isNaN()
        'use-isnan': 2,
        // 强制 typeof 表达式与有效的字符串进行比较
        'valid-typeof': 2,
        // 立即执行的函数需要用括号包裹起来 
        'wrap-iife': [2, 'inside'],
        // 在 yield* 表达式中， * 前面需要空格
        'yield-star-spacing': [2, 'before'],
        // 禁用 yoda 风格
        'yoda': [2, 'never'],
        // 禁止以对象元素开始或结尾的对象的花括号中有空格
        'object-curly-spacing': [2, 'always', { objectsInObjects: false }],
        // 禁止在方括号前后使用空格
        'array-bracket-spacing': [2, 'never'],
        // 允许使用 console
        'no-console': 0,
    },
};

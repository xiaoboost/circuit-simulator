//多项式、传递函数类
class Polynomial {
    //构造函数
    constructor(...args) {
        //格式检查
        if (args.length > 2) throw ('输入最多有分子和分母两个元素');
        if (!args.length) throw ('输入不能为空');
        let num = (typeof args[0][0] === 'number') ? args : args[0];
        for (let i = 0; i < num.length; i++) {
            if (!Polynomial.isPolynomial(num[i])) throw ('格式错误');
        }
        this.numerator = Array.clone(num[0]);                       //分子
        this.denominator = (num[1]) ? Array.clone(num[1]) : [1];    //分母
    }

    //多项式格式检查
    static isPolynomial(input) {
        if (!(input instanceof Array)) return (false);
        for (let i = 0; i < input.length; i++) {
            if (typeof input[i] !== 'number') return (false);
        }
        return (true);
    }
    //省略分母（为1）的多项式相乘，默认不检查格式
    static conv(a, b, flag = false) {
        if (flag) {
            for (let i = 0; i < 2; i++) {
                const input = [a, b][i];
                if (!Polynomial.isPolynomial(input)) throw ('多项式元素必须是数字数组');
            }
        }
        const ans = [];
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                const sub = i + j;
                if (!ans[sub]) ans[sub] = 0;
                ans[sub] += a[i] * b[j];
            }
        }
        //空位补0
        for (let i = 0; i < ans.length; i++) {
            if (!ans[i]) ans[i] = 0;
        }
        //最高次数不能为0
        while (!ans[ans.length - 1]) {
            ans.pop();
        }
        return (ans);
    }
    //多项式次方
    static exp(a, e) {
        if ((!Polynomial.isPolynomial(a)) || (typeof e !== 'number')) throw ('格式错误');
        let ans = [1];
        for (let i = 0; i < e; i++) {
            ans = Polynomial.conv(ans, a);
        }
        return (ans);
    }

    //多项式化简
    simple() {
        //有单个公共未知数，可以降阶
        while ((!this.numerator[0]) && (!this.denominator[0])) {
            this.numerator.shift();
            this.denominator.shift();
        }
        //attention：提取公因式和系数的公约数

        return (this);
    }
    //多项式的倒数
    inverse() {
        [this.numerator, this.denominator] = [this.denominator, this.numerator];
        return (this);
    }
    //多项式相乘
    mul(input) {
        //被乘数
        const multiplicand = (input instanceof Polynomial) ? input : new Polynomial(input);
        //分子分母分别相乘
        const ans = new Polynomial(
            Polynomial.conv(this.numerator, multiplicand.numerator),
            Polynomial.conv(this.denominator, multiplicand.denominator)
        );
        ans.simple();
        return (ans);
    }
    //多项式相加
    add(input) {
        //被加数
        const summand = (input instanceof Polynomial) ? input : new Polynomial(input);
        let numerator, denominator;
        //分母相同，那么分子直接相加
        if (this.denominator.isEqual(summand.denominator)) {
            numerator = [this.numerator, input.numerator, []];
            denominator = this.denominator;
        } else {
            denominator = Polynomial.conv(this.denominator, summand.denominator);
            numerator = [
                Polynomial.conv(this.numerator, summand.denominator),
                Polynomial.conv(this.denominator, summand.numerator),
                []
            ];
        }
        const lengthLong = Math.max(numerator[0].length, numerator[1].length);
        for (let i = 0; i < lengthLong; i++) {
            numerator[2][i] = numerator[0][i] + numerator[1][i];
        }
        const ans = new Polynomial(denominator, numerator[2]);
        ans.simple();
        return (ans);
    }
    //分母最高次项系数为1
    maxToOne() {
        //分母最高次系数为1
        const number = this.denominator[this.denominator.length - 1];
        for (let i = 0; i < this.numerator.length; i++) {
            this.numerator[i] /= number;
        }
        for (let i = 0; i < this.denominator.length; i++) {
            this.denominator[i] /= number;
        }
        this.denominator[this.denominator.length - 1] = 1;
        return (this);
    }
    //替换未知数
    replaceUnknow(input) {
        //被替换多项式
        const replaced = (input instanceof Polynomial) ? input : new Polynomial(input);
        const ans = [[],[]];
        for (let k = 0; k < 2; k++) {
            const factor = [this.numerator, this.denominator][k];
            for (let i = 0; i < factor.length; i++) {
                const polyNow = Polynomial.conv(
                    Polynomial.exp(replaced.numerator, i),
                    Polynomial.exp(replaced.denominator, factor.length - i - 1)
                );
                for (let j = 0; j < polyNow.length; j++) {
                    if (!ans[k][j]) ans[k][j] = 0;
                    ans[k][j] += polyNow[j] * factor[i];
                }
            }
        }
        const diff = this.numerator.length - this.denominator.length;
        if (diff > 0) {
            //分子最高次高于分母最高次
            const additional = Polynomial.exp(replaced.denominator, diff);
            ans[1] = Polynomial.conv(ans[1], additional);
        }else if (diff < 0) {
            //分子最高次高于分母最高次
            const additional = Polynomial.exp(replaced.denominator, -diff);
            ans[0] = Polynomial.conv(ans[0], additional);
        }
        return ((new Polynomial(ans)).simple());
    }
    //双线性离散化
    toDiscrete(time) {
        //用双线性变换离散化
        const disTransfer = this.replaceUnknow(
            new Polynomial([-2, 2], [time, time])
        ).maxToOne();
        const ans = {
            'outputFactor': disTransfer.denominator,
            'inputFactor': disTransfer.numerator
        };
        //输出差分系数比输入差分系数多，那么输入差分系数需要往高次项补零
        if (ans.outputFactor.length > ans.inputFactor.length) {
            ans.inputFactor.concat(new Array(ans.outputFactor.length - ans.inputFactor.length));
        }
        //输出差分系数分母删除最高次项（此项就是输出本体）
        ans.outputFactor.pop();
        ans.outputFactor.reverse();
        //输出差分系项移相要反号
        for (let i = 0; i < ans.outputFactor.length; i++)
            ans.outputFactor[i] *= -1;
        ans.inputFactor.reverse();
        //差分数据队列初始化
        ans.input = new Array(ans.inputFactor.length).fill(0);
        ans.output = new Array(ans.outputFactor.length).fill(0);
        return (ans);
    }
}

export { Polynomial };

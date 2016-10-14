import { Matrix } from './matrix'

//单个器件的最大值
const maxNumber = 50;

/*
//求解当前电路
//使用此方法的实例必须是单个电路连通区域
*solve() {
    //从管脚到支路电流计算矩阵
    function pinToCurrent(pin) {
        const node = nodeHash[pin];
        const branch = [];
        //和当前管脚相连的其余管脚
        for (let i in nodeHash) if (nodeHash.hasOwnProperty(i)) {
            if ((nodeHash[i] === node) && (i !== pin)) {
                branch.push(i);
            }
        }
        const ans = new Matrix(1, branchNumber);
        for (let i = 0; i < branch.length; i++) {
            ans[0][branchHash[branch[i]]] = Math.pow(-1, parseInt(branch[i][branch[i].length - 1]) + 1);
        }
        return (ans);
    }

    //从管脚到节点电压计算矩阵
    function pinToVoltage(pin) {
        const ans = new Matrix(1, nodeNumber);
        for (let i = 0; i < 2; i++) {
            if (nodeHash[pin[i]]) {
                ans[0][nodeHash[pin[i]] - 1] = Math.pow(-1, i);
            }
        }
        return (ans);
    }

    //器件填写参数
    function fillMatrixByPart(item, input, index) {
        let ans = index;
        switch (item.partType) {
            case "ac_voltage_source" :
            {
                F[index][index] = 1;
                S[index][0] = "update-" + parameterUpdate.length + "-0";
                parameterUpdate.push(partInternal[item.partType]["iterative"]["create"](item));
                break;
            }
            case "dc_voltage_source" :
            {
                F[index][index] = 1;
                S[index][0] = Math.toValue(input[0]);
                break;
            }
            case "dc_current_source" :
            {
                H[index][index] = 1;
                S[index][0] = Math.toValue(input[0]);
                break;
            }
            case "resistance" :
            {
                F[index][index] = -1;
                H[index][index] = Math.toValue(input[0]);
                break;
            }
            case "capacitor" :
            {
                F[index][index] = 1;
                S[index][0] = "update-" + parameterUpdate.length + "-0";
                const parameter = partInternal[item.partType]["iterative"]["create"](item);
                const input = parameter.describe[0];
                input.matrix = pinToCurrent(input.place);
                parameterUpdate.push(parameter);
                break;
            }
            //压控压源
            case "VCVS" :
            {
                F[index][index] = 1;
                F[index][branchHash[input[1]]] = Math.toValue(input[0]);
                break;
            }
            //流控流源
            case "CCCS" :
            {
                let temp = Math.toValue(input[0]);
                if(typeof temp === "number") temp *= -1;
                H[index][index] = 1;
                H[index][branchHash[input[1]]] = temp;
                break;
            }
            case "operational_amplifier" :
            case "transistor_npn" :
            case "diode" :
            {
                const parts = partInternal[item.partType]["apart"]["parts"];
                for (let i = 0; i < parts.length; i++) {
                    let index = -1, value;
                    item.inputTxt.some((n, sub) => ((n.indexOf(parts[i].value) !== -1) && (index = sub)));
                    //fillMatrixByPart(parts[i], ["update-" + parameterUpdate.length + parts[i].value], ans + i);
                    if (index !== -1) {
                        //器件的某值直接填入
                        value = (parts[i].partType === "VCVS") ?
                            (Math.pow(10, parseInt(item.input[index]) / 20)).toString() :
                            item.input[index];
                    } else {
                        //迭代生成的值
                        value = "update-" + parameterUpdate.length + parts[i].value;
                    }
                    fillMatrixByPart(parts[i], [value, item.id + parts[i].relational], ans + i);
                }
                ans += parts.length - 1;

                //运放的迭代公式现在还不可用
                if(item.partType !== "operational_amplifier") {
                    const parameter = partInternal[item.partType]["iterative"]["create"](item);
                    for(let i = 0; i < parameter.describe.length; i++) {
                        const input = parameter.describe[i];
                        input.matrix = pinToVoltage(input.place);
                    }
                    parameterUpdate.push(parameter);
                }
                break;
            }
        }
        return (ans + 1);
    }
    */

    //器件的内部结构
/*
    const partInternal = {
        //器件的内部结构，分为迭代方程和拆分结构两类
        //迭代方程有方程原型以及方程生成函数
        //拆分解构下有器件对外管脚到内部管脚的接口列表、拆分器件内部的连接关系表、拆分器件原型
        "ac_voltage_source": {
            "iterative": {
                "equation": function (t) {
                    return ([this.factor * Math.sin((this.frequency * t) * Math.PI * 2 + this.phase / 180 * Math.PI) + this.bias]);
                },
                "create": function (part) {
                    const ans = {
                        "to": []
                    };
                    ans.process = partInternal["ac_voltage_source"]["iterative"]["equation"].bind({
                        "factor": Math.toValue(part.input[0]),
                        "frequency": Math.toValue(part.input[1]),
                        "bias": Math.toValue(part.input[2]),
                        "phase": Math.toValue(part.input[3])
                    });
                    //迭代方程参数描述
                    ans.describe = [
                        {"name": "time"}
                    ];
                    return (ans);
                }
            }
        },
        "capacitor": {
            "iterative": {
                "equation": function (value, timeInterval, save) {
                    //积分，一阶近似累加
                    const current = (value + save.last) / 2 * timeInterval + save.integral;
                    save.last = value;
                    save.integral = current;
                    const voltage = current / this.valueCap;
                    return ([voltage]);
                },
                "create": function (part) {
                    const ans = {
                        "save": {
                            "last": 0,
                            "integral": 0
                        },
                        "to": []
                    };
                    ans.process = partInternal["capacitor"]["iterative"]["equation"].bind({
                        "valueCap": Math.toValue(part.input[0])
                    });
                    ans.describe = [
                        {"name": "current", "place": part.id + "-0"},
                        {"name": "timeInterval"},
                        {"name": "save"}
                    ];
                    return (ans);
                }
            }
        },
        "diode": {
            "iterative": {
                "equation": function (voltage) {
                    if (voltage >= this.turnOnVoltage) {
                        return ([this.turnOnRes, this.turnOnVoltage]);
                    } else {
                        return ([this.turnOffRes, 0]);
                    }
                },
                "create": function (part) {
                    const ans = {
                        "to": []
                    };
                    ans.process = partInternal[part.partType]["iterative"]["equation"].bind({
                        "turnOnVoltage": Math.toValue(part.input[0]),
                        "turnOnRes": Math.toValue(part.input[1]),
                        "turnOffRes": Math.toValue(part.input[2])
                    });
                    const external = partInternal["diode"]["apart"]["interface"];
                    ans.describe = [
                        {
                            "name": "voltage",
                            "place": [part.id + "-" + external[1][0], part.id + "-" + external[0][0]]
                        }
                    ];
                    return (ans);
                }
            },
            "apart": {
                "interface": [
                    ["R1-0"],
                    ["VD1-0"]
                ],
                "connect": [
                    ["R1-1", "VD1-1"]
                ],
                "parts": [
                    {
                        "partType": "resistance",
                        "id": "R1",
                        "value": "-0"
                    },
                    {
                        "partType": "dc_voltage_source",
                        "id": "VD1",
                        "value": "-1"
                    }
                ]
            }
        },
        "transistor_npn": {
            "iterative" : {
                "equation" : function(vd1, vd2) {
                    const ans = new Array(4).fill(0);

                     //ans[0] 基极导通压降
                     //ans[1] E极导通压降
                     //ans[2] 基极电阻
                     //ans[3] 电流放大倍数
                    if (vd1 >= this.voltageB) {
                        //基极正向偏置
                        ans[0] = this.voltageB;
                        ans[2] = this.ResB;
                        if (vd2 >= this.voltageCE) {
                            //发射极正向偏置
                            ans[1] = this.voltageCE;
                            ans[3] = -this.currentZoom;
                        } else {
                            //发射极反向偏置
                            ans[1] = 0;
                            ans[3] = 0;
                        }
                    } else {
                        //基极反向偏置
                        ans[0] = 0;
                        ans[1] = 0;
                        ans[2] = 5e9;
                        ans[3] = 0;
                    }
                    return (ans);
                },
                "create" : function(part) {
                    const ans = {
                        "to": []
                    };
                    ans.process = partInternal[part.partType]["iterative"]["equation"].bind({
                        "currentZoom": Math.toValue(part.input[0]),
                        "ResB": Math.toValue(part.input[1]),
                        "voltageB": Math.toValue(part.input[2]),
                        "voltageCE": Math.toValue(part.input[3])
                    });
                    const external = partInternal["transistor_npn"]["apart"]["interface"];
                    ans.describe = [
                        {
                            "name": "voltage",
                            "place": [part.id + "-" + external[0][0], part.id + "-" + external[2][0]]
                        },
                        {
                            "name": "voltage",
                            "place": [part.id + "-" + external[1][0], part.id + "-" + external[2][0]]
                        }
                    ];
                    return (ans);
                }
            },
            "apart": {
                "interface": [
                    ["V1-0"],
                    ["V2-0"],
                    ["R1-1", "I1-1"]
                ],
                "connect": [
                    ["R1-0", "V1-1"],
                    ["I1-0", "V2-1"]
                ],
                "parts": [
                    {
                        "partType": "dc_voltage_source",
                        "id": "V2",
                        "value": "-0"
                    },
                    {
                        "partType": "dc_voltage_source",
                        "id": "V1",
                        "value": "-1"
                    },
                    {
                        "partType": "resistance",
                        "id": "R1",
                        "value": "-2"
                    },
                    {
                        "partType": "CCCS",
                        "id": "I1",
                        "value": "-3",
                        "relational": "-R1-0"
                    }
                ]
            }
        },
        "operational_amplifier": {
            "iterative": {
                "equation" : function (voltage) {
                    let ans = 0;
                    //当前数据进入“输入数据队列”
                    this.input.unshift(voltage);
                    this.input.pop();
                    for (let i = 0; i < this.input.length; i++) {
                        ans += this.inputFactor[i] * this.input[i];
                    }
                    for (let i = 0; i < this.output.length; i++) {
                        ans += this.outputFactor[i] * this.output[i];
                    }
                    //输出数据进入“输出数据队列”
                    this.output.unshift(ans);
                    this.output.pop();
                    return ([ans]);
                },
                "create": function (part) {
                    const rad = 0.5 / Math.PI;
                    //第一个极点
                    const pole = [];
                    let bandWidth = Math.log10(Math.toValue(part.input[1])) * 20;
                    let openLoopGain = parseFloat(part.input[0]);
                    pole[0] = 1 / Math.pow(10, (bandWidth - openLoopGain) / 20);
                    //第二个极点
                    pole[1] = 1 / Math.round(Math.pow(10, (bandWidth + 4) / 20));
                    //开环增益转换为普通单位
                    openLoopGain = Math.pow(10, openLoopGain / 20);
                    //传递函数
                    const transfer = new Polynomial(
                        [openLoopGain],                                             //分子为开环增益常数
                        Polynomial.conv([1, pole[0] * rad], [1, pole[1] * rad])     //分母为双极点多项式相乘
                    );
                    //采样间隔时间
                    const stepSize = Math.signFigures(Math.toValue(document.getElementById("stepsize").value));
                    const ans = {
                        "to": []
                    };
                    //差分方程绑定到迭代公式
                    ans.process = partInternal[part.partType]["iterative"]["equation"].bind(transfer.toDiscrete(stepSize));
                    ans.describe = [
                        {"name": "voltage", "place": [part.id + "-R1-1", part.id + "-R1-0"]}
                    ];
                    return (ans);
                }
            },
            "apart": {
                "interface": [
                    ["R1-1"],
                    ["R1-0"],
                    ["R2-0"]
                ],
                "connect": [
                    ["R2-1", "VD1-0"]
                ],
                "parts": [
                    {
                        "partType": "resistance",
                        "id": "R1",
                        "value": "输入电阻"
                    },
                    {
                        "partType": "resistance",
                        "id": "R2",
                        "value": "输出电阻"
                    },
                    {
                        "partType": "VCVS",
                        "id": "VD1",
                        "value": "开环增益",
                        "relational": "-R1-0"
                    }
                ]
            }
        }
    };
*/
/*
    //临时变量初始化
    const nodeHash = {};            //[管脚->节点号]对应表
    const branchHash = {};          //[管脚->支路号]对应表
    const observeCurrent = [];      //电压观测
    const observeVoltage = [];      //电流观测
    const parameterUpdate = [];     //参数迭代公式
    let nodeNumber = 1;             //节点数量
    let branchNumber = 0;           //支路数量
    let factorUpdateFlag = false;   //电路方程系数迭代标志
    const tempLines = new PartsCollection();    //待删除器件

    //扫描所有导线(以后可能还会有“网络标识符”)，建立[管脚->节点号]对应表
    this.forEach(function (item) {
        //当前器件为导线，且还没有访问过
        if ((item.partType === "line") && (!tempLines.has(item))) {
            //搜索用临时导线堆栈
            const node = new PartsCollection(item);
            //搜索当前导线构成的节点
            while (node.length) {
                const line = node.pop();
                tempLines.push(line);
                line.connect.join(" ").split(" ").forEach(function (item) {
                    const temp = partsAll.findPartObj(item.split("-")[0]);
                    if (temp.partType === "line") {
                        if (!(node.has(temp) || tempLines.has(temp)))
                            node.push(temp);
                    } else if (item.search("-") !== -1) {
                        nodeHash[item] = nodeNumber;
                    }
                });
            }
            nodeNumber++;
        }
    });
    //扫描所有器件，部分器件需要拆分，追加nodeHash列表、建立[管脚->支路号]列表
    this.forEach(function (item) {
        if (item.partType === "line" || item.partType === "current_meter" || item.partType === "voltage_meter" || item.partType === "reference_ground")
            return (true);
        if (partInternal[item.partType] && partInternal[item.partType]["apart"]) {
            const external = partInternal[item.partType]["apart"]["interface"];
            const internal = partInternal[item.partType]["apart"]["connect"];
            const partsPrototype = partInternal[item.partType]["apart"]["parts"];
            //对外管脚号转换为内部标号
            for (let i = 0; i < external.length; i++) {
                const node = nodeHash[item.id + "-" + i];
                for (let j = 0; j < external[i].length; j++) {
                    nodeHash[item.id + "-" + external[i][j]] = node;
                }
                delete nodeHash[item.id + "-" + i];
            }
            //根据器件内部结构追加nodeHash
            for (let i = 0; i < internal.length; i++) {
                for (let j = 0; j < internal[i].length; j++) {
                    nodeHash[item.id + "-" + internal[i][j]] = nodeNumber;
                }
                nodeNumber++;
            }
            for (let i = 0; i < partsPrototype.length; i++) {
                const part = partsPrototype[i];
                branchHash[item.id + "-" + part.id + "-0"] = branchNumber;
                branchHash[item.id + "-" + part.id + "-1"] = branchNumber;
                branchNumber++;
            }
        } else {
            branchHash[item.id + "-0"] = branchNumber;
            branchHash[item.id + "-1"] = branchNumber;
            branchNumber++;
        }
    });
    //删除所有的参考节点，合并且记录电流表入口
    this.forEach(function (n) {
        if (n.partType === "reference_ground") {
            const tempNode = nodeHash[n.id + "-0"];
            for (let item in nodeHash) if (nodeHash.hasOwnProperty(item)) {
                if (nodeHash[item] > tempNode) {
                    nodeHash[item]--;       //标号比参考节点大的依次减1
                } else if (nodeHash[item] === tempNode) {
                    nodeHash[item] = 0;     //参考节点为0
                }
            }
            delete nodeHash[n.id + "-0"];
            tempLines.push(n);
        } else if (n.partType === "current_meter") {
            const meter = {};
            meter.name = n.id;
            meter.matrix = [];
            meter.data = [];
            //记录和电流表入口相连的所有管脚
            const node = nodeHash[n.id + "-0"];     //电流表入口结点
            for (let i in nodeHash) if (nodeHash.hasOwnProperty(i)) {
                if ((nodeHash[i] === node) && (i.search("GND") === -1)) {
                    const temp = partsAll.findPartObj(i.split("-")[0]);
                    //此时电压电流表还未删除，所以必须排除
                    if ((temp.partType !== "voltage_meter") && (temp.partType !== "current_meter"))
                        meter.matrix.push(i);
                }
            }
            //删除电流表，合并其两端结点
            //删除数值大的结点
            const node0 = Math.min(nodeHash[n.id + "-0"], nodeHash[n.id + "-1"]);
            const node1 = Math.max(nodeHash[n.id + "-0"], nodeHash[n.id + "-1"]);
            for (let i in nodeHash) if (nodeHash.hasOwnProperty(i)) {
                if (nodeHash[i] === node1) {
                    nodeHash[i] = node0;
                } else if (nodeHash[i] > node1) {
                    nodeHash[i]--;
                }
            }
            observeCurrent.push(meter);
            tempLines.push(n);              //电流表进入待删除器件集合
            delete nodeHash[n.id + "-0"];   //删除电流表的hash值
            delete nodeHash[n.id + "-1"];
        }
    });
    //错误检查
    const error = function (nodeHash) {

    }(nodeHash);
    //错误输出
    if (error) {
        schematic.errorTips(error);
        return (false);
    }
    //计算结点数量
    nodeNumber = function (Hash) {
        let temp = -1;
        for (let i in Hash) if (Hash.hasOwnProperty(i)) {
            if (Hash[i] > temp)
                temp = Hash[i];
        }
        return (temp);
    }(nodeHash);
    //电压观测矩阵
    this.forEach(function (n) {
        if (n.partType === "voltage_meter") {
            //电压观测矩阵
            const temp = {};
            temp.name = n.id;
            temp.data = [];
            temp.matrix = new Matrix(1, nodeNumber);
            if (nodeHash[n.id + "-0"]) temp.matrix[0][nodeHash[n.id + "-0"] - 1] += 1;
            if (nodeHash[n.id + "-1"]) temp.matrix[0][nodeHash[n.id + "-1"] - 1] += -1;
            if (nodeHash.hasOwnProperty(n.id + "-0")) delete nodeHash[n.id + "-0"];
            if (nodeHash.hasOwnProperty(n.id + "-1")) delete nodeHash[n.id + "-1"];
            observeVoltage.push(temp);
            tempLines.push(n);
        }
    });
    //删去删去所有参考地、电压表
    this.deleteParts(tempLines);
    tempLines.deleteAll();
    //电流观测矩阵
    for (let i = 0; i < observeCurrent.length; i++) {
        const currentHash = observeCurrent[i].matrix;
        observeCurrent[i].matrix = new Matrix(1, branchNumber);
        const matrix = observeCurrent[i].matrix;
        for (let j = 0; j < currentHash.length; j++) {
            const item = currentHash[j];
            matrix[0][branchHash[item]] = Math.pow(-1, parseInt(item[item.length - 1]) + 1);
        }
    }
    //电路矩阵初始化
    const A = new Matrix(nodeNumber, branchNumber);   //关联矩阵
    const F = new Matrix(branchNumber);               //电导电容矩阵
    const H = new Matrix(branchNumber);               //电阻电感矩阵
    const S = new Matrix(branchNumber, 1);            //独立电压电流源列向量
    //扫描所有支路，建立关联矩阵
    for (let i in branchHash) if (branchHash.hasOwnProperty(i)) {
        const row = nodeHash[i];
        //不是参考节点
        if (row) {
            A[row - 1][branchHash[i]] = Math.pow(-1, parseInt(i[i.length - 1]) + 1);
        }
    }
    //扫描所有器件，建立器件矩阵
    let tempindex = 0;
    this.forEach(function (item) {
        tempindex = fillMatrixByPart(item, item.input, tempindex);
    });
    //组合系数矩阵
    let factor = Matrix.combination([
        [0, 0, A],
        [A.transpose(), "E", 0],
        [0, F, H]
    ]);
    //独立电源列向量
    const source = (new Matrix(A.row, 1)).concatDown((new Matrix(A.column, 1)), S);
    //枚举电源列向量，记录需要迭代的参数
    source.forEach(function (item, index) {
        //字符串为之前的标记
        if (typeof item === "string") {
            const sub = item.split("-");
            const update = parameterUpdate[sub[1]];
            update.to[sub[2]] = {
                "type": source,
                "place": Array.clone(index)
            };
        }
    });
    //枚举方程系数，记录需要迭代的参数
    factor.forEach(function (item, index) {
        //字符串为之前的标记
        if (typeof item === "string") {
            const sub = item.split("-");
            const update = parameterUpdate[sub[1]];
            update.to[sub[2]] = {
                "type": factor,
                "place": Array.clone(index)
            };
        }
    });
    //取出设置界面的时间设定
    const endTime = Math.signFigures(Math.toValue(document.getElementById("endtime").value));
    const stepSize = Math.signFigures(Math.toValue(document.getElementById("stepsize").value));
    //电路初始状态
    let nodeVoltage = new Matrix(nodeNumber, 1);        //结电电压列向量
    let branchCurrent = new Matrix(branchNumber, 1);    //支路电流列向量
    let factorInverse;
    //迭代求解
    for (let i = 0; i <= Math.round(endTime / stepSize); i++) {
        factorUpdateFlag = false;
        //更新相关参数
        for (let j = 0; j < parameterUpdate.length; j++) {
            const item = parameterUpdate[j];
            const args = [];
            for (let k = 0; k < item.describe.length; k++) {
                const parameter = item.describe[k];
                switch (parameter.name) {
                    case "time":
                        args.push(i * stepSize);
                        break;
                    case "timeInterval":
                        args.push(stepSize);
                        break;
                    case "voltage":
                        args.push(parameter.matrix.mul(nodeVoltage));
                        break;
                    case "current":
                        args.push(parameter.matrix.mul(branchCurrent));
                        break;
                    case "save":
                        args.push(parameterUpdate[j].save);
                        break;
                }
            }
            const ans = item.process(...args);
            for (let k = 0; k < item.to.length; k++) {
                const matrix = item.to[k].type;
                const index = item.to[k].place;
                if ((matrix === factor) && (matrix[index[0]][index[1]] !== ans[k])) {
                    factorUpdateFlag = true;
                }
                matrix[index[0]][index[1]] = ans[k];
            }
        }
        //如果更新了系数矩阵，那么系数矩阵需要重新求逆
        if (factorUpdateFlag || !i) factorInverse = factor.inverse();
        //求解电路
        const ans = factorInverse.mul(source);
        nodeVoltage = ans.slice([0, 0], [nodeNumber - 1, 0]);
        branchCurrent = ans.slice([nodeNumber + branchNumber, 0], [ans.length - 1, 0]);

        //输出电压
        for (let i = 0; i < observeVoltage.length; i++) {
            const matrix = observeVoltage[i].matrix;
            observeVoltage[i].data.push(matrix.mul(nodeVoltage));
        }
        //输出电流
        for (let i = 0; i < observeCurrent.length; i++) {
            const matrix = observeCurrent[i].matrix;
            observeCurrent[i].data.push(matrix.mul(branchCurrent));
        }
        yield(Math.round(i / Math.round(endTime / stepSize) * 100));
    }
    return ({
        "voltage": observeVoltage,
        "current": observeCurrent
    });
}
*/

//构造函数
function PartsCollection(parts) {
    if(typeof parts === "number") {
        //当输入为一个数字时，将会返回一个普通数组
        const ans = new Array(parts);
        return(ans);
    }
    this.hash = {};
    this.length = 0;
    //输入不为空
    if(parts !== undefined) {
        if(!(parts instanceof Array)) {
            this.push(parts);
        }
        for(let i = 0; i < parts.length; i++) {
            this.push(parts[i]);
        }
    }
    //hash不可枚举且不可修改，length属性不可枚举
    Object.defineProperties(this, {
        hash: {
            configurable: false,
            writable: false,
            enumerable: false
        },
        length: {
            configurable: false,
            enumerable: false
        }
    });
}
//实例方法
PartsCollection.prototype = {
    length: 0,
    constructor: PartsCollection,
    //器件压栈
    push (part) {
        if (!part.elementDOM) {
            return(false);
        }
        if(this.has(part)) {
            const insert = this.hash[part.id],
                insertElem = part,
                top = this.length - 1,
                topElem = this[top];
            this[top] = insertElem;
            this[insert] = topElem;
            this.hash[insertElem] = top;
            this.hash[topElem] = insert;
        } else {
            this[this.length ++] = part;
            this.hash[part.id] = this.length - 1;
        }
        return(this);
    },
    //栈顶器件弹出
    pop () {
        const temp = Array.prototype.pop.call(this);
        if (temp) {
            delete this.hash[temp.id];
            return (temp);
        }
    },
    //根据器件ID返回器件对象
    findPartObj (tempid) {
        if (!this.has(tempid)) return(false);
        return(this[this.hash[tempid]]);
    },
    //删除器件
    deletePart (part) {
        let tempid;
        if (typeof part === "string") {
            tempid = part;
        } else if ((part.elementDOM && part.input) || (part.id.indexOf("line") !== -1)) {
            tempid = part.id;
        } else {
            throw("输入参数必须是字符串或者器件对象");
        }
        if(this.hash[tempid] === undefined) return(false);
        const sub = this.hash[tempid];      //要删除的器件下标
        this.splice(sub, 1);                //删除器件
        //被删除器件之后的全部器件在hash表中的记录全部减1
        for (let i = sub; i < this.length; i++) {
            this.hash[this[i].id] --;
        }
        delete this.hash[tempid];           //删除hash表中的记录
    },
    //删除器件集合
    deleteParts (temp) {
        const parts = (temp instanceof PartsCollection) ? temp : new PartsCollection(temp);
        const ans = new PartsCollection(this);
        this.deleteAll();
        ans.forEach((n) => (parts.has(n) || this.push(n)));
    },
    //集合是否包含该器件
    has (part) {
        let tempid;
        if (typeof  part === "string") {
            tempid = part;
        } else {
            tempid = part.id;
        }
        return(this.hash[tempid] !== undefined);
    },
    //从已有器件中推算新ID
    newId (input) {
        let tempid;
        for (let i = 1; i <= maxNumber; i++) {
            tempid = input + i;
            if (!this.has(tempid)) {
                return (tempid);
            }
        }
        throw("器件数量超出最大限制");
    },
    //器件堆栈清空
    deleteAll () {
        for(let i = 0; i < this.length; i++) {
            this[i].toStatus("normal");
            delete this.hash[this[i].id];
            delete this[i];
        }
        this.length = 0;
    },
    //复制器件堆栈
    selectAll (parts) {
        for (let i = 0; i < parts.length; i++) {
            this.push(parts[i]);
        }
    },
    //枚举器件
    forEach(callback) {
        for(let i = 0; i < this.length; i++) {
            callback(this[i], i, this);
        }
    },
    //分割连通图，返回连通图数组
    connectGraph() {
        const partsArea = [],   //电路连通区域
            partsHash = {};     //电路所有器件Hash查询表
        //连接表初始化
        this.forEach((n) => partsHash[n.id] = true);
        //扫描所有器件，分割电路连通图区域
        this.forEach(function(n) {
            if (partsHash[n.id]) {
                //当前连通区域初始化
                const parts = new PartsCollection(n),
                    ans = new PartsCollection();
                //由初始器件搜索当前连通区域
                while (parts.length) {
                    const item = parts.pop();       //栈顶元素弹出
                    partsHash[item.id] = false;     //当前器件访问标志
                    ans.push(item);                 //当前区域器件入栈
                    item.connect.join(" ").split(" ").forEach(function(n) {
                        const tempPart = partsAll.findPartObj(n.split("-")[0]);
                        //attention:
                        if (tempPart.partType === "网络标号") {

                        } else {
                            if (partsHash[tempPart.id] && !parts.has(tempPart))
                                parts.push(tempPart);
                        }
                    });
                }
                partsArea.push(ans);
            }
        });
        return(partsArea);
    }
};
//PartsCollection继承Array的方法
Object.setPrototypeOf(PartsCollection.prototype, Array.prototype);

//全局器件集合
const partsAll = new PartsCollection(),
    partsNow = new PartsCollection();

export { partsAll, partsNow, PartsCollection };
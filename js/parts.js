"use strict";
//外部模块引用
import { $ } from "./jquery";
import { Point } from "./point";
import { Matrix } from "./matrix";
import { schMap } from "./maphash";
import { styleRule } from "./styleRule";
import { partsAll, partsNow } from "./collection";

//常量定义
const SVG_NS = "http://www.w3.org/2000/svg",
    directionhash = [
        new Matrix([[0,-1]]),
        new Matrix([[-1,0]]),
        new Matrix([[0,1]]),
        new Matrix([[1,0]])
    ];

//器件原型描述
const originalElectronic = {
    /*
     此处是器件的基本属性及外形形态描述——
     id：ID编号前缀
     partType：器件种类
     input：输入的值
     inputTxt：显示输入值的说明
     visionNum：器件参数面板显示参数的数量
     pointInfor：管脚方向以及相对器件中心的位置
     sizeRange：器件为中心外部范围的绝对值，顺序是上左下右
     txtLocate：显示的txt文本相对中心的距离
     criteriaTrend：电流相对于管脚所连接节点的方向
     */
    //电阻
    resistance : {
        readWrite: {  //可读写数据
            id: "R_",
            input: ["10k"]
        },
        readOnly: {  //只读数据
            partType: "resistance",
            inputTxt: ["阻值："],
            parameterUnit: ["Ω"],
            visionNum: 2,
            txtLocate: 14,
            sizeRange: [0.5, 1.5, 0.5, 1.5],
            pointInfor: [[[-40, 0], [40, 0]], [1, 3]],
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M-40,0H-24L-20,-9L-12,9L-4,-9L4,9L12,-9L20,9L24,0H40"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-30", "y":"-13", "width":"60", "height":"26", "class":"focus-part"
                    }
                }
            ],
            introduction : "电阻器"
        }
    },
    //电容
    capacitor : {
        readWrite : {
            id : "C_",
            input : ["100u"]
        },
        readOnly: {  //只读数据
            partType: "capacitor",
            inputTxt: ["电容量："],
            parameterUnit: ["F"],
            visionNum: 2,
            pointInfor: [[[-40, 0], [40, 0]], [1, 3]],
            sizeRange: [0.5, 1, 0.5, 1],
            txtLocate: 22,
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M5,0H40M-40,0H-5M-5,-16V16M5,-16V16"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-30", "y":"-15", "width":"60", "height":"30", "class":"focus-part"
                    }
                }
            ],
            introduction : "电容器"
        }
    },
    //电感
    inductance : {
        readWrite : {
            id : "L_",
            input : ["10u"]
        },
        readOnly : {
            partType: "inductance",
            inputTxt: ["电感量："],
            parameterUnit: ["H"],
            visionNum: 2,
            pointInfor: [[[-40, 0], [40, 0]], [1, 3]],
            sizeRange: [0.5, 1, 0.5, 1],
            txtLocate: 13,
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M-40,0H-24M24,0H40M-24,0Q-18,-12,-12,0M-12,0Q-6,-12,0,0M0,0Q6,-12,12,0M12,0Q18,-12,24,0"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-30", "y":"-10", "width":"60", "height":"15", "class":"focus-part"
                    }
                }
            ],
            introduction : "电感器"
        },
        criteriaTrend:[-1,1]
    },
    //直流电压源
    dc_voltage_source: {
        readWrite : {
            id : "V_",
            input : ["12"]
        },
        readOnly : {
            partType : "dc_voltage_source",
            inputTxt: ["电压值："],
            parameterUnit:["V"],
            visionNum: 2,
            pointInfor: [[[0, -40], [0, 40]], [0, 2]],
            sizeRange : [1,0.5,1,0.5],
            txtLocate: 20,
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M0,-40V-5M0,5V40M-16,-5H16M-10.5,5H10.5M-10,-12H-5M-7.5,-15V-9"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-16", "y":"-30", "width":"32", "height":"60", "class":"focus-part"
                    }
                }
            ],
            introduction : "直流电压源"
        }
    },
    //交流电压源
    ac_voltage_source: {
        readWrite : {
            id : "V_",
            input : ["220","50","0","0"]
        },
        readOnly : {
            partType : "ac_voltage_source",
            inputTxt: ["峰值电压：","频率：","偏置电压：","相位角："],
            parameterUnit:["V","Hz","V","°"],
            visionNum: 3,
            pointInfor: [[[0, -40], [0, 40]], [0, 2]],
            sizeRange : [1,1,1,1],
            txtLocate: 24,
            aspectInfor: [
                {
                    "name": "circle",
                    "attribute": {
                        "cx": "0", "cy": "0", "r": "19", "class":"white-fill"
                    }
                },
                {
                    "name": "path",
                    "attribute": {
                        "d": "M0,-40V-19.5M0,19.5V40M0,-16V-8M-4,-12H4M-4,15H4M-10,0Q-5,-10,0,0M0,0Q5,10,10,0"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-20", "y":"-30", "width":"40", "height":"60", "class":"focus-part"
                    }
                }
            ],
            introduction : "交流电压源"
        }
    },
    //直流电流源
    dc_current_source: {
        readWrite : {
            id : "I_",
            input : ["10"]
        },
        readOnly : {
            partType : "dc_current_source",
            inputTxt: ["电流值："],
            parameterUnit:["A"],
            visionNum: 2,
            pointInfor: [[[0, 40], [0, -40]], [2, 0]],
            sizeRange : [1,1,1,1],
            txtLocate: 20,
            aspectInfor: [
                {
                    "name": "circle",
                    "attribute": {
                        "cx": "0", "cy": "0", "r": "19", "class":"white-fill"
                    }
                },
                {
                    "name": "path",
                    "attribute": {
                        "d": "M0,-40V-20M0,20V40M0,-12V12"
                    }
                },
                {
                    "name": "polygon",
                    "attribute": {
                        "points": "0,-14 -5,-4 0,-8 5,-4", "class" : "fill-whole"//"fill" : "#3B4449", "stroke-width" : "0.5", "stroke-linecap" : "square"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-20", "y":"-30", "width":"40", "height":"60", "class":"focus-part"
                    }
                }
            ],
            introduction : "直流电流源"
        }
    },
    //参考地
    reference_ground: {
        readWrite: {
            id : "GND_"
        },
        readOnly : {
            partType : "reference_ground",
            inputTxt :[],
            visionNum : 0,
            pointInfor: [[[0, -20]], [0]],
            sizeRange : [0.5,0.5,0.5,0.5],
            txtLocate:12,
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M0,-20V0M-12,0H12M-7,5H7M-2,10H2"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-20", "y":"-2", "width":"40", "height":"32", "class":"focus-part"
                    }
                }
            ],
            introduction : "参考地"
        }
    },
    //电压表
    voltage_meter: {
        readWrite : {
            id : "VM_"
        },
        readOnly : {
            partType : "voltage_meter",
            inputTxt: [],
            visionNum: 1,
            pointInfor: [[[0,-40], [0,40]], [0, 2]],
            sizeRange : [1,1,1,1],
            txtLocate: 24,
            aspectInfor: [
                {
                    "name": "circle",
                    "attribute": {
                        "cx": "0", "cy": "0", "r": "19", "class": "white-fill"
                    }
                },
                {
                    "name": "path",
                    "attribute": {
                        "d": "M0,-40V-20M0,20V40M0,-16V-8M-4,-12H4M-4,12H4"
                    }
                },
                {
                    "name": "path",
                    "attribute": {
                        "d": "M-7,-6L0,7L7,-6","class":"part-rotate"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-20", "y":"-30", "width":"40", "height":"60", "class":"focus-part"
                    }
                }
            ],
            introduction : "电压表"
        }
    },
    //电流表
    current_meter: {
        readWrite : {
            id : "IM_"
        },
        readOnly : {
            partType : "current_meter",
            inputTxt: [],
            visionNum: 1,
            pointInfor: [[[-20,0], [20,0]], [1, 3]],
            sizeRange : [0.5,0.5,0.5,0.5],
            txtLocate: 11,
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M-20,0H20"
                    }
                },
                {
                    "name": "polygon",
                    "attribute": {
                        "points": "10,0 4,-4 6,0 4,4", "fill":"#3B4449"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-10", "y":"-8", "width":"20", "height":"16", "class":"focus-part"
                    }
                }
            ],
            introduction : "电流表"
        }
    },
    //二极管
    diode : {
        readWrite: {  //可读写数据
            id: "VD_",
            input : ["1","0.5","5M"]
        },
        readOnly: {  //只读数据
            partType: "diode",
            inputTxt: ["导通电压：", "导通电阻：", "关断电阻："],
            parameterUnit: ["V", "Ω", "Ω"],
            visionNum: 1,
            txtLocate: 18,
            sizeRange: [1, 0.5, 1, 0.5],
            pointInfor: [[[0, -40], [0, 40]], [0, 2]],
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M0,-40V40M-13,-11H13"
                    }
                },
                {
                    "name": "polygon",
                    "attribute": {
                        "points": "0,-11 -13,11 13,11", "class" : "fill-whole"//"fill" : "#3B4449", "stroke-width" : "1"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-13", "y":"-30", "width":"26", "height":"60", "class":"focus-part"
                    }
                }
            ],
            introduction : "二极管"
        }
    },
    //NPN三极管
    transistor_npn : {
        readWrite: {  //可读写数据
            id: "Q_",
            input : ["40", "26", "0.6", "1"]
        },
        readOnly: {  //只读数据
            partType: "transistor_npn",
            inputTxt: ["电流放大倍数：", "B极电阻：", "BE饱和压降：", "CE饱和压降："],
            parameterUnit: ["", "Ω", "V", "V"],
            visionNum: 1,
            txtLocate: 25,
            sizeRange: [1, 0.5, 1, 0.5],
            pointInfor: [[[-20, 0], [20, -40], [20, 40]], [1, 0, 2]],
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M-20,0H0M0,-25V25M20,-40V-28L0,-12M0,12L20,28V40"
                    }
                },
                {
                    "name": "polygon",
                    "attribute": {
                        "points" : "0,0 -11,-6 -7,0 -11,6", "class" : "fill-whole",
                        "transform" : "translate(18, 26.4) rotate(38.7)"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-10", "y":"-30", "width":"30", "height":"60", "class":"focus-part"
                    }
                }
            ],
            introduction: "NPN型三极管"
        }
    },
    //运放
    operational_amplifier : {
        readWrite: {  //可读写数据
            id: "OP_",
            input : ["120","80M","60"]  //["120","1G","80M","60"]
        },
        readOnly: {  //只读数据
            partType: "operational_amplifier",
            inputTxt: ["开环增益：", "输入电阻：","输出电阻："], //["开环增益：", "带宽范围：", "输入电阻：","输出电阻："],
            parameterUnit: ["dB", "Ω", "Ω"],  //["dB", "Hz", "Ω", "Ω"],
            visionNum: 1,
            txtLocate: 0,
            sizeRange: [1, 1, 1, 1],
            pointInfor: [[[-40, -20], [-40, 20], [40, 0]], [1, 1, 3]],
            aspectInfor: [
                {
                    "name": "path",
                    "attribute": {
                        "d": "M-25,-35V35L25,0Z", "class" : "white-fill"
                    }
                },
                {
                    "name": "path",
                    "attribute": {
                        "d" : "M-40,-20H-25M-40,20H-25M25,0H40"
                    }
                },
                {
                    "name":"path",
                    "attribute": {
                        "d": "M-22,-20H-16M-22,20H-16M-19,17V23", "stroke-width" : "1"
                    }
                },
                {
                    "name":"rect",
                    "attribute": {
                        "x": "-30", "y":"-35", "width":"60", "height":"70", "class":"focus-part"
                    }
                }

            ],
            introduction: "运算放大器"
        }
    }
},
    schematic = $("#area-of-parts");

//器件类
function PartClass(data) {
    let type, textPos = [10, -10];
    if(typeof data === "string") {
        type = data;
    } else if(typeof data === "object") {
        type = data.partType;
    }
    this.extend(Object.clone(originalElectronic[type].readWrite));
    Object.setPrototypeOf(this, originalElectronic[type].readOnly);
    this.id = partsAll.newId(this.id);
    this.rotate = new Matrix([[1, 0], [0, 1]]); //旋转矩阵
    this.position = new Point([1000, 1000]);    //器件位置
    this.current = {};                          //临时数据
    this.connect = new Array(this.pointInfor[0].length).fill(false);
    this.circle = [];

    for(let i in data) {
        if(data.hasOwnProperty(i)) {
            switch (i) {
                case "partType":
                    continue;
                case "rotate":
                    this.rotate = new Matrix(data[i]);
                    break;
                case "text":
                    textPos = Array.clone(data[i]);
                    break;
                case "position":
                    this[i] = new Point(data[i]);
                    break;
                default:
                    if(data[i] instanceof Array) {
                        this[i] = Array.clone(data[i]);
                    } else {
                        this[i] = data[i];
                    }
            }
        }
    }
    if(!this.input) { this.input = []; };
    this.elementDOM = this.createPart(); //创建新器件
    this.setPosition();

    for(let i = 0; i < this.connect.length; i++) {
        this.circle[i] = $("#" + this.id + "-" + i, this.elementDOM);
    }
    //显示文字,默认文字放在器件的右上方
    this.textVisition(textPos);
    partsAll.push(this);
}
PartClass.prototype = {
    constructor: PartClass,
    length: 0,
    //器件方法
    //计算器件当前引脚坐标及方向
    pointRotate() {
        //console.time("pointRotate");
        const position = [], vector = [];
        for (let i = 0; i < this.pointInfor[0].length; i++) {
            //向量旋转
            let temp = this.rotate.multo(directionhash[this.pointInfor[1][i]])[0];
            if ((temp[0] + temp[1]) < 0) {
                if (temp[0] < 0) vector[i] = 1;
                else vector[i] = 0;
            } else {
                if (temp[0] > 0) vector[i] = 3;
                else vector[i] = 2;
            }
            //器件引脚坐标旋转
            position[i] = this.rotate.multo([this.pointInfor[0][i]])[0];
        }
        //console.timeEnd("pointRotate");
        return([position,vector]);
    },
    //器件的范围数组旋转
    sizeRangeRotate() {
        let ans = [];
        let tempRange = [
            [0, -this.sizeRange[0]],    //上
            [-this.sizeRange[1], 0],    //左
            [0, this.sizeRange[0]],     //下
            [this.sizeRange[1], 0]];    //右

        for (let i = 0; i < 4; i++) {
            tempRange[i] = this.rotate.multo([tempRange[i]])[0];
            if (tempRange[i][0] !== 0) {
                if (tempRange[i][0] > 0) ans[3] = tempRange[i][0];
                else ans[1] = -tempRange[i][0];
            } else {
                if (tempRange[i][1] > 0) ans[2] = tempRange[i][1];
                else ans[0] = -tempRange[i][1];
            }
        }
        return (ans);
    },
    //在图中标记器件
    markSign() {
        const position = [this.position[0] / 20, this.position[1] / 20],    //器件坐标
            range = this.sizeRangeRotate().map((n) => parseInt(n)),         //器件四周范围
            pointInfor = this.pointRotate()[0];                             //管脚的相对坐标
        //格式验证
        if(position[0] !== parseInt(position[0]) || position[1] !== parseInt(position[1])) {
            throw "设置标记时，器件必须对齐图纸";
        }
        schMap.makePartSign(this.id, position, pointInfor, range);
    },
    //删除器件标记
    deleteSign() {
        const position = [this.position[0] / 20, this.position[1] / 20],    //器件坐标
            range = this.sizeRangeRotate().map((n) => parseInt(n)),         //器件四周范围
            pointInfor = this.pointRotate()[0];                             //管脚的相对坐标
        schMap.deletePartSign(position, pointInfor, range);
    },
    //器件设置位置
    setPosition() {
        this.elementDOM.attr("transform",
            "matrix(" + this.rotate.join(",") + "," + this.position.join(",") + ")");
    },
    //显示器件文字
    textVisition(coordinates) {  //器件说明文字显示
        if (!this.visionNum) return (false);
        if (coordinates === undefined) {
            coordinates = [this.txtLocate, -this.txtLocate];
        }
        const elemtxt = $("text", this.elementDOM);
        const elemtspan = $("tspan", elemtxt);
        const tempPointInfor = this.pointRotate();
        const signRotate = $(".part-rotate", this.elementDOM);

        //器件文字旋转逆矩阵
        const texttransfor = this.rotate.inverse();
        elemtxt.attr("transform", "matrix(" + texttransfor.join(",") + ",0,0)");
        if (signRotate.length) {
            signRotate.attr("transform", "matrix(" + texttransfor.join(",") + ",0,0)");
        }

        //判断文字显示的方位,最后posion的值0,1,2,3分别对应上左下右。
        for (let i = 0; i < tempPointInfor[1].length; i++) {
            if ((tempPointInfor[1][i] === 0) && (coordinates[1] < 0)) coordinates[1] = 0;
            else if ((tempPointInfor[1][i] === 1) && (coordinates[0] < 0)) coordinates[0] = 0;
            else if ((tempPointInfor[1][i] === 2) && (coordinates[1] > 0)) coordinates[1] = 0;
            else if ((tempPointInfor[1][i] === 3) && (coordinates[0] > 0)) coordinates[0] = 0;
        }

        //取数字大的那个距离为标准
        if (Math.abs(coordinates[0]) > Math.abs(coordinates[1])) coordinates[1] = 0;
        else coordinates[0] = 0;

        //外形大小
        const rect = $(".focus-part", this.elementDOM).attr(["width","height"]).map((n) => Number(n));
        let transform = this.elementDOM.attr("transform");
        if (!transform) {
            transform = new Matrix([[1,0],[0,1]]);
        } else {
            let count = 0;
            for(let i = 0; i < transform.length; i++) {
                if(transform[i] === ",") {
                    count ++;
                }
                if(count === 4) {
                    const temp = transform.substring(7, i).split(",").map((n) => parseInt(n));
                    transform = new Matrix([[temp[0], temp[1]], [temp[2], temp[3]]]);
                    break;
                }
            }
        }
        const size = transform.multo([rect])[0].map((n) => parseInt(Math.abs(n / 2))),
            bias = 4;

        if (!coordinates[0]) {
            if (coordinates[1] > 0) {  //下
                const idText = $(elemtspan[0]),
                    startY = size[1] + idText.height() - bias,
                    startX = -0.5 * (idText.width() + $(elemtspan[1]).width());

                elemtxt.attr({
                    "x": startX,
                    "y": startY
                });
                for (let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]);
                    elem.attr({
                        "dx": -0.5 * elem.width() + startX,
                        "dy": elem.height()
                    });
                }
            } else {  //上
                const idText = $(elemtspan[0]),
                    startX = -0.5 * (idText.width() + $(elemtspan[1]).width());
                let startY = 0;

                for(let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]);
                    const height = elem.height();
                    elem.attr({
                        "dx": -0.5 * elem.width() + startX,
                        "dy": height
                    });
                    startY -= height;
                }
                startY -= (size[1] + bias);

                elemtxt.attr({
                    "x": startX,
                    "y": startY
                });
            }
        } else {
            if (coordinates[0] > 0) {  //右
                const startX = size[0] + bias,
                    idText = $(elemtspan[0]);

                let startY = 0,
                    biasY = - idText.width();

                for(let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]);
                    const height = elem.height();
                    elem.attr({
                        "dx": biasY - $(elemtspan[i - 1]).width(),
                        "dy": height
                    });
                    startY -= height;
                    biasY = 0;
                }
                startY = 0.5 * (startY + idText.height()) - bias;

                elemtxt.attr({
                    "x": startX,
                    "y": startY
                });
            } else {  //左
                const idText = $(elemtspan[0]),
                    startX = - (size[0] + bias + idText.width() + $(elemtspan[1]).width());
                let startY = 0;

                for(let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]);
                    const height = elem.height();
                    elem.attr({
                        "dx": - $(elemtspan[i]).width(),
                        "dy": height
                    });
                    startY -= height;
                }

                startY = 0.5 * (startY + idText.height()) - bias;

                elemtxt.attr({
                    "x": startX,
                    "y": startY
                });
            }
        }

        /*
         //取数字大的那个距离为标准
         if (Math.abs(coordinates[0]) > Math.abs(coordinates[1])) coordinates[1] = 0;
         else coordinates[0] = 0;
         let normalpos = this.txtLocate;
         if (!coordinates[0]) {
         if (coordinates[1] > 0) {  //下
         textposy = normalpos + 10;
         textposx = -0.5 * (elemtspan[0].textContent.length * 9 + elemtspan[1].textContent.length * 5);
         lastpos = textposx;
         elemtxt.setAttribute("x", textposx.toString());
         elemtxt.setAttribute("y", textposy.toString());
         for (let i = 2; i < elemtspan.length; i++) {
         textposx = -4.35 * elemtspan[i].textContent.length + lastpos;
         lastpos = -4.35 * elemtspan[i].textContent.length;
         elemtspan[i].setAttribute("dx", textposx.toString());
         }
         } else {  //上
         textposy = -normalpos - 16 * (elemtspan.length - 2);
         textposx = -0.5 * (elemtspan[0].textContent.length * 9 + elemtspan[1].textContent.length * 5);
         lastpos = textposx;
         elemtxt.setAttribute("x", textposx.toString());
         elemtxt.setAttribute("y", textposy.toString());
         for (let i = 2; i < elemtspan.length; i++) {
         textposx = -4.35 * elemtspan[i].textContent.length + lastpos;
         lastpos = -4.35 * elemtspan[i].textContent.length;
         elemtspan[i].setAttribute("dx", textposx.toString());
         }
         }
         } else {
         if (coordinates[0] > 0) {  //右
         textposy -= 8 * (elemtspan.length - 3);
         textposx = -elemtspan[0].textContent.length * 9 - elemtspan[1].textContent.length * 7;
         elemtxt.setAttribute("x", normalpos.toString());
         elemtxt.setAttribute("y", textposy.toString());
         for (let i = 2; i < elemtspan.length; i++) {
         elemtspan[i].setAttribute("dx", textposx.toString());
         textposx = -elemtspan[i].textContent.length * 9;
         }
         } else {  //左
         textposx = -1 * (normalpos + elemtspan[0].textContent.length * 9 + elemtspan[1].textContent.length * 5);
         textposy -= 8 * (elemtspan.length - 3);
         elemtxt.setAttribute("x", textposx.toString());
         elemtxt.setAttribute("y", textposy.toString());
         for (let i = 2; i < elemtspan.length; i++) {
         textposx = -elemtspan[i].textContent.length * 9;
         elemtspan[i].setAttribute("dx", textposx.toString());
         }
         }
         }
         */
    },
    //在图纸中创建器件SVG
    createPart() {
        let group = $("<g>", SVG_NS, {
            class: "editor-parts",
            id: this.id,
            opacity: "0.4"
        });
        const nodepoint = {     //引脚节点外形
            circle: {},
            rect: {
                x: "-9", y: "-9", width: "18", height: "18", "class": "rect-point"
            }
        };
        //创建器件本体
        for(let i = 0; i < this.aspectInfor.length; i++) {
            const elementName = this.aspectInfor[i].name;
            const elementAttribute = this.aspectInfor[i].attribute;
            let tempData = $("<" + elementName + ">", SVG_NS);
            for(let j in elementAttribute) if(elementAttribute.hasOwnProperty(j)) {
                tempData.attr(j, elementAttribute[j]);
            }
            group.append(tempData);
        }
        //创建器件引脚节点
        for (let i = 0; i < this.pointInfor[0].length; i++) {
            let coor = this.pointInfor[0][i];
            let tempDate = $("<g>", SVG_NS, {
                "id": this.id + "-" + i,
                "transform": "translate(" + coor[0] + "," + coor[1] + ")",
                "class": "part-point point-open"
            });
            for (let j in nodepoint) if (nodepoint.hasOwnProperty(j)) {
                tempDate.append($("<" + j + ">", SVG_NS, nodepoint[j]));
            }
            group.append(tempDate);
        }
        //创建器件显示文本
        //attention:网络标号的时候，text这里需要更改方式
        if (this.visionNum) {
            //创建txt下属ID显示
            const propertyVision = [];
            //把所有的 u 替换成 μ
            for (let i = 0; i < this.visionNum - 1; i++) {
                this.input[i] = this.input[i].replace("u","μ");
                propertyVision.push(this.input[i] + this.parameterUnit[i]);
            }
            const textMain = this.id.split("_");
            const tempDate = $("<text>", SVG_NS, { x: "0", y: "0", "class": "features-text" });
            tempDate.append($("<tspan>", SVG_NS).text(textMain[0]));
            tempDate.append($("<tspan>", SVG_NS).text(textMain[1]));
            //创建txt下属器件属性
            for (let i = 0; i < propertyVision.length; i++) {
                tempDate.append($("<tspan>", SVG_NS, {
                    dx: "0",
                    dy: "16"
                }).text(propertyVision[i]));
            }
            group.append(tempDate);
        }
        schematic.append(group);
        return (group);
    },
    //输出true表示此处被占用，false表示此处为空
    sheetCover(position, map) {
        const tempRange = this.sizeRangeRotate();
        const tempPointInfor = this.pointRotate();
        const tempPosition = [position[0] / 20, position[1] / 20];
        //器件管脚处没有覆盖别的器件
        for (let i = 0; i < tempPointInfor[0].length; i++) {
            if (map.getSingleValueBySmalle([tempPosition[0] + tempPointInfor[0][i][0] / 20,
                    tempPosition[1] + tempPointInfor[0][i][1] / 20]))
                return (true);
        }
        //范围四舍五入
        let RangeNow = [], coverPart = null, coverRange = [];
        for (let i = 0; i < 4; i++) RangeNow[i] = Math.round(tempRange[i]);
        let tempx = tempPosition[0], tempy = tempPosition[1];
        for (let i = tempx - RangeNow[1]; i <= tempx + RangeNow[3]; i++)
            for (let j = tempy - RangeNow[0]; j <= tempy + RangeNow[2]; j++) {
                const tempStatus = map.getSingleValueBySmalle([i, j]);
                if (tempStatus) {
                    if (tempStatus.form === "line") return (true);
                    else if (tempStatus.form === "part") {
                        coverPart = partsAll.findPartObj(tempStatus.id);
                        //coverPart = partsAll.findPartObj(SchematicMap[i][j].id);
                    } else if (tempStatus.form === "part-point") {
                        coverPart = partsAll.findPartObj(tempStatus.id.substring(0, tempStatus.id.search("-")));
                        //coverPart = partsAll.findPartObj(SchematicMap[i][j].id.substring(0, SchematicMap[i][j].id.search("-")));
                    }
                    coverRange = coverPart.sizeRangeRotate();
                    let Flag_x = true, Flag_y = true;
                    for (let k = 0; k < 4; k++) coverRange[k] = Math.round(coverPart.sizeRange[k]);
                    let distance = [tempPosition[0] - coverPart.position[0] / 20,
                        tempPosition[1] - coverPart.position[1] / 20];
                    //X轴
                    if (distance[0] === 0) Flag_x = false;
                    else if ((distance[0] < 0) &&
                        (RangeNow[3] + coverRange[1] > -distance[0])) Flag_x = false;
                    else if (RangeNow[1] + coverRange[3] > distance[0]) Flag_x = false;
                    //Y轴
                    if (distance[1] === 0) Flag_y = false;
                    else if ((distance[1] < 0) &&
                        (RangeNow[2] + coverRange[0] > -distance[1])) Flag_y = false;
                    else if (RangeNow[0] + coverRange[2] > distance[1]) Flag_y = false;
                    if (!Flag_x && !Flag_y) return (true);
                }
            }
        return (false);
    },
    //引脚被占用，禁止缩放
    connectPoint(pointMark, lineId) {
        this.connect[pointMark] = lineId;           //器件端点指向导线ID
        this.circle[pointMark].attr("class", "part-point point-close");
    },
    //引脚悬空，允许缩放
    noConnectPoint(pointMark) {
        this.connect[pointMark] = false;
        this.circle[pointMark].attr("class", "part-point point-open");
    },
    //取消引脚放大
    shrinkPoint(pointMark) {
        $("circle", this.circle[pointMark]).attr("style", "");
    },
    //引脚放大
    enlargePoint(pointMark) {
        $("circle", this.circle[pointMark]).attr("style", "r:5");
    },
    //选中器件
    focusOnly() {
        this.toStatus("focus");
        partsNow.push(this);
    },
    //改变状态
    toStatus(status) {
        if(status === "focus") {
            this.elementDOM.addClass("focus");
        } else if(status === "normal") {
            this.elementDOM.removeClass("focus");
        }
    },
    //显示器件参数菜单
    viewParameter(zoom, SVG) {
        //确定DOM部分
        const parameterDiv = $("#parameter-menu"),
            parameterBottom = $(".parameter-bottom-line", parameterDiv);

        let inputGroup = $(".st-menu-input-group", parameterDiv);

        //移除全部group
        inputGroup.remove();
        //添加group
        for(let i = 0; i < this.inputTxt.length + 1; i++) {
            const inputGroup = $("<div>", { class: "st-menu-input-group" });
            inputGroup.append($("<span>", { class: "st-menu-input-introduce" }));
            inputGroup.append($("<input>", { required: "" }));
            inputGroup.append($("<span>", { class: "st-menu-input-highlight" }));
            inputGroup.append($("<span>", { class: "st-menu-input-bar" }));
            inputGroup.append($("<span>", { class: "st-menu-input-unit" }));
            parameterDiv.preappend(inputGroup, parameterBottom);
        }
        //添加之后重新匹配DOM
        inputGroup = $(".st-menu-input-group", parameterDiv);
        //器件属性与说明文字的最大宽度
        let introWidth = 3, unitWidth = 0;
        for (let i = 0; i < inputGroup.length; i++) {
            const intro = i ? this.inputTxt[i - 1] : "编号：",
                input = i ? this.input[i - 1] : this.id,
                unit = i ? this.parameterUnit[i - 1] : "";
            //把输入的u替换成μ
            if(this.input) {
                this.input[i] = (this.input[i]) ? this.input[i].replace("μ", "u") : false;
            }
            //添加器件属性
            const group = $(inputGroup[i]),
                groupIntro = group.childrens(0),
                groupUnit = group.childrens(4),
                groupInput =  group.childrens(1);

            group.attr("id", "parameter-" + i);
            groupIntro.text(intro);
            groupUnit.text(unit);
            groupInput.attr("value", input);
            //求属性说明文字的最大宽度
            introWidth = groupIntro.width() > introWidth ? groupIntro.width() : introWidth;
            unitWidth = groupUnit.width() > unitWidth ? groupUnit.width() : unitWidth;
        }
        //inputDOM比器件的input数组多了一个器件ID
        this.input.length --;
        //DOM位置调整
        inputGroup.childrens(4).attr("style", "left:" + (introWidth + 88) + "px");
        inputGroup.childrens("input, span.st-menu-input-highlight, span.st-menu-input-bar").attr("style", "left:" + introWidth + "px");

        //显示定位
        //输入框的宽度最小175
        let boxWidth = (110 + introWidth + unitWidth) < 175 ? 175: (110 + introWidth + unitWidth),
            boxLeftBegin = - boxWidth / 2,                 //输入框宽度的一半
            boxLeftEnd = boxLeftBegin,
            boxTopEnd = - parameterDiv.height() - 20,       //输入框高度加上倒三角
            boxTopBegin = boxTopEnd / 2 + 20,

            sharpposx = this.position[0] * zoom + SVG[0],     //器件中心点在屏幕中实际的位置
            sharpposy = this.position[1] * zoom + SVG[1],
            triangledown = $("#parameter-menu-triangle-down");  //参数框的小倒三角

        //倒三角默认在对话框中间
        triangledown.css("left", "50%");
        //参数框最上端超过屏幕
        if (sharpposy + boxTopEnd < 0) {
            triangledown.addClass("triangle-up");
            boxTopEnd = 20;
        } else {
            triangledown.attr("class", "");
        }
        //参数框最左端超过屏幕
        if (sharpposx + boxLeftBegin < 0) {
            boxLeftEnd = 10 - sharpposx;
            triangledown.css("left", (sharpposx - 10) + "px");
        }
        //参数框右端超过屏幕
        if (sharpposx + boxWidth / 2 > window.outerWidth) {
            boxLeftEnd = $(window).width() - 10 - boxWidth - sharpposx;
            triangledown.css("left", (- boxLeftEnd) + "px");
        }

        //参数框的打开关闭动画
        const keyframeOpen = new styleRule("parameter-open"),
            keyframeEnd  = new styleRule("parameter-close");

        keyframeOpen.setRule("0%", {
            opacity: 0,
            transform: "scale(0,0)",
            left: sharpposx + boxLeftBegin + "px",
            top: sharpposy + boxTopBegin + "px"
        });
        keyframeOpen.setRule("100%", {
            opacity: 1,
            transform: "scale(1,1)",
            left: sharpposx + boxLeftEnd + "px",
            top: sharpposy + boxTopEnd + "px"
        });
        keyframeEnd.setRule("0%", {
            opacity: 1,
            transform: "scale(1,1)",
            left: sharpposx + boxLeftEnd + "px",
            top: sharpposy + boxTopEnd + "px"
        });
        keyframeEnd.setRule("100%", {
            opacity: 0,
            transform: "scale(0,0)",
            left: sharpposx + boxLeftBegin + "px",
            top: sharpposy + boxTopBegin + "px"
        });
        parameterDiv.css({
            width: boxWidth + "px",
            left: (sharpposx + boxLeftEnd) + "px",
            top: (sharpposy + boxTopEnd) + "px"
        });
        parameterDiv.addClass("parameter-open");
        parameterDiv.removeClass("parameter-close");
        $("body").addClass("open-gray");
    },
    //输入属性之后显示
    inputVision() {
        const parameter = $("#parameter-menu"),
            idMatch = /[A-Za-z]+_[0-9A-Za-z]+/i,
            dataMatch = /\d+(.\d+)?[GMkmunp]?/;

        //取消全部错误标志
        parameter.attr("class", "parameter-open");
        let error = true;
        //判断数据格式是否正确
        const inputID = $("#parameter-0 input", parameter).prop("value");
        //匹配器件代号
        if(!inputID.match(idMatch)) {
            parameter.addClass("parameter-error-0");
            error = false;
        }
        for (let i = 0; i < this.inputTxt.length; i++){
            const inputData = $("#parameter-" + (i + 1) + " input", parameter).prop("value");
            const temp_input_match = inputData.match(dataMatch);
            if(!temp_input_match || (inputData !== temp_input_match[0])){
                parameter.addClass("parameter-error-" + (i + 1));
                error = false;
            }
        }
        if(!error) return(false);
        //变更当前器件的ID
        this.exchangeID(inputID);
        //改变输入参数
        const temptspan = $("tspan", this.elementDOM);
        for (let i = 0; i < this.inputTxt.length; i++) {
            this.input[i] = $("#parameter-" + (i + 1) + " input", parameter).prop("value");
            this.input[i] = this.input[i].replace("u", "μ");
            if(i < this.visionNum - 1) {
                temptspan[i + 2].textContent = this.input[i] + this.parameterUnit[i];
            }
        }
        //修正属性的显示位置
        const sharptxt = $("text", this.elementDOM);
        this.textVisition([parseInt(sharptxt.attr("x")), parseInt(sharptxt.attr("y"))]);
        return(true);
    },
    //属性文本移动
    moveText(event) {
        const move = this.current;
        move.position[0] += (event.pageX - move.pageL[0]) / move.zoom;
        move.position[1] += (event.pageY - move.pageL[1]) / move.zoom;

        move.pageL[0] = event.pageX;
        move.pageL[1] = event.pageY;

        move.text.attr({
            "x": move.position[0],
            "y": move.position[1]
        });
        move.isMove = true;
    },
    //器件移动
    moveSelf(event) {
        //常量提取
        const mouse = this.current.mouse(event),
            bias = this.current.mouseBias(event),
            lines = this.current.lines = this.current.lines || [];

        //首次运行且不是新建器件，准备运行参数
        if (!this.current.isMove && !this.current.isNew) {
            this.deleteSign(this.current.map);
            this.current.lastPosition = Array.clone(this.position);
            const tempPart = this.pointRotate(),
                point = tempPart[0],
                trend = tempPart[1];

            for(let i = 0; i < this.connect.length; i++) {
                if(!this.connect[i]) {
                    continue;
                }
                lines.push(partsAll.findPartObj(this.connect[i]));
                lines[lines.length - 1].preMoveLine(this.position.add(point[i]));
                lines[lines.length - 1].current.initTrend = directionhash[trend[i]][0];
            }
            MapTest.whole(partsAll,schMap);
            MapTest.clear();
        }
        this.current.isMove = true;
        //器件移动
        if (this.current.isNew) {
            //新建器件直接将器件对准鼠标
            this.position = mouse;
        } else {
            //普通的器件移动，将鼠标偏移量累加到器件坐标
            this.position = this.position.add(bias);
        }
        this.setPosition();
        //没有临时导线，直接退出
        if (!(this.current && this.current.lines && this.current.lines.length)) {
            return (true);
        }

        //导线变形部分
        for(let i = 0; i < lines.length; i++) {
            const line = lines[i];
            line.current.startNode = line.current.startNode.add(bias);
            line.moveToLine();
        }
    },
    //旋转器件
    rotateSelf(sub) {
        const transfor = new Matrix(rotateMatrix[sub]);
        const elemtxt = this.elementDOM.getElementsByTagName("text")[0];
        //删除旧器件标记
        if(!flagBit.totalMarks()) this.deleteSign(this.position);
        this.rotate = this.rotate.mul(transfor);            //器件旋转
        //重新标记
        if(!flagBit.totalMarks()) this.markSign();
        //器件显示旋转
        this.elementDOM.setAttribute("transform",
            "matrix(" + this.rotate.join(",") + "," + this.position.join(",") + ")");
        if(this.visionNum) {
            //文字初始位置坐标
            const  txtLocate = transfor.mul([[Number(elemtxt.getAttribute("x")),Number(elemtxt.getAttribute("y"))]],"left")[0];
            //改变器件显示文字
            this.textVisition(txtLocate);
        }

        //attention：要是器件上连接了导线，下面就是要导线随着器件的旋转而改变
        const point = this.pointRotate();
        const lineEnd = [];
        const lines = this.connect.map((n) => partsAll.findPartObj(n));
        //检测导线是否需要变化，如果需要变化，那么就删除导线标记
        for(let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line) {
                const nodeEnd = [
                    this.position[0] + point[0][i][0],
                    this.position[1] + point[0][i][1]
                ];
                //当前管脚坐标与原来导线的起点/终点没有变化，那么导线不改变
                if (((line.connect[0] === this.id + "-" + i) && (nodeEnd.isEqual(line.way[0]))) ||
                    ((line.connect[1] === this.id + "-" + i) && (nodeEnd.isEqual(line.way[line.way.length - 1])))) {
                    lineEnd.push(false);
                    continue;
                } else {
                    lineEnd.push(nodeEnd);
                }
                //拔起导线
                line.deleteSign();
            }
        }
        for(let i = 0; i < lines.length; i++) {
            const line = lines[i];
            //导线存在，且确实需要重新搜索路径
            if (line && lineEnd[i]) {
                const nodeEnd = lineEnd[i];
                //如果导线连接到当前器件的点是起点，那么导线翻转
                if(line.connect[0] === this.id + "-" + i) line.reversal();
                //导线的起点初始方向
                let initTrend;
                const tempStatus = SchematicMap.getSingleValueByOrigin(line.way[0]);
                if(tempStatus && tempStatus.form === "part-point") {    //导线出线方向为起点器件的引脚方向
                    const tempArr = tempStatus.id.split("-");
                    const temppart = partsAll.findPartObj(tempArr[0]);
                    const tempmark = parseInt(tempArr[1]);
                    const tempPointInfor = temppart.pointRotate();
                    initTrend = directionhash[tempPointInfor[1][tempmark]];
                } else {
                    initTrend = Math.vector.init(line.way[0],line.way[1]);
                }
                //计算路径
                line.way.cloneWay(schematic.AstartSearch(
                    line.way[0], nodeEnd, initTrend, 1
                ));
                line.way.checkWayRepeat();
                line.way.checkWayExcess(initTrend, 2);
                line.render();
                line.markSign();
            }
        }
    },
    //移动之后放下器件
    putDownSelf() {
        if(!this.current.isMove) return(false);
        //相关常量
        const positionLast = this.current.lastPosition;
        //当前的位置
        let positionNew = this.position.round();

        if(positionLast && !positionNew.isEqual(positionLast)) {
            positionNew = schMap.nodeRound(positionNew, this.position, this.sheetCover.bind(this));
        }
        this.position = positionNew;
        this.setPosition();
        this.markSign();

        //导线部分
        if(this.current && this.current.lines && this.current.lines.length) {
            this.current.lines.forEach(function (line) {
                line.way.standardize();     //路径标准化
                line.setCollectCircle(1);   //连接的节点处理
                line.render();              //导线重新渲染
                line.markSign();         //在图中标记导线标志位
                partsNow.push(line);        //attention：这一步存疑，现在只是为了“清除所有状态”函数进行器件染色
            });
        }

        //清空临时变量
        this.current = {};
    },
    //删除器件
    deleteSelf() {
        //删除与之相连的导线
        for(let i = 0; i < this.connect.length; i++) {
            if (this.connect[i]) {
                const line = partsAll.findPartObj(this.connect[i]);
                line.deleteSelf();
            }
        }
        this.deleteSign();
        const svg = document.getElementById("area-of-parts");
        svg.removeChild(this.elementDOM);
        partsAll.deletePart(this);
    },
    //按照标准格式输出
    toSimpleData() {
        let ans = "{ partType: \"" + this.partType + "\", id: \"" + this.id +
            "\", position: [" + this.position.join(",") + "], rotate: [[" +
            this.rotate[0].join(",") + "],[" + this.rotate[1].join(",") + "]]";
        if(this.visionNum) {
            const text = this.elementDOM.getElementsByTagName("text")[0];
            ans += ", text: [" + text.getAttribute("x") + "," + text.getAttribute("y") + "]";
        }
        if (this.input) {
            ans += ", input: [\"" + this.input.join("\",\"") + "\"]},";
        } else {
            ans += "},";
        }
        return (ans);
    },
    //变更当前器件ID
    exchangeID(label) {
        if(label === this.id) return(false);
        const last = this.id;
        //删除旧器件
        partsAll.deletePart(this);
        partsNow.pop(this);
        const temptspan = $("tspan", this.elementDOM);
        const points = $(".part-point", this.elementDOM);
        //变更ID及显示
        this.id = label;
        this.elementDOM.attr("id",this.id);
        temptspan.get(0).text(this.id.slice(0, this.id.search("_")));
        temptspan.get(1).text(this.id.slice(this.id.search("_") + 1));
        //修正与之相连的器件连接表中的ID
        for(let i = 0; i < this.connect.length; i++) {
            const point = points.get(i);
            const pointLabel = point.attr("id").split("-");
            pointLabel[0] = label;
            point.attr("id", pointLabel.join("-"));
            if(this.connect[i]) {
                const tempPart = partsAll.findPartObj(this.connect[i]);
                for (let j = 0; j < tempPart.connect.length; j++) {
                    if (tempPart.connect[j] = last + "-" + i) {
                        tempPart.connect[j] = label + "-" + i;
                        break;
                    }
                }
            }
        }
        //新器件入栈
        partsAll.push(this);
        partsNow.push(this);
    }
};

//冻结器件原型函数的只读属性
for(let i in originalElectronic) {
    if (originalElectronic.hasOwnProperty(i)) {
        Object.setPrototypeOf(originalElectronic[i].readOnly, PartClass.prototype);
        Object.freezeAll(originalElectronic[i].readOnly);
    }
}
//外观和说明原型
const partsinfo = {
    shape : {},
    intro: {}
};
for(let i in originalElectronic) {
    if (originalElectronic.hasOwnProperty(i)) {
        partsinfo.shape[i] = originalElectronic[i].readOnly.aspectInfor;
        partsinfo.intro[i] = originalElectronic[i].readOnly.introduction;
    }
}
//模块对外的接口
export { PartClass, partsinfo };
"use strict";
//外部模块引用
import { $ } from "./jquery";
import { Point } from "./point";
import { Matrix } from "./matrix";
import { LineClass } from "./lines";
import { schMap } from "./maphash";
import { styleRule } from "./styleRule";
import { partsAll, partsNow } from "./collection";

//常量定义
const SVG_NS = "http://www.w3.org/2000/svg",
    schematic = $("#area-of-parts"),
    rotateMatrix = [
        new Matrix([[0, 1], [-1, 0]]),  //顺时针
        new Matrix([[0, -1], [1, 0]]),  //逆时针
        new Matrix([[1, 0], [0, -1]]),  //沿X轴镜像
        new Matrix([[-1, 0], [0, 1]])   //沿Y轴镜像
    ];

//原来的sizeRange顺序是上左下右
//器件原型描述
const originalElectronic = {
    /*
     * 此处是器件的基本属性及外形形态描述——
     *   id             ID编号前缀
     *   partType       器件种类
     *   input          输入的值
     *   inputTxt       显示输入值的说明
     *   visionNum      器件参数面板显示参数的数量
     *   pointInfor     管脚方向以及相对器件中心的位置
     *   padding        器件内边距
     *   margin         器件外边距
     *   txtLocate      显示的txt文本相对中心的距离
     *   criteriaTrend  电流相对于管脚所连接节点的方向
     *
     */

    //电阻
    resistance : {
        readWrite: {  //可读写数据
            id: "R_",
            input: ["10k"]
        },
        readOnly: {
            partType: "resistance",
            inputTxt: ["阻值："],
            parameterUnit: ["Ω"],
            visionNum: 2,
            txtLocate: 14,
            //器件初始为横向
            padding: [0, 1],
            margin: 1,
            pointInfor: [
                {
                    position: [-40, 0],
                    direction: [-1, 0]
                },
                {
                    position: [40, 0],
                    direction: [1, 0]
                }
            ],
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
            pointInfor: [
                {
                    position: [-40, 0],
                    direction: [-1, 0]
                },
                {
                    position: [40, 0],
                    direction: [1, 0]
                }
            ],
            //器件初始为横向
            padding: [0, 1],
            margin: 1,
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
            pointInfor: [
                {
                    position: [-40, 0],
                    direction: [-1, 0]
                },
                {
                    position: [40, 0],
                    direction: [1, 0]
                }
            ],
            //器件初始为横向
            padding: [0, 1],
            margin: 1,
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
        }
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
            pointInfor: [
                {
                    position: [0, -40],
                    direction: [0, -1]
                },
                {
                    position: [0, 40],
                    direction: [0, 1]
                }
            ],
            //器件初始为竖向
            padding: 1,
            margin: [1, 0],
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
            pointInfor: [
                {
                    position: [0, -40],
                    direction: [0, -1]
                },
                {
                    position: [0, 40],
                    direction: [0, 1]
                }
            ],
            //器件初始为竖向
            padding: 1,
            margin: [1, 0],
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
            pointInfor: [
                {
                    position: [0, 40],
                    direction: [0, 1]
                },
                {
                    position: [0, -40],
                    direction: [0, -1]
                }
            ],
            //器件初始为竖向
            padding: [1, 0],
            margin: 1,
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
            pointInfor: [
                {
                    position: [0, -20],
                    direction: [0, -1]
                }
            ],
            padding: 0,
            margin: 1,
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
            pointInfor: [
                {
                    position: [0, -40],
                    direction: [0, -1]
                },
                {
                    position: [0, 40],
                    direction: [0, 1]
                }
            ],
            //器件初始为竖向
            padding: 1,
            margin: [1, 0],
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
            pointInfor: [
                {
                    position: [-20, 0],
                    direction: [-1, 0]
                },
                {
                    position: [20, 0],
                    direction: [1, 0]
                }
            ],
            padding: 0,
            margin: 1,
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
                        "points": "12,0 2,-6 6,0 2,6", "class":"fill-whole"
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
            padding: [1, 0],
            margin: 1,
            pointInfor: [
                {
                    position: [0, -40],
                    direction: [0, -1]
                },
                {
                    position: [0, 40],
                    direction: [0, 1]
                }
            ],
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
            padding: [1, 1, 1, 0],
            margin: 1,
            pointInfor: [
                {
                    position: [-20, 0],
                    direction: [-1, 0]
                },
                {
                    position: [20, -40],
                    direction: [0, -1]
                },
                {
                    position: [20, 40],
                    direction: [0, 1]
                }
            ],
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
            padding: 1,
            margin: 1,
            pointInfor: [
                {
                    position: [-40, -20],
                    direction: [-1, 0]
                },
                {
                    position: [-40, 20],
                    direction: [-1, 0]
                },
                {
                    position: [40, 0],
                    direction: [1, 0]
                }
            ],
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
};

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
    this.rotate = new Matrix([[1, 0], [0, 1]]);
    this.position = Point([1000, 1000]);
    this.current = {};
    this.connect = new Array(this.pointInfor.length).fill(false);
    this.circle = [];

    //外部输入数据
    if(typeof data === "object") {
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
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
                        this[i] = Point(data[i]);
                        break;
                    default:
                        if (data[i] instanceof Array) {
                            this[i] = Array.clone(data[i]);
                        } else {
                            this[i] = data[i];
                        }
                }
            }
        }
    }
    if(!this.input) { this.input = []; }
    this.elementDOM = this.createPart(); //创建新器件
    this.setPosition();

    //引脚DOM引用
    for(let i = 0; i < this.connect.length; i++) {
        this.circle[i] = $("#" + this.id + "-" + i, this.elementDOM);
    }
    //显示文字,默认在器件的右上方
    this.textVisition(textPos);
    partsAll.push(this);
}
PartClass.prototype = {
    constructor: PartClass,
    //计算器件当前引脚坐标及方向
    pointRotate() {
        const ans = [];
        for (let i = 0; i < this.pointInfor.length; i++) {
            const point = this.pointInfor[i];
            ans.push({
                position: this.rotate.multo([point.position])[0],
                direction: this.rotate.multo(point.direction)[0]
            });
        }
        return(ans);
    },
    //当前器件边距
    marginRotate() {
        const ans = {},
            attr = ['padding', 'margin'];

        for(let i = 0; i < 2; i++) {
            const margin = {left:0,right:0,top:0,bottom:0},
                data = this[attr[i]],
                tempMargin = [
                    [0, - data.top],
                    [- data.left, 0],
                    [0, data.bottom],
                    [data.right, 0]
                ];

            //四方向计算
            for(let j = 0; j < 4; j++) {
                const ma = this.rotate.multo([tempMargin[j]])[0];
                if (ma[0] !== 0) {
                    if (ma[0] > 0) {
                        margin.right = ma[0];
                    } else {
                        margin.left =  - ma[0];
                    }
                } else if(ma[1] !== 0) {
                    if (ma[1] > 0) {
                        margin.bottom = ma[1];
                    } else {
                        margin.top = - ma[1];
                    }
                }
            }
            ans[attr[i]] = margin;
        }
        return(ans);
    },
    //在图中标记器件
    markSign() {
        const position = this.position.floorToSmall(),
            range = this.marginRotate().padding,
            pointInfor = this.pointRotate()
                .map((n) => n.position);

        //格式验证
        if(!position.isInteger()) {
            throw "设置标记时，器件必须对齐图纸";
        }
        schMap.makePartSign(this.id, position, pointInfor, range);
    },
    //删除器件标记
    deleteSign() {
        const position = this.position.floorToSmall(),
            range = this.marginRotate().padding,
            pointInfor = this.pointRotate()
                .map((n) => n.position);

        //格式验证
        if(!position.isInteger()) {
            throw "设置标记时，器件必须对齐图纸";
        }
        schMap.deletePartSign(position, pointInfor, range);
    },
    //器件设置位置
    setPosition() {
        //器件本体
        this.elementDOM.attr("transform",
            "matrix(" + this.rotate.join(",") + "," + this.position.join(",") + ")");
        //显示文字
        if(this.visionNum) {
            this.textVisition($("text.features-text", this.elementDOM).attr(["x", "y"]));
        }
    },
    //显示器件文字
    textVisition(coordinates) {
        //没有需要显示的文字
        if (!this.visionNum) { return (false); }

        coordinates = (coordinates instanceof Array)
            ? coordinates.map((n) => parseInt(n))
            : [this.txtLocate, -this.txtLocate];

        const elemtxt = $("text", this.elementDOM),
            elemtspan = $("tspan", elemtxt),
            tempPointInfor = this.pointRotate(),
            signRotate = $(".part-rotate", this.elementDOM),
            //器件文字旋转逆矩阵
            texttransfor = this.rotate.inverse();

        elemtxt.attr("transform", "matrix(" + texttransfor.join(",") + ",0,0)");

        if (signRotate.length) {
            signRotate.attr("transform", "matrix(" + texttransfor.join(",") + ",0,0)");
        }

        //判断文字显示的方位，文字显示在管脚没有的方向
        for (let i = 0; i < tempPointInfor.length; i++) {
            const direction = tempPointInfor[i].direction;

            if(direction[0] === 0) {
                if((direction[1] < 0 && coordinates[1] < 0) ||
                    (direction[1] > 0 && coordinates[1] > 0)) {
                    //上下
                    coordinates[1] = 0;
                }
            } else {
                if ((direction[0] < 0 && coordinates[0] < 0) ||
                    (direction[0] > 0 && coordinates[0] > 0)) {
                    //左右
                    coordinates[0] = 0;
                }
            }
        }
        //取数字大的那个距离为标准
        if (Math.abs(coordinates[0]) > Math.abs(coordinates[1])) {
            coordinates[1] = 0;
        } else {
            coordinates[0] = 0;
        }

        //外形大小
        const rect = $(".focus-part", this.elementDOM).attr(["width","height"]).map((n) => Number(n)),
            exec = (/scale\(([\d.]+?)\)/).exec(schematic.attr("transform")) || [1, 1],
            scale = Number(exec[1]);

        let transform = this.elementDOM.attr("transform");
        if (!transform) {
            transform = new Matrix([[1,0],[0,1]]);
        } else {
            const nums = transform.match(/\d+/g)
                .map((n) => Number(n));
            transform = new Matrix([[nums[0], nums[1]], [nums[2], nums[3]]]);
        }
        const size = transform.multo([rect])[0].map((n) => parseInt(Math.abs(n / 2))),
            bias = 4;

        if (!coordinates[0]) {
            if (coordinates[1] > 0) {
                //下
                const idText = $(elemtspan[0]),
                    startY = size[1] + idText.height()/scale - bias,
                    startX = -0.5 * (idText.width()/scale + $(elemtspan[1]).width()/scale);

                elemtxt.attr({
                    "x": startX,
                    "y": startY
                });
                for (let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]);
                    elem.attr({
                        "dx": -0.5 * elem.width()/scale + startX,
                        "dy": elem.height()/scale
                    });
                }
            } else {
                //上
                const idText = $(elemtspan[0]),
                    startX = -0.5 * (idText.width()/scale + $(elemtspan[1]).width()/scale);
                let startY = 0;

                for(let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]),
                        height = elem.height() / scale;

                    elem.attr({
                        "dx": -0.5 * elem.width() / scale + startX,
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
            if (coordinates[0] > 0) {
                //右
                const startX = size[0] + bias,
                    idText = $(elemtspan[0]);

                let startY = 0,
                    biasY = - idText.width()/scale;

                for(let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]);
                    const height = elem.height()/scale;
                    elem.attr({
                        "dx": biasY - $(elemtspan[i - 1]).width()/scale,
                        "dy": height
                    });
                    startY -= height;
                    biasY = 0;
                }
                startY = 0.5 * (startY + idText.height()/scale) - bias;

                elemtxt.attr({
                    "x": startX,
                    "y": startY
                });
            } else {
                //左
                const idText = $(elemtspan[0]),
                    startX = - (size[0] + bias + idText.width()/scale + $(elemtspan[1]).width()/scale);
                let startY = 0;

                for(let i = 2; i < elemtspan.length; i++) {
                    const elem = $(elemtspan[i]),
                        height = elem.height()/scale;
                    elem.attr({
                        "dx": - $(elemtspan[i]).width()/scale,
                        "dy": height
                    });
                    startY -= height;
                }

                startY = 0.5 * (startY + idText.height()/scale) - bias;

                elemtxt.attr({
                    "x": startX,
                    "y": startY
                });
            }
        }
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
                x: "-9", y: "-9", width: "18", height: "18", "class": "rect-part-point"
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
        for (let i = 0; i < this.pointInfor.length; i++) {
            let position = this.pointInfor[i].position,
                tempDate = $("<g>", SVG_NS, {
                    "id": this.id + "-" + i,
                    "transform": "translate(" + position[0] + "," + position[1] + ")",
                    "class": "part-point point-open"
                });

            for (let j in nodepoint) {
                if (nodepoint.hasOwnProperty(j)) {
                    tempDate.append($("<" + j + ">", SVG_NS, nodepoint[j]));
                }
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
    //引脚被占用，禁止缩放
    connectPoint(pointMark, lineId) {
        this.connect[pointMark] = lineId;
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
    //器件高亮
    toFocus() {
        this.elementDOM.addClass("focus");
        partsNow.push(this);
    },
    //器件取消高亮
    toNormal() {
        this.elementDOM.removeClass("focus");
        this.current = {};
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
    //移动器件本身或者是属性文本
    move(mouse, attr) {
        if (attr === "text") {
            const grid = this.current;
            grid.position = grid.position.add(grid.mouseBias(mouse));

            grid.text.attr({
                "x": grid.position[0],
                "y": grid.position[1]
            });
        } else {
            this.position = this.position.add(mouse);
            this.setPosition();
        }
    },
    //旋转器件
    rotateSelf(sub) {
        //旋转前的器件引脚信息
        const pointOld = this.pointRotate();
        //删除旧器件标记
        this.deleteSign(this.position);
        //计算新的旋转矩阵
        this.rotate = this.rotate.mul(rotateMatrix[sub]);
        //旋转之后的引脚信息
        const point = this.pointRotate();
        //导线部分
        this.current.lines = [];
        for(let i = 0; i < this.connect.length; i++) {
            const node = this.position.add(pointOld[i].position),
                line = partsAll.findPart(this.connect[i]);

            //没有连接就跳过
            if (!line) {
                continue;
            }
            //引脚位置没有变化也跳过
            if (pointOld[i].position.isEqual(point[i].position)) {
                continue;
            }
            //器件引脚为起点
            if(node.isEqual(line.way.get(-1))) {
                line.reverse();
            }
            //设置导线的起点所连接的引脚下标、初始方向、当前路径
            line.current.pointMark = i;
            line.current.initTrend = Point(point[i].direction);
            line.current.wayBackup = Array.clone(line.way);

            line.deleteSign();
            this.current.lines.push(line);
        }
        //放下器件
        this.putDownSelf();
    },
    //当前位置是否被占用
    isCover(pos) {
        //获取当前器件的内外边距之和
        function merge(part) {
            const box = {},
                range = part.marginRotate();

            for(let i = 0; i < 4; i++) {
                const attr = ['left','right','top','bottom'][i];
                box[attr] = range.margin[attr] + range.padding[attr];
            }
            return(box);
        }

        const coverHash = {},
            boxSize = merge(this),
            margin = this.marginRotate().margin,
            point = this.pointRotate()
                .map((n) => Point.prototype.floorToSmall.call(n.position)),
            position = pos
                ? Point(pos).roundToSmall()
                : this.position.roundToSmall();

        //检查器件管脚
        for (let i = 0; i < point.length; i++) {
            const node = position.add(point[i]);
            if (schMap.getValueBySmalle(node)) {
                return (true);
            }
            coverHash[node.join(',')] = true;
        }
        //扫描内边距
        for (let i = position[0] - margin.left; i <= position[0] + margin.right; i++) {
            for (let j = position[1] - margin.top; j <= position[1] + margin.bottom; j++) {
                const status = schMap.getValueBySmalle([i, j]);
                //内边距中存在任何元素都表示被占用
                if (status) {
                    return (true);
                } else {
                    coverHash[i + "," + j] = true;
                }
            }
        }
        //扫描外边距
        for (let i = position[0] - boxSize.left; i <= position[0] + boxSize.right; i++) {
            for (let j = position[1] - boxSize.top; j <= position[1] + boxSize.bottom; j++) {
                //跳过内边距
                if (coverHash[i + "," + j]) {
                    continue;
                }
                const status = schMap.getValueBySmalle([i, j]);
                if (status && status.form === 'part') {
                    const part = partsAll.findPart(status.id),
                        partSize = merge(part),
                        diff = this.position.add(-1, part.position).floorToSmall();

                    if (diff[0] !== 0) {
                        if (diff[0] > 0 && diff[0] < boxSize.left + partSize.right) {
                            return (true);
                        } else if (-diff[0] < boxSize.right + partSize.left) {
                            return (true);
                        }
                    }
                    if (diff[1] !== 0) {
                        if (diff[1] > 0 && diff[1] < boxSize.top + partSize.bottom) {
                            return (true);
                        } else if (-diff[1] < boxSize.bottom + partSize.top) {
                            return (true);
                        }
                    }
                }
            }
        }

        return (false);
    },
    //移动之后放下器件
    putDown(isNew) {
        if (isNew) {
            //新建器件需要检测是否可行
            this.position = Point(
                schMap.nodeRound(
                    this.position.round(),
                    this.position,
                    this.isCover.bind(this)
                )
            );
        }

        this.position = this.position.round();
        this.setPosition();
        this.markSign();

        /*
        //相关常量
        const positionLast = this.current.lastPosition,
            round = this.position.round(),
            point = this.pointRotate(),
            lines = (this.current && this.current.lines) || [];

        this.position = round.isEqual(positionLast)
                ? round
                : Point(schMap.nodeRound(round, this.position, this.sheetCover.bind(this)));

        this.setPosition();
        this.markSign();

        //导线部分
        for(let i = 0; i < lines.length; i++) {
            const line = lines[i],
                current = line.current,
                trend = current.initTrend,
                end = current.wayBackup.get(-1),
                start = this.position.add(point[current.pointMark].position);

            line.way.clone(LineClass.AStartSearch(start, end, trend));
            line.setCollectCircle(1);
            line.render();
            line.markSign();
            line.current = {};
        }

        //清空器件临时变量
        this.current = {};
        */
    },
    //删除器件
    deleteSelf() {
        //删除与之相连的导线
        for(let i = 0; i < this.connect.length; i++) {
            if (this.connect[i]) {
                const line = partsAll.findPart(this.connect[i]);
                line.deleteSelf();
            }
        }
        this.deleteSign();
        this.elementDOM.remove();
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
                const tempPart = partsAll.findPart(this.connect[i]);
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

//器件移动相关的方法
partsNow.extend({
    //由器件开始回溯导线，确定导线状态
    checkLine(event) {
        const self = this;
        //递归标记器件所连接的导线
        for(let i = 0; i < self.length; i++) {
            (function DFS(part) {
                //非法器件
                if(!part) { return(false); }
                //已经确定整体移动的器件
                if(part.current.status === "move") { return(true); }

                if(part.partType !== "line" && self.has(part)) {
                    //标记当前器件
                    part.current = {};
                    part.current.status = "move";
                    //当前器件是被选中的器件
                    for(let i = 0; i < part.connect.length; i++) {
                        DFS(partsAll.findPart(part.connect[i]));
                    }
                } else if(part.partType === "line") {
                    //当前器件是导线
                    //标记当前导线
                    if(!part.current.status) {
                        part.current = {};
                        part.current.status = "half";
                    } else if(part.current.status === "half") {
                        part.current.status = "move";
                        return(true);
                    }
                    //导线回溯
                    if(part.connect.every((con) =>
                            con.split(" ").map((item) => partsAll.findPart(item))
                                .some((item) => (!item) || self.has(item) || item.current.status))) {

                        //当前导线整体移动
                        part.current.status = "move";
                        part.connect.join(" ").split(" ")
                            .forEach((item) => DFS(partsAll.findPart(item)));
                    }
                }
            })(self[i]);
        }
        //被标记的导线加入器件堆栈
        partsAll.forEach((item) => {
            if(item.partType !== "line") { return( false); }
            //对部分移动的导线进行分类以及数据准备
            if(item.current.status === "move") {
                item.toFocus();
                //记录初始位置
                item.current.position = item.position
                    ? Point(item.position)
                    : Point([0,0]);
            } else if(item.current.status === "half") {
                item.toFocus();
                item.startPath(event, "movePart");
            }
        });
    },
    //器件准备移动
    moveStart() {
        //拔起全部器件
        this.forEach((n) => n.deleteSign());
    },
    //器件移动
    moveParts(event) {
        const self = this,
            grid = self.current,
            bias = grid.mouseBias(event);

        //器件移动
        this.forEach((item) => {
            if(item.current.status === "move") {
                //整体移动
                item.move(bias);
            } else {
                //移动变形
                item.current.movePoint = item.current.movePoint.add(bias);
                item.setPath(false, "movePart");
            }
        });
    },
    //放下所有器件
    putDownParts() {
        const self = this;

        //整体移动的器件对齐网格
        self.forEach((part) => {
            if(part.current.status === "move") {
                if(part.partType === "line") {
                    part.way.forEach((node) => node.add(part.current.position).round());
                } else {
                    part.position = part.position.round();
                }
            }
        });
        //是否能放置器件
        if (self.every((n) => (n.current.status === "move")
                ? !n.isCover()
                : true)) {
            //首先放置整体移动的器件
            self.forEach((n) => {
                if (n.current.status === "move") {
                    n.putDown(false, "movePart")
                }
            });
            //然后放置变形导线
            self.forEach((n) => {
                if (n.current.status !== "move") {
                    n.putDown(false, "movePart")
                }
            });
            //变形导线连接关系改变

        }
        else {
            //不可放置器件，恢复原状

        }
    }
});
Object.freezeMethod(partsNow);

//处理器件原型的格式
function css2obj(css) {
    if(css instanceof Array) {
        if(css.length === 2) {
            return({
                top: css[0],
                bottom: css[0],
                left: css[1],
                right: css[1]
            });
        } else if(css.length === 4) {
            return({
                top: css[0],
                right: css[1],
                bottom: css[2],
                left: css[3]
            });
        }
    } else {
        const num = Number(css);
        return({
            left: num,
            right: num,
            top: num,
            bottom: num
        });
    }
}
for(let i in originalElectronic) {
    const data = originalElectronic[i].readOnly,
        pointInfor = data.pointInfor;

    //内外边距
    data.padding = css2obj(data.padding);
    data.margin = css2obj(data.margin);
    //管脚方向矩阵
    for(let j = 0; j < pointInfor.length; j++) {
        pointInfor[j].direction = new Matrix([pointInfor[j].direction]);
    }
    //器件原型链链接只读属性，并冻结只读属性
    if (originalElectronic.hasOwnProperty(i)) {
        Object.setPrototypeOf(data, PartClass.prototype);
        Object.freezeAll(data);
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
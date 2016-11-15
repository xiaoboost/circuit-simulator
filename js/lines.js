"use strict";

import { $ } from "./jquery";
import { Point } from "./point";
import { schMap } from "./maphash";
import { partsAll, partsNow } from "./collection";

//常量
const SVG_NS = "http://www.w3.org/2000/svg",
    actionArea = $("#area-of-parts"),
    directionhash = [ [0, -1],  [-1, 0], [0, 1], [1, 0] ],
    rotate = [
        [[1, 0], [0, 1]],   //同相
        [[0, 1], [-1, 0]],  //顺时针
        [[0, -1], [1, 0]],  //逆时针
        [[-1, 0], [0, -1]]  //反相
    ];
//冻结方向常量
Object.freezeAll(directionhash);

//新节点
function newNode(node, rotate) {
    const ans = {};
    ans.vector = [
        node.vector[0] * rotate[0][0] + node.vector[1] * rotate[1][0],
        node.vector[0] * rotate[0][1] + node.vector[1] * rotate[1][1]
    ];
    ans.point = [
        node.point[0] + ans.vector[0],
        node.point[1] + ans.vector[1]
    ];
    return(ans);
}
//解析对象，创建DOM
function creatDOM(obj) {
    const dom = $(obj.tag, SVG_NS, obj.attribute);
    if (obj.child) {
        for(let i = 0; i < obj.child.length; i++) {
            dom.append(creatDOM(obj.child[i]));
        }
    }
    return(dom);
}
//导线rect方块属性
function lineRectAttr(a1, a2) {
    const lefttop = [],
        rightlow = [],
        wide = 14,      //默认宽度 14
        temp = { "class": "line-rect" };

    lefttop[0] = Math.min(a1[0], a2[0]);
    lefttop[1] = Math.min(a1[1], a2[1]);
    rightlow[0] = Math.max(a1[0], a2[0]);
    rightlow[1] = Math.max(a1[1], a2[1]);
    if (lefttop[0] === rightlow[0]) {
        temp.x = lefttop[0] - wide / 2;
        temp.y = lefttop[1] - wide / 2;
        temp.height = rightlow[1] - lefttop[1] + wide;
        temp.width = wide;
    } else {
        temp.x = lefttop[0] - wide / 2;
        temp.y = lefttop[1] - wide / 2;
        temp.height = wide;
        temp.width = rightlow[0] - lefttop[0] + wide;
    }
    return (temp);
}
//点到点或线的最短距离
function nodeDistance(node, end) {
    if(node.length !== 2) {
        throw("格式错误");
    }
    if(end[0].length) {
        if(end.length === 2 && end[0].length === 2 && typeof end[0][0] === "number") {
            //终点是单个线段
            if(end[0][0] === end[1][0]) {
                //竖线段
                if((node[1] <= end[0][1] && node[1] >= end[1][1]) ||
                    (node[1] >= end[0][1]  && node[1] <= end[1][1])) {
                    return(Math.abs(node[0] - end[0][0]));
                }
            } else {
                //横线段
                if((node[0] <= end[0][0]  && node[0] >= end[1][0]) ||
                    (node[0] >= end[0][0]  && node[0] <= end[1][0])) {
                    return(Math.abs(node[1] - end[0][1]));
                }
            }
            return(Math.min(
                Math.sqrt((end[0][0] - node[0]) * (end[0][0] - node[0]) + (end[0][1] - node[1]) * (end[0][1] - node[1])),
                Math.sqrt((end[1][0] - node[0]) * (end[1][0] - node[0]) + (end[1][1] - node[1]) * (end[1][1] - node[1]))
            ));
        } else {
            //多个线段
            const ans = [];
            for(let i = 0; i < end.length; i++) {
                ans.push(nodeDistance(node, end[i]));
            }
            return(Math.minOfArray(ans));
        }
    } else {
        //终点是点
        let ans = 0;
        for(let i = 0; i < 2; i++) {
            ans += Math.abs(node[i] - end[i]);
        }
        return(ans);
    }
}

//继承自全局变量图纸标记的临时图纸标记类
function TempSchMap() {}
TempSchMap.prototype = {
    constructor: TempSchMap,
    length: 0,
    setValue(node, value) {
        if (!this[node[0]]) {
            this[node[0]] = [];
        }
        this[node[0]][node[1]] = value;
    },
    getValue(node) {
        if(!this[node[0]] || !this[node[0]][node[1]]) {
            return(false);
        }
        return (this[node[0]][node[1]]);
    }
};
//搜索用的结点检查类
function CheckNode(nodestart, nodeend, mode) {
    //变量保存在闭包中
    const start = nodestart.mul(0.05),
        end = Array.clone(nodeend, 0.05),
        map = schMap,
        small = "small";
    let excludeParts = "",
        excludeLines = [],
        endLine = [];

    //终点检查
    function checkEndPoint (node) {
        return (node.point.isEqual(end));
    }
    function checkEndLine (node) {
        return (nodeInLine(node.point, endLine));
    }
    function checkEndPointToLine (node) {
        if (!(node.junction - node.junStatus)) {
            //当前节点还是直线
            return (nodeInLine(node.point, endLine));
        } else {
            //搜索的导线已经拐过弯了
            return(
                node.point.isEqual(end) ||
                nodeInLineAndVector(node, endLine)
            );
        }
    }
    //节点价值判断
    function calValuePoint (node) {
        return (
            //当前节点到终点的距离
            (Math.abs(node.point[0] - end[0]) + Math.abs(node.point[1] - end[1])) * 3 +
            //当前节点一共转了多少个弯
            node.junction * 3 +
            //当前节点到起点的距离
            (Math.abs(node.point[0] - start[0]) + Math.abs(node.point[1] - start[1]))
        );
    }
    function calValueLine (node) {
        const point = node.point;
        let distance = Infinity;
        //枚举线段求最短距离
        for(let i = 0; i < endLine.length; i++) {
            //垂直为1，水平为0
            const line = endLine[i],
                sub = Number(line[0][1] !== line[1][1]);
            if (((point[sub] <= line[0][sub]) && (point[sub] >= line[1][sub])) ||
                ((point[sub] >= line[0][sub]) && (point[sub] <= line[1][sub]))) {
                distance = Math.min(
                    distance,
                    Math.abs(point[1 - sub] - line[0][1 - sub])
                );
            } else {
                distance = Math.min(
                    distance,
                    Math.abs(point[0] - line[0][0]) + Math.abs(point[1] - line[0][1]),
                    Math.abs(point[0] - line[1][0]) + Math.abs(point[1] - line[1][1])
                );
            }
        }
        return (
            //当前节点到终点的距离
            distance * 3 +
            //当前节点一共转了多少个弯
            node.junction * 3 +
            //当前节点到起点的距离
            (Math.abs(point[0] - start[0]) + Math.abs(point[1] - start[1]))
        );
    }
    //搜索准备和规则
    //返回nodex所在直线段的范围
    function excludeLine (node) {
        //如果终点是线段或者node在线段内，那就直接返回
        if(node[0].length || !map.isLine(node, "small")) {
            return([]);
        } else {
            return (map.getLineBySmall(node));
        }
    }
    //返回nodex所在器件的ID
    function excludePart (node) {
        if(map.isPartNotPoint(node, "small")) {
            return(map.getSingleValueBySmalle(node).id);
        } else {
            return("");
        }
    }
    //node是否在排除线段内
    function nodeInLine (node, lines) {
        const point = (node.point) ?
            node.point : node;

        for (let j = 0; j < lines.length; j++) {
            const exclude = lines[j];
            for(let i = 0; i < 2; i++) {
                const sub = 1 - i;
                if (exclude[0][i] === exclude[1][i] && point[i] === exclude[0][i]) {
                    if ((point[sub] >= exclude[0][sub] && point[0] <= exclude[1][sub]) ||
                        (point[sub] <= exclude[0][sub] && point[0] >= exclude[1][sub])) {
                        return (true);
                    }
                }
            }
        }
        return (false);
    }
    //node是否在终点线段内
    function nodeInLineAndVector (node, lines) {
        const point = (node.point) ?
            node.point : node;

        for (let j = 0; j < lines.length; j++) {
            const exclude = lines[j];
            for(let i = 0; i < 2; i++) {
                const sub = 1 - i;
                if (exclude[0][i] === exclude[1][i] && point[i] === exclude[0][i]) {
                    if ((point[sub] >= exclude[0][sub] && point[0] <= exclude[1][sub]) ||
                        (point[sub] <= exclude[0][sub] && point[0] >= exclude[1][sub])) {
                        //点在线段范围内，判断向量是否平行
                        const vector = [
                            exclude[0][0] - exclude[1][0],
                            exclude[0][1] - exclude[1][1]
                        ];
                        if(vector[0] * node.vector[0] + vector[1] * node.vector[1] !== 0) {
                            return(true);
                        }
                    }
                }
            }
        }
        return (false);
    }
    //两点是否在同一个导线上
    function nodeInSameLine (node, nodelast) {
        if(!map.isLine(node) || !map.isLine(nodelast)) {
            return(false);
        }
        const connect = map.getSingleValueBySmalle(nodelast).connect;
        for(let i = 0; i < connect.length; i++) {
            if(node.isEqual(connect[i])) {
                return(true);
            }
        }
        return(false);
    }
    //node是被排除器件的一部分
    function nodeInPart (node) {
        const tempStatus = map.getSingleValueBySmalle(node);
        if (!tempStatus ||
            tempStatus.form !== "part" ||
            excludeParts.indexOf(tempStatus.id) !== -1) {
            return (true);
        }
        return (false);
    }
    //node是被排除器件管脚的一部分
    function nodeInPartPoint (node) {
        const tempStatus = map.getSingleValueBySmalle(node);
        if (!tempStatus ||
            tempStatus.form !== "part-point" ||
            excludeParts.indexOf(tempStatus.id.split("-")[0]) !== -1) {
            return (true);
        }
        return (false);
    }
    //当前点坐标（等于器件管脚，且不是终点）
    function nodeInPointZero (node, nodeend) {
        const tempStatus = map.getSingleValueBySmalle(node);
        if (!tempStatus || tempStatus.form !== "part-point") {
            return (false);
        }
        if (node[0] !== nodeend[0] || node[1] !== nodeend[1]) {
            return (true);
        } else {
            return (false);
        }
    }
    //当前点坐标（等于器件管脚，且与终点距离大于1）
    function nodeInPointOne (node, nodeend) {
        const tempStatus = map.getSingleValueBySmalle(node);
        if (!tempStatus || tempStatus.form !== "part-point") {
            return (false);
        }
        if ((Math.abs(node[0] - nodeend[0]) + Math.abs(node[1] - nodeend[1])) > 1) {
            return (true);
        } else {
            return (false);
        }
    }

    //根据输入的模式设定检查函数
    switch (mode) {
        case 1: {
            //模式1，绘制整体导线
            //排除node器件，node所在直线段等于终点
            excludeParts = excludePart(end);
            endLine = excludeLine(end);
            this.checkPoint = function (node, nodelast) {
                return (
                    !nodeInSameLine(node, nodelast) &&
                    nodeInPart(node) &&
                    !nodeInPointOne(node, end)
                );
            };
            break;
        }
        case 2: {
            //模式2，修饰导线
            //排除起点和终点的的器件和起点的导线
            excludeParts = excludePart(start) + excludePart(end);
            excludeLines = excludeLine(start);
            endLine = excludeLine(end);
            this.checkPoint = function (node, nodelast) {
                return (
                    !nodeInSameLine(node, nodelast) &&
                    nodeInPart(node) &&
                    !nodeInPointZero(node, end)
                );
            };
            break;
        }
        case 3: {
            //模式3，单个器件移动导致的导线变形
            //排除起点的器件和导线
            excludeParts = excludePart(start);
            excludeLines = excludeLine(start);
            endLine = [end];
            this.checkPoint = function (node, nodelast) {
                //如果当前点是未排除的导线
                if(map.isLine(node, small) && !nodeInLine(node, excludeLines)) {
                    //如果当前点和之前的点在同一个导线上，那么当前点不能扩展
                    return(!nodeInSameLine(node, nodelast));
                } else if (map.isPartNotPoint(node, small)) {
                    //是器件但不是管脚
                    return(nodeInPart(node));
                } else if (map.isPart(node, small)) {
                    //管脚
                    return(nodeInPartPoint(node));
                }
                return(true);
            };
            break;
        }
    }

    //根据终点状态设定估值函数和终点检测函数
    if(nodeend[0].length) {
        //终点是线段
        if(!nodeend.every((n) => Point.prototype.isStandarNode.call(n))) {
            throw("终线段格式错误");
        }
        //起点就在终线段内，返回起点
        if (nodeInLine(start, endLine)) {
            return(new LineWay([nodestart]));
        }
        this.calValue = calValueLine;
        this.checkEnd = checkEndLine;
    } else {
        //终点是点
        if(!nodeend.isStandarNode()) {
            throw("终点格式错误");
        }
        //起点和终点相等，返回起点
        if(start.isEqual(end)) {
            return(new LineWay([nodestart]));
        }
        //终点是点，统一采用点的计算方式
        this.calValue = calValuePoint;
        if(schMap.isLine(nodeend)) {
            //终点在某线段内，那么终点判断就是混合型的
            this.checkEnd = checkEndPointToLine;
        } else {
            this.checkEnd = checkEndPoint;
        }
    }

    //当前点扩展点数
    this.expandNumber = function(node) {
        //如果当前扩展点在某导线上且该点不是排除点，那么只允许直行
        if (map.isLine(node)) {
            if(this.nodeInLine(node, excludeLines)) {
                return (3);
            } else {
                return (1);
            }
        } else {
            return (3);
        }
    };
}
//搜索用的堆栈类
function Stack(nodestart, vector, map) {
    const start = nodestart.mul(0.05),
        Deep = 0;   //初始化时深度为0，正确的值在外面重新计算

    this.map = map;
    this[Deep] = [];
    this[Deep][0] = {
        point: start,
        junction: 0,
        value: Deep,
        parent: false,
        junStatus: 0,
        vector: vector
    };
    this.map.setValue(start, this[Deep][0]);
    this.size = 0;
    Object.defineProperties(this, {
        size: {
            configurable: false,
            enumerable: false
        },
        map: {
            configurable: false,
            enumerable: false
        }
    });
}
Stack.prototype = {
    constructor: Stack,
    length: 0,
    pop() {
        for (let i in this) if(this.hasOwnProperty(i)) {
            const temp = this[i].pop();
            if (!this[i].length) {
                delete this[i];
            }
            this.size --;
            return(temp);
        }
    },
    push(node) {
        let expandFlag = true;
        const status = this.map.getValue(node.point);
        if (status) {
            //如果当前扩展的节点已经搜索过则需要对比，保留value较小的
            if(node.value > status.value) {
                expandFlag = false;
            } else if(this[status.value]) {
                for(let j = 0; j < this[status.value].length; j++) {
                    if (status === this[status.value][j]) {
                        this[status.value].splice(j, 1);
                        if (!this[status.value].length) {
                            delete this[status.value];
                        }
                        break;
                    }
                }
            }
        }
        if (expandFlag) {  //按照估值大小，将新扩展的点插入open堆栈
            if (!this[node.value]) {
                this[node.value] = [];
            }
            this[node.value].push(node);
            this.map.setValue(node.point, node);
            this.size ++;
        }
    }
};

//A*路径搜索
function AstartSearch(start, end, vector, mode) {
    //初始化
    const map = new TempSchMap(),
        check = new CheckNode(start, end, mode),
        stackopen = new Stack(start, vector, map);

    //检查checkNode是否有结束标记
    if(check instanceof LineWay) {
        return(check);
    }

    //计算初始值的估值
    stackopen[0][0].value = check.calValue(stackopen[0][0]);
    //结束标记
    let endFlag = false, endStatus;
    //A*搜索，少于1000个节点
    while((!endFlag)&&(stackopen.size < 1000)) {
        //open栈栈顶元素弹出作为当前节点
        const nodenow = stackopen.pop(),
            expandCount = check.expandNumber(nodenow.point);
        //直行时是否碰到障碍物
        let barrierStatus = false;

        //MapTest.addPoint(nodenow.point, "#2196F3", 20);

        for (let i = 0; i < expandCount; i++) {
            let nodexpand = newNode(nodenow, rotate[i]);

            //MapTest.addPoint(nodexpand.point, "#000000", 20);

            //检查当前扩展点是否满足扩展要求，不满足就跳过
            if (!check.checkPoint(nodexpand.point, nodenow.point)) {
                if(!i) {
                    //直行时遇到障碍物，标志位置高
                    barrierStatus = true;
                }
                continue;
            }

            nodexpand.junction = nodenow.junction + Number(!!i);
            nodexpand.parent = nodenow;
            nodexpand.value = check.calValue(nodexpand);  //计算估值
            stackopen.push(nodexpand);
            //如果拐弯是因为直行遇到了障碍物，那么更新当前状态下标
            nodexpand.junStatus = barrierStatus ? nodenow.junStatus : nodexpand.junction;
            //检查当前扩展点是否是终点
            if (check.checkEnd(nodexpand)){
                endStatus = nodexpand;
                endFlag = true;
                break;
            }
        }
        if (Object.isEmpty(stackopen)) {
            return ([]);
        }
    }

    //MapTest.clear();

    const tempway = new LineWay();
    let junctionValue = endStatus.junction;
    tempway.push(Array.clone(endStatus.point, 20));
    //从当前节点开始回溯路径
    while(endStatus.parent){
        if(endStatus.junction < junctionValue) {
            tempway.push(Array.clone(endStatus.point, 20));
            junctionValue = endStatus.junction;
        }
        endStatus = endStatus.parent;
    }
    tempway.push(Array.clone(start));
    tempway.reverse();
    return(tempway);
}

//导线路径类
function LineWay(way) {
    //检查输入路径格式
    if (way instanceof Array) {
        for (let i = 0; i < way.length; i++) {
            this.push(new Point(way[i]));
        }
    } else if (typeof way === "number") {
        return (new Array(way));
    }
}
LineWay.prototype = {
    constructor: LineWay,
    length: 0,
    //去除节点冗余
    checkWayRepeat() {
        for (let i = 0; i < this.length - 2; i++) {
            if (((this[i][0] === this[i + 1][0]) && (this[i + 1][0] === this[i + 2][0])) ||
                ((this[i][1] === this[i + 1][1]) && (this[i + 1][1] === this[i + 2][1])) ||
                ((this[i][0] === this[i + 1][0]) && (this[i][1] == this[i + 1][1]))) {
                this.splice(i + 1, 1);
                i -= 2;
                if (i < -1) i = -1;
            }
        }
    },
    //在末尾添加节点
    push(node) {
        this[this.length++] = new Point(node);
        return(this.length);
    },
    //在开头添加节点
    unshift(...args) {
        const len = args.length;
        for(let i = this.length - 1; i >= 0; i--) {
            this[i + len] = this[i];
        }
        for(let i = 0; i < len; i++) {
            this[i] = new Point(args[i]);
        }
        this.length = this.length + len;
        return(this.length);
    },
    //去除路径冗余
    checkWayExcess(trend, mode) {
        if (this.length <= 3) return(true);
        //如果优先出线方向和第二个线段方向相同，说明此处需要修正
        if (trend.isEqual(Math.vectorInit(this[1],this[2]))) {
            this.insert(
                AstartSearch(this[0], this[2], trend, mode),
                0, 3);
            this.checkWayRepeat();
        }

        for (let i = 0; i < this.length - 3; i++) {
            const vector = [
                Math.vectorInit(this[i], this[i + 1]),
                Math.vectorInit(this[i + 2], this[i + 3])
            ];
            //相隔线段方向不同
            //去除冗余过程中优先处理导线折返的情况
            if (!vector[0].isEqual(vector[1])) {
                //局部修饰，模式2
                this.insert(
                    AstartSearch(this[i], this[i + 3], vector[0], mode),
                    i , 4);
                this.checkWayRepeat();
            } else {
                //局部修饰，模式2
                this.insert(
                    AstartSearch(this[i + 1], this[i + 3], vector[0], mode),
                    i + 1, 3);
                this.checkWayRepeat();
            }
        }
        this.checkWayRepeat();
    },
    //给路径添加插入一个数组方法
    //向this数组的sub下标中插入tempArray数组，并且删除sub下标开始长度为len的数据
    insert(tempArray,sub,len = 0) {
        this.splice(sub, len);
        for (let i = 0; i < tempArray.length; i++)
            this.splice(sub + i, 0, tempArray[i]);
    },
    //复制路径，将会抛弃y原路径数据的全部引用，也不会引用被复制的数据
    cloneWay(tempway) {
        //复制tempway的路径到this
        //如果tempway的数据格式不对，则终止程序，抛出错误
        if (!tempway.length) {
            throw("路径格式错误");
        }
        for (let i = 0; i < tempway.length; i++) {
            this[i] = new Point(tempway[i]);
        }
        this.splice(tempway.length);
        this.length = tempway.length;
    },
    //tempWay和this是否完全相等
    isSame(tempWay) {
        for(let i = 0; i < this.length; i++) {
            if(!(this[i].isEqual(tempWay[i]))) {
                return(false);
            }
        }
        return(true);
    },
    //路径标准化
    standardize() {
        for(let i = 0; i < this.length; i++) {
            this[i] = this[i].round();
        }
    },
    //点在导线的哪个线段上，返回该线段起点在导线中的下标
    nodeInWay(node) {
        let mindistance = 30000, sub;
        for(let i = 0; i < this.length - 1; i++) {
            const temp = schematic.nodeToSegment(node,[this[i], this[i + 1]]);
            if(temp < mindistance) {
                mindistance = temp;
                sub = i;
            }
        }
        if(mindistance < 11) {
            return(sub);
        } else {
            return(false);
        }
    },
    //导线终点扩展
    endExpand(points, endPoint, initTrend) {
        if (schMap.isLine(endPoint)) return([]);

        const ans = [];
        if(this.length > 1) {
            //当前路径终点方向
            const tempvector = Math.vectorInit(this[this.length - 2], this[this.length - 1], 20);
            const turn = (initTrend.isEqual(Math.vectorInit(this[0], this[1]))) ? (this.length - 2) : (this.length - 1);
            for(let i = 0; i < 4; i ++) {
                //原路径不是直线，不允许再次拐弯
                //下标1、2是指在最顶上面rotate中顺时针和逆时针旋转的矩阵，这里要跳过它们
                if (turn && (i === 1 || i === 2)) continue;
                //新的终点坐标
                const tempEnd = [
                    this[this.length - 1][0] + tempvector[0] * rotate[i][0][0] + tempvector[1] * rotate[i][1][0],
                    this[this.length - 1][1] + tempvector[0] * rotate[i][0][1] + tempvector[1] * rotate[i][1][1]
                ];
                if (schMap.isLine(tempEnd)) continue;
                //新终点在四方格之内
                if (points.some((n) => n.isEqual(tempEnd))) {
                    let newWay = new LineWay(this);
                    newWay.push(tempEnd);
                    newWay.checkWayRepeat();
                    ans.push([tempEnd, newWay]);
                }
            }
        }
        return(ans);
    },
    //导线起点扩展
    startExpand(points, startPoint, initTrend) {
        const tempWay = new LineWay(Array.clone(this).reverse()),
            trend = initTrend.mul(-1),
            ans = tempWay.endExpand(points, startPoint, trend);
        for(let i = 0; i < ans.length; i++) {
            ans[i][1].reverse();
        }
        return(ans);
    },
    //求路径长度
    len() {
        let ans = 0;
        for(let i = 0; i < this.length - 1; i++) {
            ans += Math.abs(this[i][0] - this[i + 1][0]) + Math.abs(this[i][1] - this[i + 1][1]);
        }
        return(ans);
    },
    //由某点求距离这点最短的线段在当前导线的下标
    searchNodeSub(node) {
        if(this.length === 2) {
            return(1);
        }
        const ans = new Array(2);

        for(let k = 0; k < 2; k++) {
            for (let i = 0; i < this.length - 1; i++) {
                if (this[i][k] === this[i + 1][k]) {
                    const sub = 1 - k;
                    if (((this[i][sub] < node[sub]) && (this[i + 1][sub] > node[sub])) ||
                        ((this[i][sub] > node[sub]) && (this[i + 1][sub] < node[sub]))) {
                        ans[k] = i;
                    }
                }
            }
        }
        if(typeof ans[0] === "undefined" && typeof ans[1] === "undefined") {
            //节点在导线范围外那么输出[起点、终点]和当前点距离比较近的
            const wait = [this[0], this[this.length - 1]];
            if(nodeDistance(wait[0], node) < nodeDistance(wait[1], node)) {
                return(0);
            } else {
                return(this.length - 1);
            }
        }

        return(Math.maxOfArray(ans));
    }
};
Object.setPrototypeOf(LineWay.prototype, Array.prototype);
//[点->路径]的键值对类，整个设计与Map数据结构类似
//只接受长度为2且均为20倍数的数组作为键，键值必须是LineWay的实例
function WayMap(pair) {
    if(pair instanceof Array) {
        this.size = pair.length;
        for (let i = 0; i < pair.length; i++) {
            const [key,value] = pair[i];
            this.set(key, value);
        }
    } else {
        this.size = 0;
    }
    //size不可枚举
    Object.defineProperty(this, "size", {
        enumerable: false,
        configurable: false
    });
}
//WayMap类的静态函数
WayMap.extend({
    checkKeyError(key) {
        if (!((key instanceof Array) && (key.length === 2)))
            throw("键必须是长度为2的数组");
        if ((Math.floor(key[0] * 0.05) !== (key[0] * 0.05)) || (Math.floor(key[1] * 0.05) !== (key[1] * 0.05)))
            throw("数组键的元素必须是20的倍数");
    },
    //检查键值的格式
    checkValueError(value) {
        if (!(value instanceof LineWay)) {
            throw("键值必须是导线路径");
        }
    },
    //将键转换为内部hash的键
    keyToHash(key) {
        return(key[0] * 5 + key[1] * 0.05);
    },
    //内部hash值转换为键
    hashToKey(hash) {
        if(parseInt(hash) !== parseFloat(hash)) throw("内部Hash值必须是整数");
        const ans = [], temp = hash % 100;
        ans[1] = temp * 20;
        ans[0] = (hash - temp) * 0.2;
        return(ans);
    }
});
//WayMap类的实例方法
WayMap.prototype = {
    constructor: WayMap,
    length: 0,
    //返回键key关联的值,如果该键不存在则返回undefined
    get(key) {
        WayMap.checkKeyError(key);
        return(this[WayMap.keyToHash(key)]);
    },
    //设置键key在myMap中的值为value
    //mode表示设定模式，默认为default，表示强制覆写；选输入small，表示之前就有的和当前输入的保留节点数量少的
    set(key, value, mode = "default") {
        WayMap.checkKeyError(key);
        WayMap.checkValueError(value);
        const tempHash = WayMap.keyToHash(key);
        //已经有值了
        if (this[tempHash]) {
            if (mode === "default")
                this[tempHash] = value;
            else if (mode === "small") {
                if (this[tempHash].length > value.length)
                    this[tempHash] = value;
            }
        } else {
            this[tempHash] = value;
            this.size += 1;
        }
    },
    //返回一个布尔值,表明键key是否存在于Map中
    has(key) {
        return(!!this.get(key));
    },
    //返回所有key
    keys() {
        const keys = [];
        for(let i in this) {
            if(this.hasOwnProperty(i)) {
                keys.push(WayMap.hashToKey(i));
            }
        }
        return(keys);
    },
    //forEach遍历函数，功能类似Array的forEach函数，key、value为键和键值
    forEach(callback) {
        for(let i in this) if(this.hasOwnProperty(i)) {
            callback(WayMap.hashToKey(i), this[i], this);
        }
    },
    //reduce缩小函数，功能类似Array的reduce函数，key、value为键和键值
    reduce(callback) {
        const keys = [], temp = [];
        for(let i in this) {
            if(this.hasOwnProperty(i)) {
                keys.push(WayMap.hashToKey(i));
                temp.push(i);
            }
        }
        if(!keys.length) return(false);
        let ans = [keys[0], this[temp[0]]];
        //由小到大进行迭代
        for(let i = 1; i < keys.length; i++) {
            ans = callback(ans, [keys[i], this[temp[i]]]);
        }
        return(ans);
    },
    //返回节点最多的路径
    nodeMax() {
        let max = -Infinity, way;
        for(let i in this) {
            if(this.hasOwnProperty(i)) {
                if(this[i].length > max) {
                    max = this[i].length;
                    way = this[i];
                }
            }
        }
        return(way);
    }
};
//导线类
function LineClass(part, mark) {
    let start;      //起点声明

    this.way = new LineWay();       //导线路径
    this.position = [0,0];          //导线原点对准电路图原点
    this.circle = [false,false];    //导线交错节点数组为空
    this.connect = ["",""];         //导线连接点，默认两端为空
    this.partType = "line";         //导线类型
    this.id = partsAll.newId(this.partType + "_");

    //导线属性
    const line = {
        tag: "<g>",
        attribute: {
            "class": "line",
            "id": this.id,
            "transform": "translate(0,0)"
        },
        child: [
            {
                tag: "<path>",
            }
        ]
    };
    //导线的端点属性
    const circle = {
        tag: "<g>",
        attribute: {
            "class": "line-point draw-open",
            "transform": "translate(0,0)"
        },
        child: [
            {
                tag: "<circle>"
            },{
                tag: "<rect>",
                attribute: {
                    "class": "line-point"
                }
            }
        ]
    };
    //创建导线DOM
    this.elementDOM = creatDOM(line);
    for(let i = 0; i < 2; i++) {
        this.circle[i] = creatDOM(circle);
        this.circle[i].attr("id", this.id + "-" + i);
        this.elementDOM.append(this.circle[i]);
    }

    if(!!part.elementDOM && mark !== undefined) {
        //输入是器件和器件管脚
        const pointInfor = part.pointRotate(),
            trend = new Point(pointInfor[mark].direction);
        start = new Point([
            part.position[0] + pointInfor[mark].position[0],
            part.position[1] + pointInfor[mark].position[1]
        ]);

        //导线与器件管脚相互连接
        this.setConnect(0, part.id + "-" + mark);
        part.connectPoint(mark, this.id);
        //当前导线的临时变量
        this.current = {
            startNode: start,
            initTrend: trend,
            mouseRound:new WayMap(),    //鼠标所在方格属性
            enforceAlign:{              //直接对齐模式
                flag:false,             //是否强制更新路径
                onPart:false,           //鼠标是否在某器件上面
                part:false,             //直接对齐的器件
                label:false             //直接对齐的坐标
            }
        };
    } else {
        //输入是起点坐标
        start = part;
        this.current = {};
    }

    this.way.push(new Point(start));
    this.circle[0].attr("transform", "translate(" + start.join(",") + ")");
    this.toGoing();
    //冻结导线的常规属性，current是临时变量可以随意变动
    Object.defineProperties(this, {
        "way": {
            configurable: false,
            writable: false
        },
        "position": {
            configurable: false,
            writable: false
        },
        "circle": {
            configurable: false,
            writable: false
        },
        "connect": {
            configurable: false,
            writable: false
        },
        "partType": {
            configurable: false,
            writable: false
        }
    });
    Object.seal(this);
    partsAll.push(this);
}
LineClass.prototype = {
    constructor: LineClass,
    //导线转换为持续状态，即path删除剩下一个，rect全部删除
    toGoing() {
        const linepath = $("path", this.elementDOM);
        while (linepath.length > 1) {
            linepath.pop().remove();
        }
        $("rect.line-rect", this.elementDOM).remove();
        //导线放置在最底层
        actionArea.preappend(this.elementDOM);
    },
    //返回连接点所连接器件类型
    getConnectStatus(Num) {
        const tempConnect = this.connect[Num];
        if (tempConnect.search(" ") !== -1) return ("line");
        else if (tempConnect.search("-") !== -1) return ("part");
        return (false);
    },
    //移动导线端点
    moveCircle(Num,position) {
        this.circle[Num].attr("transform", "translate(" + position.join(",") + ")");
    },
    //绘制导线
    wayDrawing() {
        if(this.way.length < 1) {
            throw("路径数据错误");
        }
        let temp = "M" + this.way[0][0] + "," + this.way[0][1];
        for(let i = 1; i < this.way.length; i++)
            temp += "L" + this.way[i][0] + "," + this.way[i][1];

        $("path", this.elementDOM).attr("d", temp);
        this.moveCircle(0, this.way[0]);
        this.moveCircle(1, this.way[this.way.length - 1]);
    },
    //导线图形渲染
    render() {
        let templine = this.elementDOM,
            linepath = $("path", templine),
            linerect = $("rect.line-rect", templine),
            tempway = this.way;

        if((this.position[0])||(this.position[1])) {    //导线原点和电路图原点没有对齐，说明导线需要做整体移动
            for(let i = 0; i < tempway.length; i--) {
                tempway[i][0] -= this.position[0];
                tempway[i][1] -= this.position[1];
            }
            this.position = [0, 0];
            this.elementDOM.attr("transform", "translate(0,0)");
        }
        tempway.checkWayRepeat();                       //删除重复节点
        this.current = {};                              //导线临时数据清空
        //多余的导线线段需要删除
        while (linepath.length > this.way.length - 1) {
            linepath.remove(-1);
        }
        while (linerect.length > this.way.length - 1) {
            linerect.remove(-1);
        }
        //绘制导线图像，path部分需要放置底层
        for (let i = 0; i < tempway.length - 1; i++){
            if(!linepath[i]) {
                templine.append($("<path>", SVG_NS, {
                    "d": "M" + tempway[i][0] + "," + tempway[i][1] +
                    "L" + tempway[i + 1][0] + "," + tempway[i + 1][1]
                }));
            } else {
                linepath.get(i).attr("d",
                    "M" + tempway[i][0] + "," + tempway[i][1] + "L" +
                    tempway[i + 1][0] + "," + tempway[i + 1][1]);
            }
        }
        for (let i = 0; i < tempway.length - 1; i++){
            if(!linerect[i]) {
                templine.append($("<rect>", SVG_NS, lineRectAttr(tempway[i], tempway[i + 1])));
            } else {
                linerect.get(i).attr(lineRectAttr(tempway[i], tempway[i + 1]));
            }
        }
        this.resetCircle(0);
        this.resetCircle(1);
    },
    //从连接表中删除某一个导线
    deleteConnect(lineId) {
        this.connect.forEach(function(item,index,arr) {
            if(item.search(lineId) !== -1) {
                arr[index] = item.split(" ").filter((n) => n !== lineId).join(" ");
            }
        });
    },
    //从连接表中连接的器件中把oldID替换成newID
    replaceConnect(sub,newId) {
        let connectId = this.connect[sub];
        if (connectId.search("-") !== -1) {              //此连接点连接到了器件
            let tempcon = connectId.split("-");
            let partObj = partsAll.findPartObj(tempcon[0]);
            let pointMark = parseInt(tempcon[1]);
            partObj.connectPoint(pointMark, newId);      //替换器件的引脚连接
        } else {
            let lines = connectId.split(" ").map(function (item) {    //查询所有连接的导线
                return (partsAll.findPartObj(item));
            });
            for (let i = 0; i < lines.length; i++) {
                lines[i].connect[0] = lines[i].connect[0].replace(this.id, newId);
                lines[i].connect[1] = lines[i].connect[1].replace(this.id, newId);
            }
            let crossNode = this.way[sub * (this.way.length - 1)];
            let crossStatus = schMap.getSingleValueByOrigin(crossNode);
            crossStatus.id = crossStatus.id.replace(this.id, newId);
        }
    },
    //导线翻转
    reversal() {
        this.way.reverse();
        this.connect.reverse();
        this.circle.reverse();
    },
    setConnect(Num,connectId) {
        this.connect[Num] = connectId;
        if(connectId.search(" ") === -1) {
            //没有搜索到空格，表示连接到器件
            this.circle[Num].attr("class", "line-point draw-close");
        } else {
            //连接到交错节点
            this.circle[Num].attr("class", "line-point cross-point");
        }
    },
    //缩小节点
    shrinkCircle(Num) {
        $("circle", this.circle[Num]).attr("style", "r:4");
    },
    //放大节点
    enlargeCircle(Num) {
        $("circle", this.circle[Num]).attr("style", "r:8");
    },
    //端点复原
    resetCircle(num) {
        this.elementDOM.append(this.circle[num]);
        this.moveCircle(num, this.way[num * (this.way.length - 1)]);
        $("circle", this.circle[num]).attr("style", "");
    },
    //转换节点为绘制状态
    drawCircle(Num) {
        this.connect[1] = "";
        this.circle[Num].attr("class", "line-point draw-open");
        $("circle", this.circle[Num]).attr("style", "r:8");
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
    //position是导线的起点还是终点，起点为0，终点为1，假如两个都不是返回-1
    findConnect(position) {
        if(position[0] === this.way[0][0] && position[1] === this.way[0][1]){
            return(0);
        } else if(position[0] === this.way[this.way.length - 1][0] && position[1] === this.way[this.way.length - 1][1]){
            return(1);
        } else return(-1);
    },
    //拆分导线，splited为被拆分导线，this为分割导线的导线，sub表示交错节点是this路径的起点/终点
    splitLine(splited,sub) {
        const NodeCross = Array.clone(this.way[sub * (this.way.length - 1)]),      //交错节点
            devices = new LineClass(NodeCross);                             //新建导线

        //导线连接表
        splited.replaceConnect(1,devices.id);               //替换连接器件的ID
        devices.setConnect(1,splited.connect[1]);          //原导线起点不变，新导线的终点等于原导线的终点
        devices.setConnect(0,splited.id + " " + this.id);  //新导线起点由旧导线ID和分割旧导线的导线ID组成
        this.setConnect(1,splited.id + " " + devices.id);  //分割旧导线的导线终点由新旧导线ID组成
        splited.setConnect(1,devices.id + " " + this.id);  //旧导线终点由新导线ID和分割旧导线的导线ID组成

        //拆分路径
        let Cross_sub = 0;
        for (let i = 0; i < splited.way.length-1; i++) { //寻找交错点所在线段
            if((NodeCross[0] === splited.way[i][0]) && (NodeCross[0] === splited.way[i+1][0])) {
                if(((NodeCross[1] <= splited.way[i][1]) && (NodeCross[1] >= splited.way[i+1][1])) ||
                    ((NodeCross[1] >= splited.way[i][1]) && (NodeCross[1] <= splited.way[i+1][1])))
                { Cross_sub = i; break; }

            }else if ((NodeCross[1] === splited.way[i][1]) && (NodeCross[1] === splited.way[i+1][1])) {
                if(((NodeCross[0] <= splited.way[i][0]) && (NodeCross[0] >= splited.way[i+1][0])) ||
                    ((NodeCross[0] >= splited.way[i][0]) && (NodeCross[0] <= splited.way[i+1][0])))
                { Cross_sub = i; break; }
            }
        }
        devices.way.cloneWay(splited.way.slice(Cross_sub + 1));devices.way.unshift(NodeCross);
        splited.way.splice(Cross_sub+1,splited.way.length-Cross_sub-1);splited.way.push(NodeCross);

        //将新建的导线加入图纸中
        this.elementDOM.preappendTo($("#area-of-parts"));
        splited.render();
        splited.markSign();
        splited.focusOnly();
        devices.render();
        devices.markSign();
        devices.focusOnly();

        //改变图纸标记
        schMap.setSingleValueByOrigin(NodeCross, {
            form : "cross-point",
            id : this.id + " " + splited.id + " " + devices.id
        });
        devices.markSign();
    },
    //删除导线
    deleteSelf() {
        for(let i = 0; i < this.connect.length; i++) {
            if (this.getConnectStatus(i) === "line") {
                const lines = this.connect[i].split(" ").map((n) => partsAll.findPartObj(n));
                lines.forEach((n) => n.deleteConnect(this.id));
                if (lines.length === 2) lines[0].mergeLine(lines[1]);
            } else if (this.getConnectStatus(i) === "part") {
                const temp = this.connect[i].split("-"),
                    part = partsAll.findPartObj(temp[0]);
                part.connect[temp[1]] = false;
                part.noConnectPoint(temp[1]);
            }
        }
        this.way.standardize();
        this.deleteSign();
        this.elementDOM.remove();
        //attention:还要删除elementDOM数据
        partsAll.deletePart(this);
    },
    //生成导线路径
    setPath(event) {
        //图纸相关常量
        const gridL = this.current.gridL,
            enforceAlign = this.current.enforceAlign,
            mouseBias = this.current.mouseBias(event),
            mousePosition = this.current.mouse(event),
            endRound = mousePosition.round(),       //鼠标坐标四舍五入
            endFloor = mousePosition.floor(),       //鼠标坐标向下取整
            pointStatus = schMap.getSingleValueByOrigin(endRound),
            AlignPoint = (pointStatus.form === "cross-point" || pointStatus.form === "line-point"),
            AlignLine = (pointStatus.form === "line");

        //当鼠标移动了一格或者强制更新标志位为高时才会更新搜索路径
        if(enforceAlign.flag || (endFloor[0] !== gridL[0]) || (endFloor[1] !== gridL[1])) {
            const partObj = enforceAlign.part,      //强制对齐的器件
                temppoint = enforceAlign.label,     //更新前的对齐管脚
                nodeStart = this.current.startNode,
                initTrend = this.current.initTrend,
                endTrend = endFloor.toGrid();       //鼠标所在方格顶点坐标

            //强制对齐标志复位
            enforceAlign.label = false;
            enforceAlign.flag = false;

            //鼠标位于某器件之上，计算对应的对齐管脚
            if (enforceAlign.onPart) {
                const mouseVector = mousePosition.add(mouseBias).add(-1, partObj.position),
                    pointVector = partObj.pointRotate()
                        .map((item, index) => (partObj.connect[index]) ? false : item.position),
                    pointEnd = mouseVector.similar(pointVector);

                //允许直接对齐
                if (pointEnd) {
                    //有管脚可以强制对齐
                    const nodeEnd = partObj.position.add(pointEnd.value),
                        tempWay = AstartSearch(nodeStart, nodeEnd, initTrend, 1);

                    enforceAlign.label = partObj.id + "-" + pointEnd.sub;
                    tempWay.checkWayRepeat();
                    tempWay.checkWayExcess(initTrend, 2);
                    this.way.cloneWay(tempWay);
                    this.shrinkCircle(1);               //缩小导线终点的临时节点
                    partObj.enlargePoint(pointEnd.sub); //放大连接到的器件引脚
                }
                //上一次更新的器件引脚和当前不一样，那么就要缩小上一次更新的器件引脚
                if (temppoint && temppoint !== enforceAlign.label) {
                    const temp = temppoint.split("-");
                    partsAll.findPartObj(temp[0]).shrinkPoint(temp[1]);
                }
            }
            if(!enforceAlign.label) {   //没有强制对齐的记录
                const tempRound = this.current.mouseRound,                  //上一次鼠标所在方格属性
                    mouseRound = this.current.mouseRound = new WayMap(),    //当前鼠标所在方格属性引用
                    endPointFar = nodeStart.farest(endTrend).value;         //距离起点最远的点

                //第一遍是将上一次重复的链接过来并且扩展
                endTrend.forEach(function(item) {
                    let tempWay = tempRound.get(item);
                    if (tempWay) {
                        const wayExpand = tempWay.endExpand(endTrend, item, initTrend);
                        mouseRound.set(item, tempWay);
                        for(let i = 0; i < wayExpand.length; i++) {
                            mouseRound.set(wayExpand[i][0], wayExpand[i][1], "small");
                        }
                    }
                });
                //第二遍将会强制搜索距离起点最远的点的路径并扩展
                if(endPointFar) {
                    //路径搜索，模式1
                    const tempWay = AstartSearch(nodeStart, endPointFar, initTrend, 1);
                    tempWay.checkWayExcess(initTrend, 2);
                    mouseRound.set(endPointFar, tempWay);
                    const wayExpand = tempWay.endExpand(endTrend, endPointFar, initTrend);
                    for (let i = 0; i < wayExpand.length; i++) {
                        mouseRound.set(wayExpand[i][0], wayExpand[i][1], "small");
                    }
                }
                //第三遍搜索，如果还有空的位置那么重新搜索路径，并扩展
                endTrend.forEach(function(item) {
                    let tempWay = mouseRound.get(item);
                    if (!tempWay) {
                        //路径搜索，模式1
                        tempWay = AstartSearch(nodeStart, item, initTrend, 1);
                        tempWay.checkWayExcess(initTrend, 2);
                        mouseRound.set(item, tempWay);
                        const wayExpand = tempWay.endExpand(endTrend, item, initTrend);
                        for(let i = 0; i < wayExpand.length; i++) {
                            mouseRound.set(wayExpand[i][0], wayExpand[i][1], "small");
                        }
                    }
                });
                //如果上一次是直接对齐模式，那么就需要取消状态
                if (temppoint) {
                    const temp = temppoint.split("-");
                    partsAll.findPartObj(temp[0]).shrinkPoint(temp[1]); //缩小器件引脚
                    this.enlargeCircle(1);                              //放大导线终点的临时节点
                    this.current.enforceAlign = {                       //强制对齐模式数据复位
                        flag:false,
                        onPart:false,
                        part:false,
                        label:false
                    };
                }
            }
            //记录当前搜索框的定位点
            gridL[0] = Math.floor(mousePosition[0] / 20) * 20;
            gridL[1] = Math.floor(mousePosition[1] / 20) * 20;
        }

        //非直接对齐模式
        if(!this.current.enforceAlign.label) {
            //取出四点路径
            const mouseRound = this.current.mouseRound;

            if (AlignPoint) {
                //点对齐模式，取出鼠标坐标四舍五入之点的路径
                this.way.cloneWay(mouseRound.get(endRound));
                this.shrinkCircle(1);
            } else if (AlignLine) {
                //与鼠标四舍五入的点相连坐标集合与四方格坐标集合的交集
                const roundSet = pointStatus.connect
                    .map((item) => [item[0] * 20, item[1] * 20])
                    .filter((item) => mouseRound.has(item));

                if (!roundSet.length) {
                    //交集为空，那么路径被固定，且不随鼠标变化
                    this.way.cloneWay(mouseRound.get(endRound));
                } else {
                    //交集不为空，选择离鼠标最近的点
                    const closeToMouse = mousePosition.closest(roundSet).value,
                        mouseWay = mouseRound.get(endRound),
                        closeToMouseWay = mouseRound.get(closeToMouse);

                    if (mouseWay.isSame(closeToMouseWay)) {
                        //如果两个路径完全相等，那么路径被固定，且不随鼠标变化
                        this.way.cloneWay(mouseWay);
                    } else {
                        //终点和次终点的向量
                        const endvector = endRound.add(-1, closeToMouse),
                            lastvector = mouseWay[mouseWay.length - 2].add(-1, closeToMouseWay[closeToMouseWay.length - 2]);

                        if (endvector.isEqual(lastvector)) {
                            //终点和次终点的向量相同，那么选择节点多的为路径，且可以随着鼠标变化
                            if (mouseWay.length > closeToMouseWay.length) {
                                this.way.cloneWay(mouseWay);
                            } else {
                                this.way.cloneWay(closeToMouseWay);
                            }
                            if (this.way[this.way.length - 1][0] === this.way[this.way.length - 2][0]) {
                                //竖着的
                                this.way[this.way.length - 1][0] = mousePosition[0];
                                this.way[this.way.length - 2][0] = mousePosition[0];
                                this.way[this.way.length - 1][1] = endRound[1];
                            } else {
                                //横着的
                                this.way[this.way.length - 1][1] = mousePosition[1];
                                this.way[this.way.length - 2][1] = mousePosition[1];
                                this.way[this.way.length - 1][0] = endRound[0];
                            }
                        } else {
                            //固定路径，且不随鼠标变化
                            this.way.cloneWay(mouseWay);
                        }
                    }
                }
                this.shrinkCircle(1);
            } else {
                //一般模式，选择四方格内节点最多的
                this.way.cloneWay(this.current.mouseRound.nodeMax());

                if (this.way.length > 1) {
                    //判断当前方向
                    if (this.way[this.way.length - 1][0] === this.way[this.way.length - 2][0]) {
                        this.way[this.way.length - 2][0] = mousePosition[0];
                    } else {
                        this.way[this.way.length - 2][1] = mousePosition[1];
                    }
                }
                this.way[this.way.length - 1] = mousePosition;
                this.enlargeCircle(1);
            }
        }

        //如果存在旧路径，那么就直接复制旧路径
        if (this.current.oldStatus &&
            this.way[this.way.length - 1].isEqual(this.current.oldStatus.oldNode)) {
            this.way.cloneWay(this.current.oldStatus.oldWay);
        }
        this.wayDrawing();
    },
    //导线绘制结束
    drawLineEnd() {
        const mousePosition = Array.clone(this.way[this.way.length - 1]);   //导线的非标准终点
        this.way.standardize();     //导线路径标准化
        const tempPosition = Array.clone(this.way[this.way.length - 1]);    //导线终点
        //起点和终点相等，则删除当前导线
        if (tempPosition.isEqual(this.way[0])) {
            this.deleteSelf();
            return (false);
        }
        const tempstatus = schMap.getSingleValueByOrigin(tempPosition);
        switch(tempstatus.form) {
            case "part-point": {
                const temp = tempstatus.id.split("-"),
                    clickpart = partsAll.findPartObj(temp[0]),
                    pointmark = parseInt(temp[1]);

                if (!clickpart.connect[pointmark]) {                        //当前管脚为空
                    clickpart.shrinkPoint(pointmark);                       //取消器件引脚放大
                    clickpart.connectPoint(pointmark, this.id);             //器件端点指向导线ID，并禁止缩放
                    clickpart.toStatus("focus");                            //器件染色
                    this.setConnect(1, clickpart.id + "-" + pointmark);     //导线终点为单击到的器件的引脚
                    partsNow.push(clickpart);
                }
                break;
            }
            case "line-point": {
                const clickpart = partsAll.findPartObj(tempstatus.id);
                this.mergeLine(clickpart); //合并导线
                return (true);
            }
            case "line": {
                const clickpart = partsAll.findPartObj(tempstatus.id);
                this.splitLine(clickpart, 1);   //分割被点击的导线
                break;
            }
            case "cross-point": {
                const lines = schMap.getSingleValueByOrigin(tempPosition).id.split(" ").map((n) => partsAll.findPartObj(n));
                for (let i = 0; i < lines.length; i++) {
                    let connectSub;
                    if (tempPosition.isEqual(lines[i].way[0])) connectSub = 0;
                    else connectSub = 1;
                    lines[i].setConnect(connectSub, lines[i].connect[connectSub] + " " + this.id);
                }
                this.setConnect(1, tempstatus.id);
                break;
            }
            default: {
                if (!this.connect[0]) {
                    this.deleteSelf();
                    return (false);
                }
                const pointEnd = new Point(schMap.nodeRound(
                        tempPosition,
                        mousePosition,
                        schMap.getSingleValueByOrigin.bind(schMap)
                    )),
                    tempWay = AstartSearch(
                        this.way[0], pointEnd,
                        this.current.initTrend, 1
                    );

                tempWay.checkWayExcess(this.current.initTrend, 2);
                this.way.cloneWay(tempWay);
            }
        }
        this.current = {};
        this.render();          //结束绘制
        this.markSign();
    },
    //调整导线初始化
    reDraw(event, part, pointmark) {
        //图纸相关常量
        const SVG = this.current.SVG,
            zoom = this.current.zoom,
            mouseNode = [ Math.round((event.pageX - SVG[0]) / zoom / 20.0) * 20,
                Math.round((event.pageY - SVG[1]) / zoom / 20.0) * 20];

        this.toGoing();
        this.deleteSign(this.current.map);

        if(mouseNode.isEqual(this.way[0])) {    //当前点是导线起点，则导线需要反转
            this.reversal();
        }
        this.drawCircle(1);                     //终点转换为绘制状态
        this.current.extend({                        //临时变量
            startNode:Array.clone(this.way[0]), //起始节点
            mouseRound:new WayMap(),    //鼠标所在方格属性
            enforceAlign:{              //直接对齐模式
                flag:false,             //是否强制更新路径
                onPart:false,           //鼠标是否在某器件上面
                part:false,             //直接对齐的器件
                label:false             //直接对齐的坐标
            }
        });

        if (part !== undefined) {           //若是从某确定的连接点断开导线
            if(part instanceof Array) {     //断开器件是数组，说明是从交错节点断开
                for(let i = 0; i < part.length; i++) {
                    part[i].deleteConnect(this.id);
                }
            } else {
                part.noConnectPoint(pointmark);     //器件引脚悬空，允许缩放
            }
            this.current.oldStatus = {              //记录旧路径和连接关系
                oldNode : Array.clone(mouseNode),
                oldWay : Array.clone(this.way)
            };
        }

        const tempstatus = schMap.getSingleValueByOrigin(this.way[0]);
        if(tempstatus && tempstatus.form === "part-point") {    //导线出线方向为起点器件的引脚方向
            const tempArr = tempstatus.id.split("-"),
                temppart = partsAll.findPartObj(tempArr[0]),
                tempmark = parseInt(tempArr[1]),
                tempPointInfor = temppart.pointRotate();
            this.current.initTrend = directionhash[tempPointInfor[1][tempmark]];
        } else {
            this.current.initTrend = Math.vectorInit(this.way[0], this.way[1]);
        }

        this.focusOnly();               //器件染色
        this.shrinkCircle(1);           //导线终点缩小
        this.wayDrawing();              //导线绘制
    },
    //器件移动造成的导线初始化
    preMoveLine(start) {
        //当前点是导线终点，则导线需要反转
        if(start.isEqual(this.way[this.way.length - 1])) {
            this.reversal();
        }

        const tempX = this.way.map((n) => n[0]),
            tempY = this.way.map((n) => n[1]);

        this.toGoing();
        this.deleteSign();
        this.toStatus("focus");
        this.wayDrawing();

        this.current = {
            pathBackup : new LineWay(this.way),
            startRound : new WayMap(),
            startNode : new Point(start),
            gridL : [],
            wayNow : [],
            circle : [],
            wayRange : {
                maxX : Math.maxOfArray(tempX),
                minX : Math.minOfArray(tempX),
                maxY : Math.maxOfArray(tempY),
                minY : Math.minOfArray(tempY)
            }
        };
        if(this.getConnectStatus(1) === "line") {
            this.moveCircle(0, this.way[0]);
            this.moveCircle(1, this.way[this.way.length - 1]);
            this.current.circle = this.collectCircle(1);
        }
        //冻结部分关键属性
        Object.freezeAll(this.current.pathBackup);
        Object.freezeAll(this.current.wayRange);
    },
    //器件移动造成的导线变化
    moveToLine() {
        //当前导线起点的向下取整
        const map = schMap,
            start = this.current.startNode,
            startFloor = start.floor();
        
        //当起点记录移动了一格时更新搜索路径
        if ((startFloor[0] !== this.current.gridL[0]) || (startFloor[1] !== this.current.gridL[1])) {
            const startTrend = startFloor.toGrid(),         //四方格坐标
                pathBackup = this.current.pathBackup,       //备用路径
                initTrend = this.current.initTrend,         //初始方向
                tempRound = this.current.startRound,        //旧四方格路径键对
                mouseRound = this.current.startRound = new WayMap(),    //新四方格路径键对
                centerPoint = [                             //四方格中央坐标
                    Math.average(startTrend.map((n) => n[0])),
                    Math.average(startTrend.map((n) => n[1]))
                ],
                //计算当前终点
                insertSub = pathBackup.searchNodeSub(centerPoint),
                //根据当前终点截取部分导线
                wayEnd = (!pathBackup[insertSub + 1]) ?
                    pathBackup[insertSub] : [pathBackup[insertSub], pathBackup[insertSub + 1]],
                //距离终点/线最远的点
                startPointFar = startTrend.reduce(function(pre, next) {
                    if(nodeDistance(pre, wayEnd) > nodeDistance(next, wayEnd)) {
                        return (pre);
                    } else {
                        return (next);
                    }
                });

            //第一遍是将上一次重复的链接过来并且扩展
            startTrend.forEach(function(item) {
                let tempWay = tempRound.get(item);
                if (tempWay) {
                    const wayExpand = tempWay.startExpand(startTrend, item, initTrend);
                    mouseRound.set(item, tempWay);
                    for(let i = 0; i < wayExpand.length; i++) {
                        mouseRound.set(wayExpand[i][0], wayExpand[i][1], "small");
                    }
                }
            });
            //第二遍将会强制搜索距离起点最远的点的路径并扩展
            if(startPointFar) {
                const answay = AstartSearch(startPointFar, wayEnd, initTrend, 3);
                answay.checkWayExcess(initTrend, 3);
                const tempWay = new LineWay(pathBackup);  //复制路径
                tempWay.insert(answay, 0, insertSub + 1);
                tempWay.checkWayRepeat();
                mouseRound.set(startPointFar, tempWay);
                const wayExpand = tempWay.startExpand(startTrend, startPointFar, initTrend);
                for (let i = 0; i < wayExpand.length; i++) {
                    mouseRound.set(wayExpand[i][0], wayExpand[i][1], "small");
                }
            }
            //第三遍搜索，如果还有空的位置那么重新搜索路径，并扩展
            startTrend.forEach(function(item) {
                let tempWay = mouseRound.get(item);
                if (!tempWay) {
                    const answay = AstartSearch(item, wayEnd, initTrend, 3);
                    answay.checkWayExcess(initTrend, 3);
                    tempWay = new LineWay(pathBackup);  //复制路径
                    tempWay.insert(answay, 0, insertSub + 1);
                    tempWay.checkWayRepeat();
                    mouseRound.set(item, tempWay);
                    const wayExpand = tempWay.startExpand(startTrend, item, initTrend);
                    for(let i = 0; i < wayExpand.length; i++) {
                        mouseRound.set(wayExpand[i][0], wayExpand[i][1], "small");
                    }
                }
            });
            //备份原始路径
            this.current.wayNow = new LineWay(mouseRound.reduce(function (pre, next) {
                const preValue = pre[1].length - (!!map.getSingleValueByOrigin(pre[0]));
                const nextValue = next[1].length - (!!map.getSingleValueByOrigin(next[0]));
                if (preValue > nextValue) return (pre);
                else return (next);
            })[1]);
            //当前路径更新
            this.way.cloneWay(this.current.wayNow);
            //记录鼠标所在方格的位置
            this.current.gridL = Array.clone(startFloor);
        }
        //提取备份路径
        const backUp = this.current.wayNow;
        if (backUp.length > 1) {
            if (backUp[0][0] === backUp[1][0]) {
                this.way[1][0] = start[0];
            } else {
                this.way[1][1] = start[1];
            }
        }
        this.way[0] = start;
        this.wayDrawing();
    },
    //合并导线，保留this，删除Fragment
    mergeLine(Fragment) {
        if (this.way[0].isEqual(Fragment.way[0])) {
            this.way.reverse();
            this.connect.reverse();
        } else if (this.way[0].isEqual(Fragment.way[Fragment.way.length - 1])) {
            this.way.reverse();
            this.connect.reverse();
            Fragment.way.reverse();
            Fragment.connect.reverse();
        } else if (this.way[this.way.length - 1].isEqual(Fragment.way[Fragment.way.length - 1])) {
            Fragment.way.reverse();
            Fragment.connect.reverse();
        }
        schMap.setSingleValueByOrigin(this.way[this.way.length - 1], {
            form: "line"
        });
        this.way.cloneWay(this.way.concat(Fragment.way));
        this.way.checkWayRepeat();
        this.setConnect(1, Fragment.connect[1]);
        Fragment.replaceConnect(1, this.id);        //改变被删除导线终点连接器件的连接关系
        Fragment.elementDOM.remove();               //移除图中的DOM
        this.render();
        this.markSign();
        partsAll.deletePart(Fragment.id);           //在partsAll中删除导线
    },
    //将导线起点、终点的交错节点的DOM集合到current中
    collectCircle(Num) {
        if(this.getConnectStatus(Num) !== "line") return([]);
        const temp = this.connect[Num].split(" ");
        if (temp.length === 3) {
            return([this.circle[Num]]);
        } else if (temp.length === 2) {
            //交错节点坐标
            const crossPoint = Array.clone(this.way[Num * (this.way.length - 1)]);
            return (
                temp.map((n) => partsAll.findPartObj(n)).map((item) => item.circle[item.findConnect(crossPoint)])
            );
        }
        return(false);
    },
    //将导线起点/终点所连接导线重置
    setCollectCircle(Num) {
        if (this.getConnectStatus(Num) !== "line") return(false);
        const lines = this.connect[Num].split(" ");
        //备份路径的起/终点为旧交错节点
        const crossPointOld = this.current.pathBackup[Num * (this.current.pathBackup.length - 1)];
        //当前路径起/终点为新交错节点
        const crossPointNew = this.way[Num * (this.way.length - 1)];
        //新旧交错节点相等，连接关系不需要改变，函数返回
        if (crossPointOld.isEqual(crossPointNew)) return(true);

        if (lines.length === 2) {                               //只连接了两个器件，那么连接表不变，改变导线端点即可
            schMap.setSingleValueByOrigin(crossPointOld,{
                form: "line"
            });
            schMap.setSingleValueByOrigin(crossPointNew,{
                form: "cross-point",
                id: this.id
            });
            lines.forEach(function (n) {
                const line = partsAll.findPartObj(n);
                line.way.splice((line.findConnect(crossPointOld) * line.way.length), 0, Array.clone(crossPointNew));
                line.render();
                line.markSign();
            });
        } else if (lines.length === 3) {        //连接了三个器件，那么
            const crossPoint = this.way[Num * (this.way.length - 1)];        //当前路径起/终点为新交错节点
            lines.forEach(function(item) {
                const line = partsAll.findPartObj(item);
                line.deleteConnect(this.id);
            }.bind(this));
            const splited = partsAll.findPartObj(schMap.getSingleValueByOrigin(crossPoint).id);
            this.splitLine(splited, Num);
        }
    },
    //在图中标记导线
    markSign() {
        //标记并不会覆盖cross-point和part-point属性，需要在外部强制设定
        schMap.makeLineSign(this.id, this.way);
    },
    //删除导线标记
    deleteSign() {
        schMap.deleteLineSign(this.id, this.way);
    },
    //鼠标直接导致变形
    deformSelf(event) {
        //首次运行，准备参数
        if (!flagBit.movemouse) {
            this.toGoing();
            this.deleteSign();
            this.current = {
                pathBackup : Array.clone(this.way),
                startRound : new WayMap(),
                moveSub : this.way.nodeInWay([
                    (event.pageX - grid.SVGX) / grid.zoom,
                    (event.pageY - grid.SVGY) / grid.zoom
                ]),
                wayNow : [],
                circle : [this.collectCircle(0), this.collectCircle(1)],
                //记录最近的一次正确路径
                rightWay : new LineWay()
            };
            //当前线段是水平的那么为1，垂直的为0
            this.current.direction = Number(this.way[this.current.moveSub][1] === this.way[this.current.moveSub + 1][1]);
            //整个线段的属性
            this.current.segment = {
                //线段起点/终点向下取整的坐标
                nodeFloor: [],
                //完整线段起点和终点
                nodeMouse: [Array.clone(this.way[this.current.moveSub]), Array.clone(this.way[this.current.moveSub + 1])],
                //从路径起点到移动线段起点部分（不包括线段起点）
                startSegment: Array.clone(this.way.slice(0, this.current.moveSub)),
                //从移动线段终点到路径终点部分（不包括线段终点）
                endSegment: Array.clone(this.way.slice(this.current.moveSub + 2)),
                segmentRound : new WayMap()
            };
            //冻结部分关键属性
            Object.freezeAll(this.current.pathBackup);
            if(!this.current.segment.startSegment.length)
                this.current.segment.startSegment = [Array.clone(this.way[0])];
            if(!this.current.segment.endSegment.length)
                this.current.segment.endSegment = [Array.clone(this.way[this.way.length - 1])];
        }
        //鼠标的偏移量
        const bisa = [
            (event.pageX - grid.lastX) / grid.zoom,
            (event.pageY - grid.lastY) / grid.zoom
        ];
        //当前起点、终点
        const startNode = this.current.segment.nodeMouse[0];
        const endNode = this.current.segment.nodeMouse[1];
        const direction = this.current.direction;
        //坐标更新
        startNode[direction] += bisa[direction];
        endNode[direction] += bisa[direction];
        //起点向下取整的坐标
        const nodeFloor = [
            Math.floor(startNode[0] / 20) * 20,
            Math.floor(startNode[1] / 20) * 20
        ];
        //超过方格，更新路径
        if (!nodeFloor.isEqual(this.current.segment.nodeFloor)) {
            //当前线段起/终点所在方格顶点坐标更新
            const startTrend = [], endTrend = [];
            startTrend[0] = nodeFloor;
            if (direction) {
                startTrend[1] = [nodeFloor[0], nodeFloor[1] + 20];
                endTrend[0] = [endNode[0], startTrend[0][1]];
                endTrend[1] = [endNode[0], startTrend[1][1]];
            } else {
                startTrend[1] = [nodeFloor[0] + 20, nodeFloor[1]];
                endTrend[0] = [startTrend[0][0], endNode[1]];
                endTrend[1] = [startTrend[1][0], endNode[1]];
            }
            //取出数据
            const startWay = this.current.segment.startSegment;     //从路径起点到移动线段起点部分
            const endWay = this.current.segment.endSegment;         //从移动线段终点到路径终点部分
            const tempRound = this.current.segment.segmentRound;    //上一次鼠标所在方格属性
            this.current.segment.segmentRound = new WayMap();       //当前鼠标所在方格属性清空
            const mouseRound = this.current.segment.segmentRound;   //当前鼠标所在方格属性引用
            //枚举
            startTrend.forEach(function(item,index) {
                let tempWay = tempRound.get(item);
                if (!tempWay) {
                    //线段起点终点被器件占据
                    //线段起点终点被导线占据
                    //线段全部被器件占据
                    //线段全部被导线占据
                    //线段被分段之后哪一段跟随鼠标

                    //当前线段
                    const segment = [item, endTrend[index]];

                    const startVector = Math.vectorInit(startWay[startWay.length - 1], segment[0]);
                    const startToSegment = AstartSearch(
                        startWay[startWay.length - 1], segment,
                        startVector, 3
                    );
                    startToSegment.checkWayRepeat();
                    startToSegment.checkWayExcess(startVector, 3);

                    const endVector = Math.vectorInit(endWay[0], segment[1]);
                    const endToSegment = AstartSearch(
                        endWay[0], segment,
                        endVector, 3
                    );
                    endToSegment.checkWayRepeat();
                    endToSegment.checkWayExcess(endVector, 3);
                    endToSegment.reverse();

                    tempWay = new LineWay(startWay.concat(startToSegment, endToSegment , endWay));
                    tempWay.checkWayRepeat();

                    if(tempWay.length > 2) {
                        let tempStatus = schMap.getSingleValueByOrigin(tempWay[1]);
                        if (tempStatus && ((tempStatus.form === "line") || (tempStatus.form === "cross-point")))
                            tempWay.splice(0,1);
                        tempStatus = schMap.getSingleValueByOrigin(tempWay[tempWay.length - 2]);
                        if (tempStatus && ((tempStatus.form === "line") || (tempStatus.form === "cross-point")))
                            tempWay.pop();
                    }
                }
                mouseRound.set(item, tempWay);
            });
            let sub;
            if(mouseRound.get(startTrend[0]).length > mouseRound.get(startTrend[1]).length) {
                sub = 0;
                this.way.cloneWay(mouseRound.get(startTrend[0]));
            } else {
                sub = 1;
                this.way.cloneWay(mouseRound.get(startTrend[1]));
            }
            const start = startTrend[sub];
            const end = endTrend[sub];
            const temp = 1 - direction;
            for(let i = 0; i < this.way.length - 1; i++)
                if ((this.way[i][1 - temp] === this.way[i + 1][1 - temp]) && (this.way[i][1 - temp] === start[1 - temp])) {
                    if (((this.way[i][temp] <= start[temp]) && (this.way[i + 1][temp] <= start[temp]) && (this.way[i][temp] >= end[temp]) && (this.way[i + 1][temp] >= end[temp])) ||
                        ((this.way[i][temp] >= start[temp]) && (this.way[i + 1][temp] >= start[temp]) && (this.way[i][temp] <= end[temp]) && (this.way[i + 1][temp] <= end[temp]))) {
                        this.current.moveSub = i;
                        break;
                    }
                }
            //记录当前方格位置
            this.current.segment.nodeFloor = nodeFloor;
        }
        const moveSub = this.current.moveSub;
        this.way[moveSub][direction] = startNode[direction];
        this.way[moveSub + 1][direction] = startNode[direction];
        this.wayDrawing();
        for(let k = 0; k < 2; k++) {
            const tempcircle = this.current.circle[k];
            for(let i = 0; i < tempcircle.length; i++) {
                tempcircle[i].setAttribute("transform",
                    "translate(" + this.way[k * (this.way.length - 1)].join(",") + ")");
            }
        }
        grid.lastX = event.pageX;
        grid.lastY = event.pageY;
    },
    //鼠标变形结束
    deformSelfEnd() {
        this.way.standardize();
        this.setCollectCircle(0);
        this.setCollectCircle(1);
        this.render();
        this.markSign();
    },
    //按照标准格式输出
    toSimpleData() {
        let ans = "{ partType: \"line\", way:[";
        for(let i = 0; i < this.way.length - 1; i++) {
            ans += "[" + this.way[i].join(",") + "],";
        }
        ans += "[" + this.way[this.way.length - 1].join(",") + "]] },";
        return(ans);
    }
};

export { LineClass };

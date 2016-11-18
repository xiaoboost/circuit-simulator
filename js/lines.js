"use strict";

import { $ } from "./jquery";
import { Point } from "./point";
import { schMap } from "./maphash";
import { partsAll, partsNow } from "./collection";

//常量
const SVG_NS = "http://www.w3.org/2000/svg",
    actionArea = $("#area-of-parts"),
    rotate = [
        [[1, 0], [0, 1]],   //同相
        [[0, 1], [-1, 0]],  //顺时针
        [[0, -1], [1, 0]],  //逆时针
        [[-1, 0], [0, -1]]  //反相
    ];

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
//搜索用的临时图纸模块
function SearchMap() {
    const self = {}, map = {};

    self.setValue = function(node, value) {
        if (!map[node[0]]) {
            map[node[0]] = [];
        }
        map[node[0]][node[1]] = value;
    };
    self.getValue = function(node) {
        if(!map[node[0]] || !map[node[0]][node[1]]) {
            return(false);
        }
        return (map[node[0]][node[1]]);
    };

    return(self);
}
//搜索用的规则集合模块
function SearchRules(nodestart, nodeend, mode) {
    const self = {};

    //变量保存在闭包中
    const start = nodestart.mul(0.05),
        end = Array.clone(nodeend, 0.05),
        small = "small";
    let excludeParts = "",
        excludeLines = [],
        endLine = [];

    //点到点或线的最短距离
    function nodeDistance(node, end) {
        if(end[0].length) {
            //end是线段
            //垂直为1，水平为0
            const sub = +(end[0][1] !== end[1][1]);
            if (((node[sub] <= end[0][sub]) && (node[sub] >= end[1][sub])) ||
                ((node[sub] >= end[0][sub]) && (node[sub] <= end[1][sub]))) {
                //node在线段x或y轴范围内
                return(Math.abs(node[1 - sub] - end[0][1 - sub]));
            } else {
                //否则，取线段起点或终点中和node距离小的
                return(Math.min(
                    Math.abs(node[0] - end[0][0]) + Math.abs(node[1] - end[0][1]),
                    Math.abs(node[0] - end[1][0]) + Math.abs(node[1] - end[1][1])
                ));
            }
        } else {
            //end是点
            return(Math.abs(node[0] - end[0]) + Math.abs(node[1] - end[1]));
        }
    }

    //返回node所在器件
    function excludePart(node) {
        const status = schMap.getSingleValueBySmalle(node);
        if(status.form === "part") {
            return status.id;
        } else if(status.form === "part-point") {
            return status.id.split("-")[0];
        } else {
            return "";
        }
    }
    //返回node所在的线段
    function excludeLine(node) {
        const status = schMap.getSingleValueBySmalle(node);
        if(status &&
            status.form === "line" ||
            status.form === "cross-node") {
            const ans = [];
            for(let i = 0; i < 2; i++) {
                const temp = [[1,0],[-1,0],[0,-1],[0,1]],
                    limit = [
                        schMap.alongTheLineBySmall(node, false, temp[i * 2]),
                        schMap.alongTheLineBySmall(node, false, temp[i * 2 + 1]),
                    ];
                if(!limit[0].isEqual(limit[1])) {
                    ans.push(limit);
                }
            }
            return (ans);
        } else {
            return [];
        }
    }

    //价值估算
    //node到终点（线）距离 + 拐弯数量
    function calValue01(node) {
        return (
            nodeDistance(node.point, end) +
            node.junction
        );
    }
    //node到终点（线）的距离*3 + 拐弯的数量*3 + node到起点的距离
    function calValue02(node) {
        return (
            nodeDistance(node.point, end) * 3 +
            node.junction * 3 +
            nodeDistance(node.point, start)
        );
    }

    //搜索结束规则
    //node是否在某线段内
    function nodeInLine(node, line) {
        if(line[0][0] === line[1][0] && line[0][0] === node[0]) {
            return(node[1] >= line[0][1] && node[1] <= line[1][1]);
        } else if(line[0][1] === line[1][1] && line[0][1] === node[1]) {
            return(node[0] >= line[0][0] && node[0] <= line[1][0]);
        }
    }
    //是否在终点等效的线段中
    function checkEndEqLine(node) {
        for(let i = 0; i < endLine.length; i++) {
            if(nodeInLine(node, endLine[i])) {
                return(endLine[i]);
            }
        }
        return(false);
    }
    //等于终点
    function checkEndNode(node) {
        return node.point.isEqual(end);
    }
    //在终线范围内
    function checkEndLine(node) {
        return nodeInLine(node.point, end);
    }
    //点对点（在导线中）搜索的结束判断
    function checkNode2NodeLine(node) {
        //是否在终点等效线段中
        const exLine = checkEndEqLine(node);
        if(!exLine) { return false; }

        //所在等效线段方向和当前节点的关系
        if((new Point(exLine)).isParallel(node.vector)) {
            //等效线段和当前节点方向平行
            return true;
        } else {
            //等效线段和当前节点方向垂直
            if(node.expand) {
                return node.point.isEqual(end);
            } else {
                return true;
            }
        }
    }

    //节点扩展规则
    //点到空
    function exRuleNode2Space(node, last) {
        const status = schMap.getSingleValueBySmalle(node.point);
        if (!status) {
            //空节点
            return true;
        } else if (status.form === "part") {
            //器件节点
            return false;
        } else if (status.form === "part-point") {
            //当前节点在引脚时在终点周围距离为1的地方都可行
            return(nodeDistance(node.point, end) < 2);
        } else if (status.form === "line" || status.form === "cross-point") {
            //当前节点在导线上，last不可以在相同的导线上
            return(!schMap.nodeInConnectBySmall(node.point, last.point));
        } else {
            return (true);
        }
    }
    //直接对齐
    function exRuleNodeAlign(node, last) {
        const status = schMap.getSingleValueBySmalle(node.point);
        if (!status) {
            return true;
        } else if (status.form === "part") {
            return false;
        } else if (status.form === "part-point") {
            //直接对齐时，器件引脚只能等于终点
            return(node.point.isEqual(end));
        } else if (status.form === "line" || status.form === "cross-point") {
            return(!schMap.nodeInConnectBySmall(node.point, last.point));
        } else {
            return (true);
        }

    }
    //排除需要排除的部分
    function exRuleExclude(node, last) {
        const status = schMap.getSingleValueBySmalle(node.point);
        if (!status) {
            return(true);
        } else if (status.form === "part") {
            return(status.id === excludeParts);
        } else if (status.form === "part-point") {
            return(status.id.split("-")[0] === excludeParts ||
                nodeDistance(node.point, end) < 2);
        } else if (status.form === "line" || status.form === "cross-point") {
            return(!schMap.nodeInConnectBySmall(node.point, last.point));
        } else {
            return (true);
        }

    }

    //起点和终点是否可以不需要搜索
    if(Point.isPoint(nodeend)) {
        if(!nodeend.isStandarNode()) {
            throw("终点格式错误");
        }
        //起点和终点相等，返回起点
        if(start.isEqual(end)) {
            return(new LineWay([nodestart]));
        }
    } else if(Point.isVector(nodeend)) {
        if(!nodeend.every((n) => Point.prototype.isStandarNode.call(n))) {
            throw("终线段格式错误");
        }
        //起点就在终线段内，返回起点
        if (nodeInLine(start, end)) {
            return(new LineWay([nodestart]));
        }
    }

    //根据输入的模式设定检查函数
    switch(mode.process) {
        case "draw": {
            //根据终点属性来分类
            const status = schMap.getSingleValueBySmalle(end);
            if (!status) {
                //空点
                self.checkPoint = exRuleNode2Space;
                self.checkEnd = checkEndNode;
            } else if(status.form === "line") {
                //导线
                endLine = excludeLine(end);
                self.checkPoint = exRuleNodeAlign;
                self.checkEnd = checkNode2NodeLine;
            } else if(status.form === "cross-point") {
                //交错节点
                endLine = excludeLine(end);
                if(status.connect.length === 3) {
                    self.checkPoint = exRuleNodeAlign;
                    self.checkEnd = checkNode2NodeLine;
                } else if(status.connect.length === 4) {
                    //交错节点连接了4个导线时，此终点是不可能达到的，此时的规则还没考虑好，先暂定和3个导线时一样
                    self.checkPoint = exRuleNodeAlign;
                    self.checkEnd = checkNode2NodeLine;
                }
            } else if(status.form === "part-point") {
                //器件引脚
                self.checkPoint = exRuleNodeAlign;
                self.checkEnd = checkEndNode;
            } else if(status.form === "part") {
                //器件本体
                excludeParts = excludePart(end);
                self.checkPoint = exRuleNode2Space;
                self.checkEnd = exRuleExclude;
            }
            //绘制模式下，节点估值
            self.calValue = calValue01;
        }
        default: {

        }
    }

    //当前点扩展点数
    self.expandNumber = function(node) {
        //如果当前扩展点在某导线上且该点不是排除点，那么只允许直行
        if (schMap.isLine(node)) {
            if(this.nodeInLine(node, excludeLines)) {
                return (3);
            } else {
                return (1);
            }
        } else {
            return (3);
        }
    };

    //返回模块
    return(self);
}
//搜索用的堆栈模块
function SearchStack(nodestart, vector, map) {
    const self = {}, start = nodestart.mul(0.05), stack = [];

    stack[0] = [];
    stack[0][0] = {
        point: start,
        vector: vector,
        junction: 0,
        value: 0,
        parent: false,
        straight: true,
        junctionNode: false,
    };
    map.setValue(start, stack[0][0]);

    self.openSize = 1;
    self.closeSize = 0;
    self.pop = function() {
        for (let i in stack) {
            if(stack.hasOwnProperty(i)) {
                const temp = stack[i].pop();
                if (!stack[i].length) {
                    delete stack[i];
                }
                self.openSize --;
                self.closeSize ++;
                return(temp);
            }
        }
    }
    self.push = function(node) {
        let expandFlag = true;
        const status = map.getValue(node.point);

        if (status) {
            //如果当前扩展的节点已经搜索过则需要对比，保留value较小的
            if(node.value > status.value) {
                expandFlag = false;
            } else if(stack[status.value]) {
                for(let j = 0; j < stack[status.value].length; j++) {
                    if (status === stack[status.value][j]) {
                        stack[status.value].splice(j, 1);
                        if (!stack[status.value].length) {
                            delete stack[status.value];
                        }
                        break;
                    }
                }
            }
        }
        if (expandFlag) {
            //按照估值大小，将新扩展的点插入open堆栈
            if (!stack[node.value]) {
                stack[node.value] = [];
            }
            stack[node.value].push(node);
            map.setValue(node.point, node);
            self.openSize ++;
        }
    }
    self.get = function(i, j) {
        if(!stack[i] || !stack[i][j]) {
            return (false);
        } else {
            return(stack[i][j]);
        }
    }

    return(self);
}
//方格路径搜索
function SearchGrid(start, end, mouse, vector, opt) {
    const mouseRound = new WayMap(),
        grid = (start[0] instanceof Point) ? start : end;

    //第一次检测上次搜索的是否有重复
    mouse.forEach((node, way) => {
        for(let i = 0; i < grid.length; i++) {
            if(node.isEqual(grid[i])) {
                mouseRound.set(node, way);
            }
        }
    });
    //第二次搜索空的节点
    for(let i = 0; i < grid.length; i++) {
        const node = grid[i];
        if(!mouseRound.get(node)) {
            if(start[0] instanceof Point) {
                mouseRound.set(node, AStartSearch(node, end, vector, opt).checkWayExcess());
            } else {
                mouseRound.set(node, AStartSearch(start, node, vector, opt).checkWayExcess());
            }
        }
    }

    return(mouseRound);
}
//A*路径搜索
function AStartSearch(start, end, vector, opt) {
    //初始化
    const map = SearchMap(),
        check = SearchRules(start, end, opt),
        stackopen = SearchStack(start, vector, map);

    //检查checkNode是否有结束标记
    if(check instanceof LineWay) {
        return(check);
    }

    //计算初始值的估值
    //stackopen.get(0, 0).value = check.calValue(stackopen.get(0, 0));

    //结束标记
    let endFlag = false, endStatus;
    //A*搜索，少于1000个节点
    while((!endFlag)&&(stackopen.closeSize < 1000)) {
        //open栈栈顶元素弹出作为当前节点
        const nodenow = stackopen.pop(),
            expandCount = check.expandNumber(nodenow.point);

        mapTest.point(nodenow.point, "#2196F3", 20);

        for (let i = 0; i < expandCount; i++) {
            let nodexpand = newNode(nodenow, rotate[i]);

            mapTest.point(nodexpand.point, "#000000", 20);

            //检查当前扩展点是否满足扩展要求，不满足就跳过
            if (!check.checkPoint(nodexpand, nodenow)) {
                //直行时遇到障碍物
                nodenow.straight = (!i) ? false : nodenow.straight;
                continue;
            }

            nodexpand.junction = nodenow.junction + (!!i);
            nodexpand.parent = nodenow;
            nodexpand.straight = true;
            nodexpand.junctionNode = i ? nodenow : nodenow.junctionNode;
            nodexpand.value = check.calValue(nodexpand);
            stackopen.push(nodexpand);

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

    mapTest.clear();

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
//搜索函数
const Search = {
    draw: {
        start: function(event, part, mark) {
            /*
             * 包含三种情况：
             *   1. 从已有导线的器件引脚开始
             *   2. 从交错节点开始
             *   3. 从临时节点开始
             */

            const grid = this.current,
                mouse = grid.mouse(event),
                mouseRound = mouse.round();

            //当前点是导线起点，则导线需要反转
            if(mouseRound.isEqual(this.way[0])) {
                this.reversal();
            }
            //临时变量
            this.current.extend({
                startNode: new Point(this.way[0]),
                mouseGrid: new WayMap(),
                enforceAlign: {},
                oldStatus: {
                    oldNode: new Point(mouseRound),
                    oldWay: new LineWay(this.way)
                }
            });

            this.toFocus();
            this.drawCircle(1);
            this.toGoing();
            this.deleteSign();

            //相关器件断开与当前导线的连接
            if(part && part.elementDOM) {
                //器件引脚
                part.noConnectPoint(mark);
            } else if(part instanceof Array) {
                //交错节点
                for(let i = 0; i < part.length; i++) {
                    part[i].deleteConnect(this.id);
                }
            } else {
                //临时节点不需要记录旧路径
                this.current.oldStatus = null;
            }

            //计算当前导线的初始方向
            const tempstatus = schMap.getSingleValueByOrigin(this.way[0]);
            if(tempstatus && tempstatus.form === "part-point") {
                //导线出线方向为起点器件的引脚方向
                const tempArr = tempstatus.id.split("-"),
                    tempmark = tempArr[1],
                    temppart = partsAll.findPartObj(tempArr[0]),
                    tempPointInfor = temppart.pointRotate();
                this.current.initTrend = tempPointInfor[tempmark].direction;
            } else {
                //非器件，则初始方向为旧路径的第一个线段的方向
                this.current.initTrend = new Point(this.way.slice(0,2)).toUnit();
            }
        },
        callback: function(event) {
            //预处理
            const gridL = this.current.gridL,
                enforceAlign = this.current.enforceAlign,
                mouseBias = this.current.mouseBias(event),
                mousePosition = this.current.mouse(event),
                mouseRound = mousePosition.round(),
                mouseFloor = mousePosition.floor(),
                pointStatus = schMap.getSingleValueByOrigin(mouseRound),
                option = {process: "draw"};

            let lastConnect = false;

            //鼠标当前状态
            if(pointStatus.form === "line-point" || pointStatus.form === "cross-point" && pointStatus.connect.length === 3) {
                option.preStatus = "point";
            } else if(pointStatus.form === "line" || pointStatus.form === "cross-point" && pointStatus.connect.length === 4) {
                option.preStatus = "line";
            } if(enforceAlign.label && enforceAlign.onPart) {
                option.preStatus = "align";
            } else {
                option.preStatus = "space";
            }

            //当鼠标移动了一格或者强制更新标志位为高时更新搜索路径
            if(enforceAlign.flag || (mouseFloor[0] !== gridL[0]) || (mouseFloor[1] !== gridL[1])) {
                //上次的连接点
                lastConnect = enforceAlign.label;
                //强制对齐标志复位
                enforceAlign.label = false;
                enforceAlign.flag = false;
                //准备方格数据
                const partObj = enforceAlign.part,
                    nodeStart = this.current.startNode,
                    initTrend = this.current.initTrend;
                let endGrid = mouseFloor.toGrid();

                //在器件上，需要与器件引脚对齐
                if(enforceAlign.onPart) {
                    const mouseVector = mousePosition.add(mouseBias).add(-1, partObj.position),
                        pointVector = partObj.pointRotate()
                            .map((item, index) => (partObj.connect[index]) ? false : item.position),
                        pointEnd = mouseVector.similar(pointVector);
                    //允许直接对齐
                    if (pointEnd) {
                        const nodeEnd = partObj.position.add(pointEnd.value);
                        option.preStatus = "align";
                        endGrid = [nodeEnd];
                        enforceAlign.label = { part: partObj, sub: pointEnd.sub, node: nodeEnd };
                    }
                }
                //更新路径
                this.current.mouseGrid = SearchGrid(nodeStart, endGrid, this.current.mouseGrid, initTrend, option);

                //记录当前搜索框的定位点
                gridL[0] = Math.floor(mousePosition[0] / 20) * 20;
                gridL[1] = Math.floor(mousePosition[1] / 20) * 20;
            }

            //后处理
            const mouseGrid = this.current.mouseGrid;
            if(lastConnect) {
                lastConnect.part.shrinkPoint(lastConnect.sub);
            }
            switch(option.preStatus) {
                case "line": {
                    //鼠标在某导线上
                    //与鼠标四舍五入的点相连坐标集合与四方格坐标集合的交集
                    const roundSet = pointStatus.connect
                        .map((item) => [item[0] * 20, item[1] * 20])
                        .filter((item) => mouseGrid.has(item));
                    if(roundSet.length) {
                        //交集不为空
                        //交集中离鼠标最近的点
                        const closest = mousePosition.closest(mouseGrid.keys()),
                            mouseRoundWay = mouseGrid.get(mouseRound);

                        if(!mouseRoundWay.isSame(mouseGrid.get(closest))) {
                            this.way.clone(mouseRoundWay);
                            this.way.endToLine(mouseRound, closest);
                            break;
                        }
                    }
                }
                case "point":
                case "align": {
                    //与点对齐模式
                    if(enforceAlign.label) {
                        enforceAlign.label.part.enlargePoint(enforceAlign.label.sub);
                        this.way.cloneWay(mouseGrid.get(enforceAlign.label.node));
                    } else {
                        this.way.cloneWay(mouseGrid.get(mouseRound));
                    }
                    this.shrinkPoint(1);
                    break;
                }
                default: {
                    //鼠标当前为空
                    this.way.cloneWay(mouseGrid.nodeMax());
                    this.way.endToMouse(mousePosition);
                    this.enlargePoint(1);
                }
            }
            //绘制导线
            this.wayDrawing();
        },
        end: function() {
            const start = this.way[0],
                initTrend = this.current.initTrend,
                mouse = this.way.get(-1),
                mouseRound = mouse.round(),
                status = schMap.getSingleValueByOrigin(mouseRound);

            //以mouseRound为中心寻找可行的点，并重新搜索路径
            function newLineWay() {
                const end = new Point(schMap.nodeRound(mouseRound, mouse,
                    schMap.getSingleValueByOrigin.bind(schMap)
                ));
                return(
                    AStartSearch(start, end, initTrend, {process:"draw"})
                        .checkWayExcess(initTrend)
                );
            }

            //起点和终点相等或者只有一个点，则删除当前导线
            if (this.way.length < 2 || mouseRound.isEqual(this.way[0])) {
                this.deleteSelf();
                return (false);
            }

            //根据终点分类来确定导线的结局
            switch(status.form) {
                case "part-point": {
                    //器件引脚
                    const temp = status.id.split("-"),
                        clickpart = partsAll.findPartObj(temp[0]),
                        pointmark = parseInt(temp[1]);

                    if (!clickpart.connect[pointmark]) {
                        clickpart.shrinkPoint(pointmark);
                        clickpart.connectPoint(pointmark, this.id);
                        clickpart.toFocus();
                        this.setConnect(1, clickpart.id + "-" + pointmark);
                    } else {
                        //此点已经被占用
                        this.way.cloneWay(newLineWay());
                    }
                    break;
                }
                case "line-point": {
                    const clickpart = partsAll.findPartObj(status.id);
                    this.mergeLine(clickpart);
                    return (true);
                }
                case "line": {
                    const clickpart = partsAll.findPartObj(status.id);
                    this.splitLine(clickpart, 1);
                    break;
                }
                case "cross-point": {
                    const lines = schMap.getSingleValueByOrigin(status).id.split(" ")
                        .map((n) => partsAll.findPartObj(n));

                    if (lines.length === 3) {
                        for (let i = 0; i < 3; i++) {
                            const sub = mouseRound.isEqual(lines[i].way[0]) ? 0 : 1;
                            lines[i].setConnect(sub, lines[i].connect[sub] + " " + this.id);
                        }
                        this.setConnect(1, status.id);
                    } else if (lines.length === 4) {
                        //连接了四个导线，此点不可用
                        this.way.cloneWay(newLineWay());
                    }
                    break;
                }
                default: {
                    if (!this.connect[0]) {
                        this.deleteSelf();
                        return (false);
                    }
                    this.way.cloneWay(newLineWay());
                }
            }

            this.current = {};
            this.render();
            this.markSign();
        }
    },
    singlePart: {

    },
    moreParts: {

    },
    deformation: {

    }
};

//导线路径类
function LineWay(way) {
    this.length = 0;
    if (way instanceof Array) {
        for (let i = 0; i < way.length; i++) {
            this.push(new Point(way[i]));
        }
    }
}
LineWay.prototype = {
    constructor: LineWay,
    push(node) {
        this[this.length++] = new Point(node);
        return(this.length);
    },
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
        return(this);
    },
    //去除路径冗余
    checkWayExcess(trend, mode) {
        if (this.length <= 3) {
            return(this);
        }
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
        return(this);
    },
    //给路径添加插入一个数组方法
    //向this数组的sub下标中插入tempArray数组，并且删除sub下标开始长度为len的数据
    insert(tempArray,sub,len = 0) {
        this.splice(sub, len);
        for (let i = 0; i < tempArray.length; i++)
            this.splice(sub + i, 0, tempArray[i]);
    },
    //复制路径，将会抛弃原路径数据的全部引用，也不会引用被复制的数据
    cloneWay(tempway) {
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
    //终点指向指定坐标
    endToMouse(node) {
        if (this.length > 1) {
            //判断当前方向
            if (this[this.length - 1][0] === this[this.length - 2][0]) {
                this[this.length - 2][0] = node[0];
            } else {
                this[this.length - 2][1] = node[1];
            }
        }
        this[this.length - 1] = node;
    },
    //终点指向指定线段
    endToLine(start, end) {

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
//只接受Point实例作为键，以及LineWay实例的键值
function WayMap(pair) {
    if(pair instanceof Array) {
        this.size = pair.length;
        for (let i = 0; i < pair.length; i++) {
            const [key,value] = pair[i][0];
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
WayMap.extend({
    checkKeyError(key) {
        if((!key instanceof Point) || (!key.isEqual(key.floor()))) {
            throw("键必须是Point实例，且坐标为20的倍数");
        }
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
        if(parseInt(hash) !== parseFloat(hash)) {
            throw("内部Hash值必须是整数");
        }
        const ans = [], temp = hash % 100;
        ans[1] = temp * 20;
        ans[0] = (hash - temp) * 0.2;
        return(new Point(ans));
    }
});
WayMap.prototype = {
    constructor: WayMap,
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
        for(let i in this) {
            if(this.hasOwnProperty(i)) {
                callback(WayMap.hashToKey(i), this[i], this);
            }
        }
    },
    /*
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
    */
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
            mouseGrid: new WayMap(),
            enforceAlign: {     //直接对齐模式
                flag:false,     //是否强制更新路径
                onPart:false,   //鼠标是否在某器件上面
                part:false,     //直接对齐的器件
                label:false     //直接对齐的坐标
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
    shrinkPoint(Num) {
        $("circle", this.circle[Num]).attr("style", "r:4");
    },
    //放大节点
    enlargePoint(Num) {
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
    //器件高亮
    toFocus() {
        this.elementDOM.addClass("focus");
        partsNow.push(this);
    },
    //器件取消高亮
    toNormal() {
        this.elementDOM.removeClass("focus");
        partsNow.deletePart(this);
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
    },
    //导线路径开始
    startPath(event, opt, ...args) {
        Search[opt].start.call(this, event, ...args);
    },
    //生成导线路径
    setPath(event, opt) {
        Search[opt].callback.call(this, event);
    },
    //导线路径结束
    endPath(event, opt) {
        Search[opt].end.call(this, event);
    }
};

export { LineClass };

"use strict";
import { $ } from "./jquery";
import { schMap } from "./maphash";
import { partsAll, partsNow } from "./collection";
import { PartClass } from "./parts";
import { LineClass } from "./lines";

//由数据绘制图纸
function loadData(data) {
    //第一遍，加载器件和设置
    for(let i = 0; i < data.length; i++) {
        if ((data[i].partType !== "line") && (data[i].partType !== "config")) {
            const device = new PartClass(data[i]);
            device.elementDOM.attr("opacity", 1);
            device.markSign();
        } else if (data[i].partType === "config"){
            for(let j in data[i]) if(data[i].hasOwnProperty(j)) {
                if(j === "partType") continue;
                $('#' + j).prop("value", data[i][j]);
            }
        }
    }
    //第二遍，加载导线
    for(let i = 0; i < data.length; i++) {
        if(data[i].partType === "line") {
            const devices = new LineClass(data[i].way[0]);
            for(let j = 1; j < data[i].way.length; j++) {
                devices.way.push(data[i].way[j]);
            }
            devices.current = [0,[],[],[],[],[],false,false,[]];
            devices.toGoing();
            partsNow.push(devices);
            for(let j = 0; j < 2; j++) {
                const node = devices.way[j * (devices.way.length - 1)];
                const nodeStatus = schMap.getSingleValueByOrigin(node);
                if(nodeStatus.form === "part-point") {
                    //器件引脚
                    const connectpart = partsAll.findPartObj(nodeStatus.id.slice(0, nodeStatus.id.search("-")));
                    connectpart.connectPoint(nodeStatus.id.slice(nodeStatus.id.search("-") + 1), devices.id);
                    devices.setConnect(j, nodeStatus.id);
                } else if (nodeStatus.form === "line-point") {
                    //导线临时节点
                    //在临时节点相交，那么此点必定是交错节点
                    nodeStatus.form = "cross-point";
                    nodeStatus.id += " " + devices.id;
                } else if (nodeStatus.form === "cross-point") {
                    //交错节点
                    nodeStatus.id += " " + devices.id;
                }
            }
            devices.render();
            devices.markSign();
        }
    }
    //第三遍，扫描图纸的交错节点
    for(let i in schMap) if(schMap.hasOwnProperty(i)) {
        for (let j in schMap[i]) if(schMap[i].hasOwnProperty(j)){
            const nodeStatus = schMap[i][j];
            if(nodeStatus.form === "cross-point") {
                //查询所有连接的导线
                const node = [parseInt(i) * 20, parseInt(j) * 20],
                    lines = nodeStatus.id.split(" ").map(function(item){
                        const line = partsAll.findPartObj(item),
                            sub = line.findConnect(node);
                        return([line,sub]);
                    });
                for(let k = 0; k < lines.length; k++) {
                    const lineconnect = (nodeStatus.id.search(lines[k][0].id + " ") !== -1)
                        ? nodeStatus.id.replace(lines[k][0].id + " ", "")
                        : nodeStatus.id.replace(" " + lines[k][0].id, "");
                    lines[k][0].setConnect(lines[k][1], lineconnect);
                }
            }
        }
    }
}

const SVG_NS = "http://www.w3.org/2000/svg",
    schematic = $("#area-of-parts");

//图纸测试
function MapTest() {
    this.test = $("#container-grid > svg > #area-of-parts").append($("<g>", SVG_NS, {
        "id": "maptest"
    }));
}
MapTest.prototype = {
    point([x, y], color = "#00ff00" ,Mul = 1, r = 3) {
        this.test.append($("<circle>", SVG_NS, {
            "stroke-width": "3",
            "fill": "transparent",
            "stroke": color,
            "transform": "translate(" + (x * Mul) + "," + (y * Mul) + ")",
            "cx": "0",
            "cy": "0",
            "r": r,
            "class": "testPoint"
        }));
    },
    path(way,color = "#ff0000") {
        let wayData = "M" + way[0].join(",");
        for (let i = 1; i < way.length; i++) {
            wayData += "L" + way[i].join(",");
        }
        this.test.append($("<path>", SVG_NS, {
            "stroke-width": "2",
            "fill": "transparent",
            "stroke": color,
            "d": wayData,
            "class": "testPath"
        }));
    },
    text([x,y], text) {
        this.test.append($("<text>", SVG_NS, {
            x: x,
            y: y,
            fill: "#3B4449",
            "stroke-width": "0",
            "font-size": "14"
        })).text(text);
    },
    clear(className) {
        switch (className) {
            case "Point" :
                this.test.childrens(".testPoint").remove();
                return true;
            case "Path" :
                this.test.childrens(".testPath").remove();
                return true;
            case undefined :
                this.test.childrens().remove();
                return true;
            default :
                return(false);
        }
    },
    whole() {
        let countx = 0;
        for (let i = 0; i < partsAll.length; i++) if (partsAll[i].partType === "line") {
            this.text(
                [1000, countx * 25 + 50],
                partsAll[i].connect[0] + "　--->　" + partsAll[i].id + "　--->　" + partsAll[i].connect[1]
            );
            countx ++;
        }
        countx ++;
        for (let i in schMap) if(schMap.hasOwnProperty(i)) {
            for (let j in schMap[i]) if (schMap[i].hasOwnProperty(j)) {
                let tempstatus = schMap[i][j];
                if (tempstatus.form === "part-point") {
                    //红色
                    this.point([i, j], "#ff0000", 20, 4);
                } else if (tempstatus.form === "part") {
                    //黑色
                    this.point([i, j], "#000000", 20, 4);
                }
                if (tempstatus.connect) {
                    for (let k = 0; k < tempstatus.connect.length; k++) {
                        const connect = tempstatus.connect,
                            tempx = connect[k][0] - i,
                            tempy = connect[k][1] - j;
                        if (tempx < 0) {
                            this.path([[i * 20, j * 20 - 3], [connect[k][0] * 20, connect[k][1] * 20 - 3]], "#000000");
                        } else if (tempx > 0) {
                            this.path([[i * 20, j * 20 + 3], [connect[k][0] * 20, connect[k][1] * 20 + 3]], "#000000");
                        } else if (tempy < 0) {
                            this.path([[i * 20 - 3, j * 20], [connect[k][0] * 20 - 3, connect[k][1] * 20]], "#000000");
                        } else if (tempy > 0) {
                            this.path([[i * 20 + 3, j * 20], [connect[k][0] * 20 + 3, connect[k][1] * 20]], "#000000");
                        }
                    }
                    if (tempstatus.form === "line") {
                        //蓝色
                        this.point([i, j], "#0000ff", 20, 4);
                    } else if (tempstatus.form === "cross-point") {
                        //黄色
                        this.point([i, j], "#dcfc02", 20, 4);
                    } else if (tempstatus.form === "line-point") {
                        //绿色
                        this.point([i, j], "#02fc31", 20, 4);
                    }
                }

                if (tempstatus.form === "line") {
                    this.text([i * 20 + 5, j * 20 + 15], tempstatus.id.split("_")[1]);
                } else if (tempstatus.form === "part-point") {
                    this.text([i * 20 + 5, j * 20 + 15], tempstatus.id.split("-")[1]);
                } else if (tempstatus.form === "cross-point") {
                    this.path([[i * 20, j * 20], [1000, countx * 25 + 50]], "#222222");
                    this.text([1000, countx * 25 + 50], tempstatus.id);
                    countx++;
                }
            }
        }
    },
};

//导线寻路测试
const lineTestData = {
    //从管脚开始绘制导线
    pin2draw: {
        initMap: [
            { partType: "resistance", id: "R_1", input: ["10k"], position: [420,240], rotate:[[1,0],[0,1]] },
            { partType: "resistance", id: "R_2", input: ["10k"], position: [700,220], rotate:[[1,0],[0,1]] }
        ],
        action:[
            //点击R_1-1管脚
            {
                event: {type:"mousedown", which: 1, currentTarget: "g#R_1-1", pageX: 460, pageY: 240},
                describe: "在R_1的引脚1处按下鼠标",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240]]
                    }
                ]
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 690, pageY: 250},
                describe: "移动鼠标至[690, 250]",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [690, 240], [690, 250]]
                    }
                ]
            },
            //移动至R_2上
            {
                event: {
                    type:"mouseenter",
                    currentTarget: "div#container-grid",
                    relatedTarget: "g#line_1-1 > circle",
                    target: "g#R_2 > rect.focus-part"
                },
                describe: "鼠标进入R_2的范围",
                data: []
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 690, pageY: 234},
                describe: "移动鼠标至[690, 234]",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [660, 240], [660, 220]]
                    }
                ]
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 710, pageY: 230},
                describe: "移动鼠标至[710, 234]",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [740, 240], [740, 220]]
                    }
                ]
            },
            //移出R_2
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 690, pageY: 234},
                describe: "移动鼠标至[690, 234]",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [660, 240], [660, 220]]
                    }
                ]
            },
            {
                event: {
                    type:"mouseleave",
                    currentTarget: "div#container-grid",
                    relatedTarget: "div#container-grid > svg",
                    target: "g#R_2 > rect.focus-part"
                },
                describe: "鼠标离开R_2的范围",
                data: []
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 430, pageY: 260},
                describe: "移动鼠标至[420, 260]",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [460, 260], [430, 260]]
                    }
                ]
            },
            //移动至R_1上
            {
                event: {
                    type:"mouseenter",
                    currentTarget: "div#container-grid",
                    relatedTarget: "g#line_1-1 > circle",
                    target: "g#R_1 > rect.focus-part"
                },
                describe: "鼠标进入R_1的范围",
                data: []
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 430, pageY: 254},
                describe: "移动鼠标至[420, 254]",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [460, 260], [380, 260], [380, 240]]
                    }
                ]
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 410, pageY: 230},
                describe: "移动鼠标至[410, 230]",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [460, 260], [380, 260], [380, 240]]
                    }
                ]
            },
            //鼠标mouseup
            {
                event: {type:"mouseup", which: 1, currentTarget: "div#container-grid", pageX: 410, pageY: 230},
                describe: "在R_1上放开鼠标",
                data: [
                    {
                        id: "line_1",
                        way: [[460, 240], [460, 260], [380, 260], [380, 240]]
                    }
                ]
            },
            //点击R_2-1管脚
            {
                event: {type:"mousedown", which: 1, currentTarget: "g#R_2-0", pageX: 660, pageY: 220},
                describe: "在R_2的引脚0处按下鼠标",
                data: [
                    {
                        id: "line_2",
                        way: [[660, 220]]
                    }
                ]
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 410, pageY: 220},
                describe: "移动鼠标至[410, 220]",
                data: [
                    {
                        id: "line_2",
                        way: [[660, 220], [410, 220], [410, 220]]
                    }
                ]
            },
            //移动鼠标至R_1上
            {
                event: {
                    type:"mouseenter",
                    currentTarget: "div#container-grid",
                    relatedTarget: "g#line_1-1 > circle",
                    target: "g#R_1 > rect.focus-part"
                },
                describe: "鼠标进入R_1的范围",
                data: []
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 410, pageY: 230},
                describe: "移动鼠标至[410, 230]",
                data: [
                    {
                        id: "line_2",
                        way: [[660, 220], [410, 220], [410, 230]]
                    }
                ]
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 410, pageY: 245},
                describe: "移动鼠标至[410, 245]",
                data: [
                    {
                        id: "line_2",
                        way: [[660, 220], [410, 220], [410, 245]]
                    }
                ]
            },
            {
                event: {type:"mousemove", currentTarget: "div#container-grid", pageX: 430, pageY: 245},
                describe: "移动鼠标至[430, 245]",
                data: [
                    {
                        id: "line_2",
                        way: [[660, 220], [430, 220], [430, 245]]
                    }
                ]
            },

            //鼠标mouseup

        ]
    },
    //单个器件移动
    part2move: {

    },
    //多个器件移动
    parts2move: {

    },
    //导线变形
    linetrans: {

    }
};
const lineTest = {
    //触发动作
    action(data) {
        const event = Object.clone(data.event),
            target = ["currentTarget", "relatedTarget", "target"];

        for(let i = 0; i < target.length; i++) {
            event[target[i]] = (event[target[i]])
                ? $(event[target[i]])[0]
                : undefined;
        }

        $(event.currentTarget).trigger(event);
    },
    //数据校验
    dataCheck(data) {
        for(let i = 0; i < data.length; i++) {
            const line = partsAll.findPartObj(data[i].id);
            if(!line.way.isSame(data[i].way)) {
                return(false);
            }
        }
        return(true);
    },
    //初始化
    init(map) {
        //清空图纸和器件集合
        schematic.childrens().remove();
        partsAll.deleteAll();
        partsNow.deleteAll();
        loadData(map);
    }
};
function LineTest(type) {
    const test = lineTestData[type];
    lineTest.init(test.initMap);

    //初始化
    let promise = new Promise(function(res, rej) {
        lineTest.action(test.action[0]);
        if(lineTest.dataCheck(test.action[0].data)) {
            res();
        } else {
            rej(0);
        }
    });
    //异步触发
    for(let i = 1; i < test.action.length; i++) {
        promise = promise.then(function(){
            return new Promise(function(res,rej) {
                setTimeout(function() {
                    if(i === 100) {
                        console.log("暂停");
                    }
                    lineTest.action(test.action[i]);
                    if(lineTest.dataCheck(test.action[i].data)) {
                        res();
                    } else {
                        rej(i);
                    }
                }, 100);
            });
        });
    }

    //正常结束，以及错误捕获
    promise.then(function(){
        console.log("校验完成，没有发现错误。");
    }).catch(function(e) {
        console.log("发生错误：第" + e + "步");
        console.log("操作：" + test.action[e].describe);
    });
}

//测试时部分变量需要在全局使用
window.mapTest = new MapTest();
window.lineTest = LineTest;
window.partsAll = partsAll;
window.partsNow = partsNow;
window.$ = $;
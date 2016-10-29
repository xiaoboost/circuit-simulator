"use strict";

//外部模块引用
import { $ } from "./jquery";
import { iniData } from "./init";
import { schMap } from "./maphash";
import { Point } from "./point";
import { LineClass } from "./lines";
import { Solver } from "./solver";
import { Graph } from "./graph";
import { styleRule } from "./styleRule";
import { PartClass, partsinfo } from "./parts";
import { partsAll, partsNow } from "./collection";

//全局变量定义
const doc = document,
    SVG_NS = "http://www.w3.org/2000/svg",
    u = undefined;
//图纸网格模块
const grid = new (function SchematicsGrid() {
    //持续型状态标志位
    let flag = 0;
    const continuous = [
        "newMark",      //新建器件标志位
        "movePart",     //移单个器件标志位
        "moveMore",     //移动多个器件标志
        "moveMap",      //移动图纸标志位
        "boxDraw",      //绘制复选框标志位
        "deformLine",   //导线变形标志位
        "moveText",     //移动txt标志位
        "drawLine",     //绘制导线标志位
        "graphSelecte"   //波形选择框
    ];
    //标志位
    for(let i = 0; i < continuous.length; i++) {
        //这是块级作用域，所以不必在内部再保存i的值
        Object.defineProperty(this, continuous[i], {
            enumerable: true,
            configurable: true,

            get: function() {
                return(!!(flag & (1 << i)));
            }
        });
        const setValue = "set" + continuous[i].substring(0,1).toUpperCase() + continuous[i].substring(1);
        //对标志位的操作必须通过此函数
        this[setValue] = function(value) {
            value = Number(!!value);
            if(value) {
                flag |= 1 << i;
            } else {
                flag &= 0xFFFF ^ (1 << i);
            }
        };
    }
    //总标志位
    Object.defineProperty(this, "totalMarks", {
        enumerable: true,
        configurable: true,

        get: function() {
            return(!!flag);
        },
        //禁止直接操作属性
        //set: function () {}
    });

    let size = 20,      //背景网格大小
        rate = 1,       //相比上一次网格的放大比率
        zoom = 1,       //相对于原始大小的放大比率
        placeX = 0,     //网格坐标
        placeY = 0,
        SVGX = 0,       //绘图区偏移量
        SVGY = 0,

        mouseLastX = 0, //鼠标偏移量暂存
        mouseLastY = 0;

    //当前鼠标位置
    function mouse(event) {
        return(new Point([
            (event.pageX - SVGX) / zoom,
            (event.pageY - SVGY) / zoom
        ]));
    }
    //鼠标偏移位置
    function mouseBias(event) {
        const ans = new Point([
            (event.pageX - mouseLastX) / zoom,
            (event.pageY - mouseLastY) / zoom
        ]);
        mouseLastX = event.pageX;
        mouseLastY = event.pageY;
        return (ans);
    }

    this.size = function(num) {
        if(num === u) {
            return(size);
        } else {
            size = num;
        }
    };
    this.rate = function(num) {
        if(num === u) {
            return(rate);
        } else {
            rate = num;
        }
    };
    this.zoom = function(num) {
        if(num === u) {
            return(zoom);
        } else {
            zoom = num;
        }
    };
    this.bias = function(x , y) {
        if(x === u && y === u) {
            return([placeX, placeY]);
        } else if(x !== u && y !== u) {
            placeX = x;
            placeY = y;
        } else if(x instanceof Array && u === u) {
            placeX = x[0];
            placeY = x[1];
        }
    };
    this.SVG = function(x , y) {
        if(x === u && y === u) {
            return([SVGX, SVGY]);
        } else if(x !== u && y !== u) {
            SVGX = x;
            SVGY = y;
        } else if(x instanceof Array && u === u) {
            SVGX = x[0];
            SVGY = x[1];
        }
    };
    this.mouse = function(event) {
        return( mouse(event) );
    };
    this.createData = function(event) {
        //偏移量初始化
        mouseBias(event);
        //返回初始数据
        return({
            isMove: false,
            isNew: this.newMark,
            zoom: this.zoom(),
            SVG: this.SVG(),
            mouse: mouse,
            mouseBias: mouseBias,
            pageL: new Point([event.pageX, event.pageY]),
            gridL: []
        });
    };

    //保留的全局临时变量
    this.current = [];
    //封闭模块
    Object.seal(this);
})();
//全局jq元素定义
const sidebar = $("#sidebar-menu"),
    action = $("#action-container"),
    mainPage = $("#container-grid"),
    parameter = $("#parameter-menu"),
    graphPage = $("#graph-page");

//鼠标移动的入口函数
function mousemoveEvent(event) {
    if(!grid.totalMarks) return(false);

    if (grid.movePart) {
        //器件移动
        if (partsNow.length === 1) {
            partsNow[0].moveSelf(event);
        } else {
            //多个器件移动
        }
    } else if (grid.moveMap) {
        //图纸移动
        //只有确实移动了，才会让鼠标变形
        mainPage.attr("class", "mouse-movemap");

        //移动图纸时不需要对鼠标距离做缩放
        const bias = grid.current.mouseBias(event)
            .map((n) => n * grid.current.zoom);

        let SVGPos = grid.SVG();
        grid.SVG(SVGPos[0] + bias[0], SVGPos[1] + bias[1]);

        SVGPos = grid.SVG();
        grid.bias(
            SVGPos[0] % grid.size(),
            SVGPos[1] % grid.size()
        );
        mainPage.css("background-position", grid.bias().join("px ") + "px");
        $("#area-of-parts").attr("transform",
            "translate(" + SVGPos.join(",") + ") scale(" + grid.zoom() + ")");
    } else if (grid.boxDraw) {
        //绘制多选框
        schematic.drawRectselect(event);
    } else if (grid.deformLine) {
        //导线变形
        partsNow[0].deformSelf(event);
    } else if (grid.moveText) {
        //移动器件说明文字
        partsNow[0].moveText(event);
    } else if (grid.newMark) {
        //移动新建器件
        partsNow[0].moveSelf(event);
    } else if (grid.drawLine) {
        //绘制导线
        partsNow[partsNow.length - 1].setPath(event);
    } else if(grid.graphSelecte) {
        //波形界面选择框
        grid.current.graph.drawSelect(event, grid.current);
    }
    return(false);
}
//清除当前所有状态
function clearStatus() {
    context();
    for(let i = 0; i < partsNow.length; i++) {
        partsNow[i].toStatus("normal");
        partsNow[i].current = {};
    }
    partsNow.deleteAll();
}
//创建新的器件
function newPart(type, point) {
    let devices;
    if(typeof type === "object" && point !== u) {
        //创建导线
        devices = new LineClass(type, point);
    } else if(typeof type === "string" && point === u) {
        //创建器件
        devices = new PartClass(type);
    }
    devices.focusOnly();
    return(devices);
}
//右键菜单
function context(event, status) {
    const contextMenu = $("#right-button-menu"),
        menuAttr = {
            "free" : "right-map",
            "single" : "right-part",
            "more" : "right-moreparts",
            "line" : "right-line"
        };
    //关闭右键菜单
    if(status === "close" || status === undefined) {
        contextMenu.attr("class", "");
        return(false);
    }

    contextMenu.attr("class", menuAttr[status]);
    //先放置在左上角，透明度为0
    contextMenu.css({
        "left": 0,
        "top": 0,
        "opacity": 0
    });
    //强制刷新菜单，并获取菜单大小
    const win = $(window),
        Height = win.height(),
        Width = sidebar.hasClass("open-add-parts") ?
            win.width() - sidebar.width() : win.width(),
        menuWidth = contextMenu.width(),
        menuHeight = contextMenu.height(),
        left = (Width - event.pageX < menuWidth) ?
            event.pageX - menuWidth : event.pageX,
        top = (Height - event.pageY < menuHeight) ?
            event.pageY - menuHeight : event.pageY;
    //放置菜单，透明度为1
    contextMenu.css({
        "left": left,
        "top": top,
        "opacity": 1
    });
}
//显示波形
function createGraph(data) {
    const ratio = 1.6,                                  //页面宽高比
        otherHeight = 61,                               //顶部预留高度
        totalHeight = $(window).height(),               //窗口高度
        totalWidth = $(window).width(),                 //窗口宽度
        maxForm = !!(data.voltage.length) +             //需要多少个波形界面
            !!(data.current.length),
        graphHeight = totalHeight - otherHeight,        //波形页面高度
        boxHeight = graphHeight / maxForm,              //每个面板的高度
        graphMain = $("#graph-main"),
        graphWidth = (totalHeight * ratio < totalWidth) ? totalHeight * ratio : totalWidth,
        graphForm = $.maxSelect("div.graph-individual", graphMain, maxForm);

    //删除DOM中的所有元素
    for(let i = 0; i < graphForm.length; i++) {
        const form = graphForm.get(i);
        form.childrens().remove();
        form.css("height", boxHeight + "px");
    }

    //设置波形页面宽度
    graphPage.attr("style", "width: " + graphWidth + "px");
    //创建波形
    for(let i = 0; i < 2; i++) {
        const label = ["voltage", "current"][i];
        if(data[label].length) {
            const sub = (graphForm.length === 2) ? i : 0;
            graphForm.get(sub).attr("id", "graphForm-" + i);
            graphForm.get(sub).prop("_data", new Graph(data[label], graphForm[sub], label));
        }
    }
    //数据准备完成，准备页面变换
    const height = graphPage.height(),
        width = graphPage.width(),
        actionRight = 66,
        actionBottom = 63.6,
        R = Math.sqrt((actionRight - width) * (actionRight - width) + (actionBottom - height) * (actionBottom - height)),
        clipPath = [
            [R - width + actionRight, R - height],
            [R - width + actionRight, R + actionBottom + 10],
            [R + actionRight + 10, R + actionBottom + 10],
            [R + actionRight + 10, R - height]
        ].map((n) => n.join("px ")).join("px,") + "px";

    graphPage.attr("class", "run");

    const circle = graphPage.append($("<div>", {
        "id": "background-circle",
        "style": "position: absolute; background-color: #66CCCC; border-radius: 50%;" +
        "-webkit-clip-path: polygon(" + clipPath + ");" +
        "margin : 0; right: " + actionRight + "px; bottom: " + actionBottom + "px; " +
        "width: " + (2 * R) + "px; height: " + (2 * R) + "px; transform: translate(50%,50%)"
    }));
    const anime = new styleRule("graph-vision");
    anime.setRule("0%", {
        "width" : "0px",
        "height" : "0px",
        "-webkit-clip-path" : "circle(0)"
    });
    anime.setRule("100%", {
        "width" : 2 * R + "px",
        "height" : 2 * R + "px",
        "-webkit-clip-path": "circle(200vh)"
    });

    setTimeout(function() {
        graphPage.attr("class", "visionAll");
        circle.remove();
    }, 600);
}
//读取数据
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

//网页元素相关事件
//添加器件菜单中器件的所有事件
sidebar.on({
    "mousemove": function(event){
        $("#float-tool-tip").css({
            bottom : (window.innerHeight - event.pageY) + "px",
            right : (window.innerWidth - event.pageX) + "px"
        });
    },
    "mouseenter": function(event){
        const text = partsinfo.intro[event.currentTarget.id];
        $("#float-tool-tip").css({
            display: "block",
            width: (text.length * 16) + "px"
        }).text(text);
    },
    "mouseleave": function(){
        $("#float-tool-tip").css({
            display: "none"
        }, true);
    },
    "click": function(event){
        if (event.which === 1) {
            if (!grid.totalMarks) {
                clearStatus();
                grid.setNewMark(true);
                newPart(event.currentTarget.id).current
                    .extend(grid.createData(event));
                mainPage.on("mousemove", mousemoveEvent);
            }
        }
    }
}, ".parts-list");
//点击添加器件菜单栏的关闭按钮
sidebar.on("click", "#menu-add-parts-close", function(event) {
    if (event.which === 1) {
        $("#menu-add-parts-close").addClass("disappear");
        $(document.body).removeClass("open-sidebar open-gray");
        sidebar.removeClass("open-menu-config open-add-parts");
    }
});
//打开设置边栏
action.on("click", "#fab-config", function(event) {
    if (event.which === 1) {
        $(document.body).addClass("open-sidebar open-gray");
        sidebar.addClass("open-menu-config");
    }
});
//打开添加器件边栏
action.on("click", "#fab-adds", function(event) {
    if (event.which === 1) {
        $(document.body).addClass("open-sidebar");
        sidebar.addClass("open-add-parts");
        $("#menu-add-parts-close").removeClass("disappear");
    }
});
//时域模拟
action.on("click", "#fab-run", function(event) {
    if (event.which !== 1) { return(false); }
    clearStatus();

    const delayTime = 10,   //延迟时间，单位毫秒
        fabs = action.childrens(),
        fabRun = $("#fab-run"),
        fabText = $("#fab-text"),
        text = fabText.childrens(0),
        data = {voltage: [], current: []};
    //开始求解前的图标变换
    for(let i = 1; i < fabs.length; i++) {
        fabs.get(i).css("display", "none");
    }
    fabRun.css("display", "none");
    fabText.css("display", "");
    text.text("0%");

    //建立电路求解器
    const diagrams = partsAll.connectGraph()
        .map(function(n) {
            const ans = { solver: new Solver(n) };
            ans.iteration = ans.solver.solve();
            return(ans);
        });

    //求解主进程，异步进行
    setTimeout(function process() {
        const startTime = (new Date()).getTime(),
            timeInterval = 500;     //每隔500ms刷新右下角的进度

        let timeLag = 0, endFlag = false;

        while (timeLag < timeInterval && !endFlag) {
            for (let i = 0; i < diagrams.length; i++) {
                diagrams[i].now = diagrams[i].iteration.next();
                endFlag |= diagrams[i].now.done;
            }
            timeLag = (new Date()).getTime() - startTime;
        }
        if (!endFlag) {
            text.text(diagrams[0].now.value + "%");
            setTimeout(process, delayTime);
        } else {
            text.text("100%");
            for(let i = 0; i < diagrams.length; i++) {
                data.voltage = data.voltage.concat(diagrams[i].solver.observeVoltage);
                data.current = data.current.concat(diagrams[i].solver.observeCurrent);
            }
            //终点时间
            data.voltage.time = diagrams[0].solver.observeVoltage.time;
            data.voltage.stepTime = diagrams[0].solver.observeVoltage.stepTime;
            data.current.time = diagrams[0].solver.observeCurrent.time;
            data.current.stepTime = diagrams[0].solver.observeCurrent.stepTime;
            //延迟显示波形图
            setTimeout(function(){
                createGraph(data);
            }, delayTime);
            //延迟1秒，恢复按钮形状
            setTimeout(function() {
                text.text("");
                fabRun.css("display", "");
                fabText.css("display", "none");
                for(let i = 1; i < fabs.length; i++) {
                    fabs.get(i).css("display", "");
                }
            }, 1000);
        }
    }, delayTime);

});
//器件属性菜单的取消键
parameter.on("click", "#parameter-bottom-cancel", function() {
    $(doc.body).removeClass("open-gray");
    parameter.css("z-index", "20");
    parameter.attr("class", "parameter-close");

    setTimeout(function() {
        parameter.css("z-index", "");
    }, 350);
});
//器件属性菜单的确定键
parameter.on("click", "#parameter-bottom-accept", function() {
    //检查输入数据的格式
    if(partsNow[0].inputVision()) {
        $(doc.body).removeClass("open-gray");
        parameter.css("z-index", "20");
        parameter.attr("class", "parameter-close");
        setTimeout(function() {
            parameter.css("z-index", "");
        }, 350);
    }
});
//鼠标滚轮事件
mainPage.on("mousewheel", function(event) {
    if (!$(doc.body).hasClass("open-gray")) {
        const mousePosition = [ event.pageX, event.pageY ];

        const sizeL = grid.size();
        if (event.deltaY > 0) {
            grid.size(sizeL - 5);
        } else if (event.deltaY < 0) {
            grid.size(sizeL + 5);
        }

        if (grid.size() < 20) {
            grid.size(20);
            return(true);
        }
        if (grid.size() > 80) {
            grid.size(80);
            return(true);
        }

        const size = grid.size();
        grid.rate(size / sizeL);
        grid.zoom(size / 20.0);

        let SVGPos = grid.SVG();
        grid.SVG(
            Math.round(mousePosition[0] - grid.rate() * (mousePosition[0] - SVGPos[0])),
            Math.round(mousePosition[1] - grid.rate() * (mousePosition[1] - SVGPos[1]))
        );

        SVGPos = grid.SVG();
        grid.bias(
            SVGPos[0] % size,
            SVGPos[1] % size
        );
        mainPage.css({
            "background-size": size + "px",
            "background-position": grid.bias().join("px ") + "px"
        });
        $("#area-of-parts").attr("transform", "translate(" + SVGPos.join(",") + ") scale(" + grid.zoom() + ")");
    }
});
//鼠标点击黑幕
$("#shade-gray").on("click", function() {
    const body = $(doc.body);
    if(body.hasClass("open-sidebar")) {
        body.removeClass("open-gray open-sidebar");
        sidebar.removeClass("open-menu-config open-add-parts");
    }
});

//器件相关事件
//对于器件的mousedown操作
mainPage.on("mousedown","g.editor-parts .focus-part, g.editor-parts path, g.editor-parts .features-text",function(event) {
    if(grid.totalMarks) return false;
    //寻找当前器件的对象
    let clickpart = partsAll.findPartObj(event.currentTarget.parentNode.id);
    if (event.which === 1) {
        clearStatus();
        if (event.currentTarget.tagName === "text") {
            const text = $(this);
            clickpart.focusOnly();          //当前器件染色
            clickpart.current.extend(grid.createData(event))
                .extend({
                    text: text,
                    position: [
                        parseInt(text.attr("x")),
                        parseInt(text.attr("y"))
                    ]
                });
            grid.setMoveText(true);
        } else {
            clickpart.focusOnly();
            clickpart.current.extend(grid.createData(event))
                .extend({ map: schMap });
            grid.setMovePart(true);
            /*
             //这里有群体选择的部分，暂时取消，一律单选
             if (partsNow.has(clickpart.id)) {
             vision.closeRight();
             grid.movePart = true; //移动器件标志位置高
             } else {
             schematic.clearPartsStatus();  //清空一切状态
             clickpart.focusOnly();
             grid.movePart = true;  //移动器件标志位置高
             }
             */
        }
        //绑定全局移动事件
        mainPage.on("mousemove", mousemoveEvent);
    } else if (event.which === 3) {
        if (partsNow.has(clickpart.id) && (partsNow.length > 1)) {
            //多个器件的右键
            context(event, "more");
        } else {
            //单个器件的右键
            clearStatus();
            clickpart.focusOnly();
            context(event, "single");
        }
    }
    //器件的mousedown事件要阻止事件冒泡
    return (false);
});
//对于器件的双击操作，弹出器件参数对话框
mainPage.on("dblclick","g.editor-parts .focus-part, g.editor-parts path, g.editor-parts .features-text",function(event) {
    const clickpart = partsAll.findPartObj(event.currentTarget.parentNode.id);
    if (event.which === 1 && !grid.totalMarks) {
        clickpart.viewParameter(grid.zoom(), grid.SVG());
    }
});
//对于器件的强制对齐
mainPage.on({
    "mouseenter": function(event) {
        const tagName = event.currentTarget.tagName.toLowerCase(),
            elem = $(event.currentTarget);

        if (!grid.totalMarks) {
            if (tagName === "rect" || tagName === "text") {
                //普通状态下，鼠标滑过导线和器件，鼠标变为move状态
                mainPage.attr("class", "mouse-movepart");
            } else if(tagName === "g" && elem.hasClass("point-close")){
                //关闭状态下的器件引脚
                mainPage.attr("class", "mouse-closepoint");
            }
        } else if(grid.drawLine) {
            if(tagName !== "text" && !elem.hasClass("line-rect")) {
                //绘制导线时鼠标经过器件
                const line = partsNow[partsNow.length - 1];
                line.current.enforceAlign.extend({
                    flag: true,
                    onPart:true,
                    part: partsAll.findPartObj(event.currentTarget.parentNode.id)
                });
            }
        }
    },
    "mouseleave": function() {
        if (!grid.totalMarks) {
            //没有状态，全局回复鼠标默认
            mainPage.attr("class", "");
        } else  if (grid.drawLine) {
            const line = partsNow[partsNow.length - 1];
            if (line.current.enforceAlign.label) {
                line.current.enforceAlign.extend({
                    flag: true,
                    part: false,
                    onPart: false
                });
            }
        }
    }
},"g.editor-parts rect.focus-part, g.editor-parts g.part-point, g.editor-parts text, g.line rect.line-rect");

//左键器件引脚mousedown，绘制导线开始
mainPage.on("mousedown","g.editor-parts g.part-point",function(event) {
    if (event.which === 1 && !grid.totalMarks){
        const clickpart = partsAll.findPartObj(event.currentTarget.parentNode.id),  //寻找当前器件的对象
            pointmark = parseInt(event.currentTarget.id.split("-")[1]);             //当前器件的connect端口号

        clearStatus();
        if (!clickpart.connect[pointmark]) {
            clickpart.focusOnly();
            newPart(clickpart, pointmark).current
                .extend(grid.createData(event));
            mainPage.attr("class", "mouse-line");
        } else {
            const line = partsAll.findPartObj(clickpart.connect[pointmark]);
            line.focusOnly();
            line.current = grid.createData(event);
            line.reDraw(event, clickpart, pointmark);
            mainPage.attr("class", "mouse-line");
        }
        grid.setDrawLine(true);
        mainPage.on("mousemove", mousemoveEvent);
    }
    return(false);
});
//图纸全局的mousedown操作
mainPage.on("mousedown", function(event) {
    //有持续性事件，那么直接返回
    if(grid.totalMarks) return(false);
    //空闲地区右键按下
    if (event.which === 3) {
        mainPage.on("mousemove", mousemoveEvent);
        grid.current = grid.createData(event);
        grid.setMoveMap(true);
    }
});
//图纸的全局mouseup操作
mainPage.on("mouseup", function(event) {
    //全局解除移动事件
    mainPage.off("mousemove", mousemoveEvent);
    if (event.which === 1) {
        if (grid.newMark) {                     //新建器件
            grid.setNewMark(false);
            partsNow[0].putDownSelf(schMap);
            partsNow[0].elementDOM.attr("opacity", "1");
        } else if (grid.movePart) {              //移动器件
            grid.setMovePart(false);
            if (partsNow.length === 1) {        //放下单个器件
                partsNow[0].putDownSelf(schMap);
            } else {
                putdownMoreParts(partsNow);
            }
        } else if (grid.boxDraw) {               //结束绘制多选框
            grid.setBoxDraw(false);
            if (grid.movemouse)
                schematic.focusRectselect(event);
        } else if (grid.deformLine) {            //结束导线变形
            grid.setDeformLine(false);
            if(grid.movemouse)
                partsNow[0].deformSelfEnd();
        } else if (grid.moveText) {              //结束移动器件属性说明文字
            grid.setMoveText(false);
            if (partsNow[0].current.isMove) {
                partsNow[0].textVisition([
                    parseInt(partsNow[0].current.text.attr("x")),
                    parseInt(partsNow[0].current.text.attr("y"))
                ]);
                delete partsNow[0].current;
            }
        } else if (grid.drawLine) {      //结束导线绘制
            grid.setDrawLine(false);
            partsNow[partsNow.length - 1].drawLineEnd();
        } else {
            clearStatus();
        }
    } else if ((event.which === 3) && (grid.moveMap)) {
        //右放开且正在移动图纸移动整个图纸结束
        grid.setMoveMap(false);
        grid.current = [];
        //如果没有这个标签，说明鼠标没有移动，那么弹出右键菜单
        if(!mainPage.hasClass("mouse-movemap")) {
            clearStatus();
            context(event, "free");
        }
    }
    //鼠标恢复原样
    mainPage.attr("class", "");
});
//导线结点的mousedown操作
mainPage.on("mousedown","g.line g.draw-open",function(event) {
    if (event.which === 1) {
        const line = partsAll.findPartObj(event.currentTarget.parentNode.id);
        if (!grid.totalMarks) {
            clearStatus();
            line.focusOnly();
            line.current = grid.createData(event);
            line.reDraw(event);
            mainPage.attr("class", "mouse-line");
            grid.setDrawLine(true);
        }
    }
    mainPage.on("mousemove", mousemoveEvent);
    return(false);
});
//交错节点事件
mainPage.on({
    "mousemove": function(event) {
        if(!grid.totalMarks) {
            const mouse = grid.mouse(event),
                mouseRound = mouse.roundToSmall(),
                bias = mouse.add(-1, mouseRound.mul(20));

            let tempdi = "", tempVector = [];
            if (Math.abs(bias[0]) > Math.abs(bias[1])) {
                if (bias[0] > 0) {
                    tempdi = "right";
                    tempVector = mouseRound.add([1,0]);
                }
                else {
                    tempdi = "left";
                    tempVector = mouseRound.add([-1,0]);
                }
            } else {
                if (bias[1] > 0) {
                    tempdi = "down";
                    tempVector = mouseRound.add([0,1]);
                }
                else {
                    tempdi = "up";
                    tempVector = mouseRound.add([0,-1]);
                }
            }
            const mouseConnect = schMap.getSingleValueBySmalle(mouseRound).connect;
            if(mouseConnect.some((n, i) => (tempVector.isEqual(mouseConnect[i])))) {
                mainPage.attr("class", "mouse-cross" + tempdi);
            } else {
                mainPage.attr("class", "");
            }
        }
        return(false);
    },
    "mouseleave": function(){
        if(!grid.totalMarks) {
            mainPage.attr("class", "");
        }
        return(false);
    },
    "mousedown": function(event) {
        if (event.which === 1) {
            if (!grid.totalMarks) {
                const director = /right|left|up|down/,
                    SVG = grid.SVG(),
                    mouseRound = [
                        Math.round((event.pageX - SVG[0]) / grid.zoom() * 0.05),
                        Math.round((event.pageY - SVG[1]) / grid.zoom() * 0.05)
                    ],
                    style = (mainPage.attr("style") || "").match(director),
                    round = {
                        "right": [1, 0],
                        "left": [-1, 0],
                        "up":   [0, -1],
                        "down":  [0, 1]
                    }[style],
                    point = mouseRound.add(round);

                if(!style) {
                    return false;
                }
                const line = partsAll.findPartObj(schMap.getSingleValueBySmalle(point).id),
                    lines = schMap.getSingleValueBySmalle(mouseRound).id.split(" ")
                        .map((n) => partsAll.findPartObj(n))
                        .filter((n) => n !== line);

                partsNow.deleteAll();
                line.focusOnly();
                if(lines.length === 2) {  //如果剩下两个导线，那么合并剩下的两导线
                    lines[0].mergeLine(lines[1]);
                    line.tuneStart(event);
                } else if(lines.length === 3) {
                    line.tuneStart(event, lines);
                }

                grid.setDrawLine(true);
                /*
                let [line,lines] = schMap.findLinesByCrossPoint(mousePosition);
                if(!line) return(false);  //鼠标所在方向并没有导线
                partsNow.deleteAll();
                line.focusOnly();
                if(lines.length === 2) {  //如果剩下两个导线，那么合并剩下的两导线
                    lines[0].mergeLine(lines[1]);
                    lines = undefined;
                }
                line.tuneStart(event, lines);
                $("#container-grid").css("cursor", "url(../img/mouse/crosshair_line.cur), crosshair");
                flagBit.drawline = true;
                */
            }
        }
    }
},"g.line g.cross-point");

//曲线面板事件
//取消缩放
graphPage.on("click", "#waveRecover", function() {
    $("#graph-main .graph-individual").each((n) => {
        const graph = n._data,
            time = [0, graph.time],
            value = [
                Math.minOfArray(graph.output.map((n) => Math.minOfArray(n.data))),
                Math.maxOfArray(graph.output.map((n) => Math.maxOfArray(n.data)))
            ];

        graph.clearActionCanvas();
        graph.drawBackground(time, value, true);
        graph.drawCurve();
    });
});
//转换成图片
graphPage.on("click", "#waveToImage", function() {
    const graphImg = $(window.open("about:blank").document.body);
    graphImg.css({
        "margin": "0px",
        "padding": "0px"
    });
    graphImg.append($("<img>", {
        "src" : Graph.toImage()
    }));
});
//输出数据
graphPage.on("click", "#waveToData", function() {
    const data = [],
        dataPage = window.open("about:blank"),
        graphData = $("#graph-main .graph-individual").map((n) => n._data),
        stepTime = graphData[0].stepTime;

    let ans = "<p>time,";

    for(let i = 0; i < graphData.length; i++) {
        for(let j = 0; j < graphData[i].output.length; j++) {
            data.push(graphData[i].output[j]);
        }
    }
    for(let i = 0; i < data.length; i++) {
        ans += data[i].name + ", ";
    }
    ans += "</p>";
    for(let i = 0; i < data[0].data.length; i++) {
        ans += "<p>" + (i * stepTime).toSFixed() + ", ";
        for(let j = 0; j < data.length; j++) {
            ans += data[j].data[i] + ", ";
        }
        ans += "</p>";
    }
    dataPage.document.body.innerHTML = ans;
});
//关闭面板
graphPage.on("click", "#waveClose", function() {
    graphPage.attr("class", "disappear");
    setTimeout(function() {
        graphPage.attr({
            "class": "silence",
            "style": "display:none;"
        });
    }, 500);
});
//点击面板的图例
graphPage.on("click", "tr.graph-table-row", function(event) {
    const id = event.currentTarget.id.split("-").pop(),
        graph = $("#graph-" + id),
        display = [/display *: *none/, /display *: *block/];

    //波形显示
    const attribute = graph.attr("style");
    if (attribute.search(display[0]) !== -1) {
        graph.attr("style", attribute.replace(display[0], "display:block"));
    } else if (attribute.search(display[1]) !== -1) {
        graph.attr("style", attribute.replace(display[1], "display:none"));
    }
    //标签删除线
    const text = event.currentTarget.querySelector(".graph-table-legend-label");
    if (text.innerHTML.search("strike") !== -1) {
        text.innerHTML = text.innerHTML.replace(/<\/?strike>/g, "");
    } else {
        text.innerHTML = text.innerHTML.strike();
    }
    //波形显示标志位
    const data = event.currentTarget.parentNode.parentNode.parentNode._data;
    for(let i = 0; i < data.output.length; i++) {
        if(data.output[i].name === id) {
            data.output[i].status = !data.output[i].status;
        }
    }
});
//面板之上鼠标移动
graphPage.on("mousemove", ".graph-action", function(event) {
    if(!grid.totalMarks) {
        const graphTarget = event.currentTarget.parentNode._data,
            graphs = $("#graph-main .graph-individual").map((n) => n._data),
            vision = graphTarget.drawMove(event.offsetX, event.offsetY);

        for (let i = 0; i < graphs.length; i++) {
            if(graphs[i] !== graphTarget) {
                graphs[i].drawMove(event.offsetX, vision);
            }
        }
        //这里运行之后禁止冒泡
        return(false);
    }
});
//鼠标移出面板
graphPage.on("mouseleave", ".graph-action", function() {
    if(!grid.totalMarks) {
        $("#graph-main .graph-individual").each((n) => n._data.clearActionCanvas());
        return(false);
    }
});
//波形界面鼠标点下
graphPage.on("mousedown", ".graph-action", function(event) {
    if(event.which !== 1) { return(false); }

    if(!grid.totalMarks) {
        //清空所有面板画布
        $("#graph-main .graph-individual").each((n) => n._data.clearActionCanvas());

        grid.current = {
            graph: event.currentTarget.parentNode._data,
            start: [event.offsetX, event.offsetY],
            canvas: event.currentTarget.querySelector(".graph-action-canvas")
        };
        grid.setGraphSelecte(true);
        //绑定鼠标移动事件
        graphPage.on("mousemove", mousemoveEvent);
        graphPage.addClass("mouse-select");
    }
});
//波形界面的鼠标移动
graphPage.on("mouseup", function() {
    if(grid.totalMarks && grid.graphSelecte) {
        //取消移动事件绑定
        graphPage.off("mousemove", mousemoveEvent);
        graphPage.removeClass("mouse-select");
        //标志位置低
        grid.setGraphSelecte(false);

        //重绘当前面板
        const graph = grid.current.graph,
            [time, value] = graph.pixel2Value(grid.current.select);

        graph.clearActionCanvas();
        graph.drawBackground(time, value);
        graph.drawCurve();

        //其余面板需要根据时间轴缩放
        $("#graph-main .graph-individual").each(function(n){
            if(n._data !== graph) {
                const range = n._data.backgroundStartToEnd();
                n._data.clearActionCanvas();
                n._data.drawBackground(time,
                    [range[2], range[3]]
                );
                n._data.drawCurve();
            }
        });

        //临时变量清空
        grid.current = [];
    }
});

//页面加载完毕之后运行初始化
doc.body.onload = function() {
    //图标特殊位置
    const special = {
        "reference_ground" : "scale(1.3, 1.3)",
        "transistor_npn" : "translate(-5,0)"
    };
    //右下角图标样式
    const icon = {
        "run" : {
            "long" : 1580,
            "transform" : [86,100],
            "d" : "M1384 609l-1328 -738q-23 -13 -39.5 -3t-16.5 36v1472q0 26 " +
            "16.5 36t39.5 -3l1328 -738q23 -13 23 -31t-23 -31z"
        },
        "adds" : {
            "long" : 1408,
            "transform" : [0,0],
            "d" : "M1408 800v-192q0 -40 -28 -68t-68 -28h-416v-416q0 -40 -28 " +
            "-68t-68 -28h-192q-40 0 -68 28t-28 68v416h-416q-40 0 -68 28t-28 " +
            "68v192q0 40 28 68t68 28h416v416q0 40 28 68t68 28h192q40 0 68 " +
            "-28t28 -68v-416h416q40 0 68 -28t28 -68z"
        },
        "config" : {
            "long" : 1920,
            "transform" : [-30, 200],
            "d" : "M896 640q0 106 -75 181t-181 75t-181 -75t-75 -181t75 -181t181 -75t181 " +
            "75t75 181zM1664 128q0 52 -38 90t-90 38t-90 -38t-38 -90q0 -53 37.5 " +
            "-90.5t90.5 -37.5t90.5 37.5t37.5 90.5zM1664 1152q0 52 -38 90t-90 38t-90 " +
            "-38t-38 -90q0 -53 37.5 -90.5t90.5 -37.5 t90.5 37.5t37.5 90.5zM1280 731v-185q0 " +
            "-10 -7 -19.5t-16 -10.5l-155 -24q-11 -35 -32 -76q34 -48 90 -115q7 -10 7 -20q0 " +
            "-12 -7 -19q-23 -30 -82.5 -89.5t-78.5 -59.5q-11 0 -21 7l-115 90q-37 -19 -77 -31q-11 " +
            "-108 -23 -155q-7 -24 -30 -24h-186q-11 0 -20 7.5t-10 17.5 l-23 153q-34 10 -75 " +
            "31l-118 -89q-7 -7 -20 -7q-11 0 -21 8q-144 133 -144 160q0 9 7 19q10 14 41 53t47 " +
            "61q-23 44 -35 82l-152 24q-10 1 -17 9.5t-7 19.5v185q0 10 7 19.5t16 10.5l155 24q11 " +
            "35 32 76q-34 48 -90 115q-7 11 -7 20q0 12 7 20q22 30 82 89t79 59q11 0 21 -7 l115 " +
            "-90q34 18 77 32q11 108 23 154q7 24 30 24h186q11 0 20 -7.5t10 -17.5l23 -153q34 -10 " +
            "75 -31l118 89q8 7 20 7q11 0 21 -8q144 -133 144 -160q0 -9 -7 -19q-12 -16 -42 -54t-45 " +
            "-60q23 -48 34 -82l152 -23q10 -2 17 -10.5t7 -19.5zM1920 198v-140q0 -16 -149 -31 q-12 -27 " +
            "-30 -52q51 -113 51 -138q0 -4 -4 -7q-122 -71 -124 -71q-8 0 -46 47t-52 68q-20 -2 -30 -2t-30 " +
            "2q-14 -21 -52 -68t-46 -47q-2 0 -124 71q-4 3 -4 7q0 25 51 138q-18 25 -30 52q-149 15 -149 " +
            "31v140q0 16 149 31q13 29 30 52q-51 113 -51 138q0 4 4 7q4 2 35 20 t59 34t30 16q8 0 46 " +
            "-46.5t52 -67.5q20 2 30 2t30 -2q51 71 92 112l6 2q4 0 124 -70q4 -3 4 -7q0 -25 -51 -138q17 " +
            "-23 30 -52q149 -15 149 -31zM1920 1222v-140q0 -16 -149 -31q-12 -27 -30 -52q51 -113 51 -138q0 " +
            "-4 -4 -7q-122 -71 -124 -71q-8 0 -46 47t-52 68 q-20 -2 -30 -2t-30 2q-14 -21 -52 -68t-46 -47q-2 " +
            "0 -124 71q-4 3 -4 7q0 25 51 138q-18 25 -30 52q-149 15 -149 31v140q0 16 149 31q13 29 30 52q-51 113 " +
            "-51 138q0 4 4 7q4 2 35 20t59 34t30 16q8 0 46 -46.5t52 -67.5q20 2 30 2t30 -2q51 71 92 112l6 2q4 " +
            "0 124 -70 q4 -3 4 -7q0 -25 -51 -138q17 -23 30 -52q149 -15 149 -31z"
        }
    };
    //添加器件图标
    $("#sidebar-menu #menu-add-parts button.parts-list").each((n) => {
        const elem = $(n);
        const icon = elem.append($("<svg>", SVG_NS, {
            "x" : "0px",
            "y" : "0px",
            "viewBox" : "0 0 80 80"
        })).append($("<g>", SVG_NS));

        const type = elem.attr("id"),
            part = partsinfo.shape[type],
            bias = (special[type]) ? "translate(40,40) " + special[type] : "translate(40,40)";

        icon.attr("transform", bias);
        for (let i = 0; i < part.length; i++) {
            if (part[i].name === "rect") { continue; }

            const svgPart = part[i],
                iconSVG = icon.append($("<" + svgPart.name + ">", SVG_NS));
            for (let k in svgPart.attribute) {
                if (svgPart.attribute.hasOwnProperty(k)) {
                    if (svgPart.attribute[k] === "class") { continue; }
                    iconSVG.attr(k, svgPart.attribute[k]);
                }
            }
        }
    });
    //添加右下角图标
    $("#action-container .fab").each((n) => {
        const elem = $(n);
        const id = elem.attr("id").split("-")[1];
        //跳过text
        if(id === "text") return;
        //缩小倍数
        const zoom = 0.6;
        const view = icon[id].long;
        elem.append($("<svg>", SVG_NS, {
            "viewBox" : "0 0 " + view + " " + view
        })).append($("<g>", SVG_NS, {
            "transform" : "translate(" + (icon[id]["transform"][0] + (1 - zoom) / 2 * view) +
            "," + (icon[id]["transform"][1] + (1 - zoom) / 2 * view) + ")" +
            " scale(" + zoom + "," + zoom + ")"
        })).append($("<path>", SVG_NS, {
            "d" : icon[id]["d"]
        }));
    });
    //添加器件部分，关闭按钮的位置
    const top = $(".st-menu-title").prop("clientHeight"),
        closeButton = $("#menu-add-parts-close"),
        height = closeButton.prop("clientHeight");
    closeButton.attr("style", "top:" + (top - height) + "px;");
    //读取地址信息
    const src = window.location.href.split("?")[1],
        parameters = {};
    if (src && src.length) {
        const data = src.split("&");
        for(let i = 0; i < data.length; i++) {
            //分解每个输入参数
            const obj = data[i].replace(/#/g, "").split("=");
            parameters[obj[0]] = obj[1];
        }
    }
    //加载图纸
    loadData(iniData[parameters.init] || []);
    //去掉灰幕
    const cover = $("#load-cover");
    cover.css("opacity", 0);
    setTimeout(function() {
        cover.css("display", "none");
    }, 300);
};

//测试的时候调用test模块
import { } from "./test"
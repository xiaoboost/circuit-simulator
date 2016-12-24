import { $ } from "./jquery";

const color = ["#50B4C8", "#F0A050", "#50C850"],
    background = "#66CCCC",
    page = $("#graph-page"),
    u = undefined;

//根据像素进行大致的分段
function axisSplit(long) {
    return(Math.floor(long / 50));
}
//延长坐标
function extendPoint(x) {
    if(!x) { return(1); }

    const sign = x / Math.abs(x),
        rank = x.rank(),
        number = Math.abs(x).toSFixed(2),      //保留三位有效数字
        int = Math.floor(number / rank),            //整数部分
        mod = (x * sign / rank - int).toSFixed();   //小数部分

    let ans;
    if (int < 3) {
        if(mod < 0.2) {
            ans = 0.2;
        } else if(mod < 0.5) {
            ans = 0.5;
        } else {
            ans = 1;
        }
    } else if ((int > 2) && (int < 5)) {
        if(mod < 0.5) {
            ans = 0.5;
        } else {
            ans = 1;
        }
    } else {
        ans = 1;
    }
    return ((rank * (int + ans) * sign).toSFixed());
}
//线段分段
function lineSplit(maxExpand, minExpand, num) {
    const rank = maxExpand.rank(),
          max = (maxExpand / rank).toSFixed(),
          min = (Math.abs(minExpand / rank)).toSFixed(),
          ans = [];

    //严格分段
    for (let i = 1; i < 2 * num; i++) {
        const maxNum = (max / i).toSFixed(8),
              minNum = (min / maxNum).toSFixed(8);

        //小数点五位以内被视作整除
        if ((maxNum === parseFloat(maxNum.toFixed(5))) &&
            (minNum === Math.floor(minNum))) {
            ans.push(i + minNum);
        }
    }

    //普通分段
    if (!ans.length) {
        const tol = (max + min).toSFixed();
        for (let i = 1; i < 2 * num; i++) {
            const tolNum = (tol / i).toSFixed(8);
            if (tolNum === parseFloat(tolNum.toFixed(5))) {
                ans.push(i);
            }
        }
    }

    return ans.length
        ? ans.reduce((pre, next) => ((Math.abs(pre - num) < Math.abs(next - num))
            ? pre : next))
        : num;
}
//延长线段
function extendLine(line, long) {
    //坐标轴最小最大值，长度，以及分段数量
    let axisMin, axisMax;
    //线段的初步分割
    const num = axisSplit(long);

    if (line[0] === line[1]) {
        //起点和终点相等
        const number = Math.abs(line[0]),
            rank = number.rank(),
            numberFloor = Math.floor(number / rank),
            minExpand = (numberFloor === (number / rank).toSFixed()) ?
            numberFloor - 1 : numberFloor,
            maxExpand = minExpand + 2;

        if (line[0] > 0) {
            axisMin = (minExpand * rank).toSFixed();
            axisMax = (maxExpand * rank).toSFixed();
        }
        else {
            axisMin = -(maxExpand * rank).toSFixed();
            axisMax = -(minExpand * rank).toSFixed();
        }
        return ([axisMin, axisMax, lineSplit((axisMax - axisMin), 0, num)]);
    }
    else if (line[0] * line[1] <= 0) {
        //两点异号，0点包含在其中
        const max = Math.max(Math.abs(line[0]), Math.abs(line[1])),
            min = Math.min(Math.abs(line[0]), Math.abs(line[1])),
            //最大值先被固定
            maxExpand = extendPoint(max),
            minExpand = (extendPoint((maxExpand + min) / 2) * 2 - maxExpand).toSFixed();

        if (Math.abs(line[0]) < Math.abs(line[1])) {
            axisMin = -minExpand;
            axisMax = maxExpand;
        }
        else {
            axisMin = -maxExpand;
            axisMax = minExpand;
        }
        return ([axisMin, axisMax, lineSplit(axisMax, axisMin, num)]);
    }
    else {
        //两点同号，0点没有被包含其中，两端悬浮
        const min = Math.min(Math.abs(line[0]), Math.abs(line[1])),
            maxExpand = extendPoint(Math.abs(line[0] - line[1]) / 2) * 2,
            count = lineSplit(maxExpand, 0, num),
            minFloor = Math.floor(min / (maxExpand / count)) * (maxExpand / count);

        if (line[0] < 0) {
            axisMin = -(maxExpand + minFloor);
            axisMax = -minFloor;
        }
        else {
            axisMin = minFloor;
            axisMax = maxExpand + minFloor;
        }
        return ([axisMin, axisMax, count]);
    }
}
//收缩坐标
function reduceList(list, line) {
    const max = Math.maxOfArray(line),
        min = Math.minOfArray(line);

    while(list[1] < min) {
        list.splice(0,1);
    }
    list[0] = min;

    while(list[list.length - 2] > max) {
        list.pop()
    }
    list[list.length - 1] = max;
}

//canvas绘图类
function Graphics(canvas) {
    if(!(canvas && canvas.attributes && canvas.nodeName)) {
        throw("输入必须是canvas元素");
    }
    this.elementDOM = canvas;
    this.ctx = canvas.getContext("2d");
    this.length = {
        "width" : parseInt(canvas.getAttribute("width")),
        "height" : parseInt(canvas.getAttribute("Height"))
    };
    this.clear();       //创建时清理画布
}
Graphics.prototype = {
    //备份当前输入属性在原来的属性值
    attributesBackUp(attributes) {
        const temp = {};
        for(let i in attributes) if(attributes.hasOwnProperty(i)) {
            temp[i] = this.ctx[i];
            this.ctx[i] = attributes[i];
        }
        return(temp);
    },
    //将输入属性全部赋值给this
    attributesAssignment(attributes) {
        for(let i in attributes) if(attributes.hasOwnProperty(i)) {
            this.ctx[i] = attributes[i];
        }
    },
    //恢复默认属性
    attributesDefault() {
        //默认属性
        const Default = {
            "fillStyle":"#000000",
            "font":"10px sans-serif",
            "globalAlpha":1,
            "globalCompositeOperation":"source-over",
            "imageSmoothingEnabled":true,
            "lineCap":"butt",
            "lineDashOffset":0,
            "lineJoin":"miter",
            "lineWidth":1,
            "miterLimit":10,
            "shadowBlur":0,
            "shadowColor":"rgba(0, 0, 0, 0)",
            "shadowOffsetX":0,
            "shadowOffsetY":0,
            "strokeStyle":"#000000",
            "textAlign":"start",
            "textBaseline":"alphabetic"
        };
        //默认属性赋值
        for(let i in Default) if (Default.hasOwnProperty(i)) {
            this.ctx[i] = Default[i];
        }
    },
    //绘制直线
    line(way, attributes, save = true) {
        let temp;
        if (save) {
            temp = this.attributesBackUp(attributes);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(way[0][0], way[0][1]);
        for (let i = 1; i < way.length; i++) {
            this.ctx.lineTo(way[i][0], way[i][1]);
        }
        this.ctx.stroke();
        if (save) {
            this.attributesAssignment(temp);
        }
    },
    //实心方块
    fillRect(start, long, attributes) {
        //只输入了属性的情况下，默认覆盖全部区域
        if(typeof start === "object" && long === u && attributes === u) {
            attributes = start;
            start = [0,0];
            long = [this.length.width, this.length.height];
        }
        const temp = this.attributesBackUp(attributes);
        this.ctx.fillRect(start[0], start[1], long[0], long[1]);
        this.attributesAssignment(temp);
    },
    //空心方框
    strokeRect(start, long, attributes) {
        const temp = this.attributesBackUp(attributes);
        this.ctx.strokeRect(start[0], start[1], long[0], long[1]);
        this.attributesAssignment(temp);
    },
    //绘制圆形
    circle(x, y, r, attributes, save = true) {
        let temp;
        if (save) {
            temp = this.attributesBackUp(attributes);
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI*2, true);
        this.ctx.fill();
        if (save) {
            this.attributesAssignment(temp);
        }
    },
    //清理画布
    clear(a, b) {
        //a是左上角坐标，b是x、y轴长度
        if(a === u || b === u) {
            this.ctx.clearRect(0, 0, this.length.width, this.length.height);
        } else {
            this.ctx.clearRect(a[0], a[1], b[0], b[1]);
        }
    },
    //toDataURL
    toDataURL(...args) {
        return(this.elementDOM.toDataURL(...args));
    },
    //绘制文字
    toText(text, position, attributes, save = true) {
        let temp;
        if (save) temp = this.attributesBackUp(attributes);
        this.ctx.fillText(text, position[0], position[1]);
        if (save) this.attributesAssignment(temp);
    },
    //将其他canvas图形会绘制自身
    drawImage(...args) {
        this.ctx.drawImage(...args);
    }
};
//波形绘制窗口类
function Graph(Data, DOM, type) {
    //实例初始化
    this.elementDOM = $(DOM);
    this.type = type;
    this.output = Data;
    this.long = {};
    this.time = $("#endtime").prop("value").toVal(),
    this.stepTime = $("#stepsize").prop("value").toVal();

    //计算各种坐标
    const left = 80,            //左侧边栏宽度
        top = 10,             //顶层间隔宽度
        bottomHeight = 70,    //底栏高度
        //整个背景画布的宽高
        Width = this.elementDOM.width(),
        Height = this.elementDOM.height();

    this.long.waveWidth = Width - left - 10;
    this.long.waveHeight = Height - bottomHeight - top;
    this.long.waveRound = [
        [left, top],
        [left, top + this.long.waveHeight],
        [left + this.long.waveWidth, top + this.long.waveHeight],
        [left + this.long.waveWidth, top]
    ];
    //整个输出序列的最大最小值（Y轴最大最小值）
    const valueStart = [
        Math.minOfArray(Data.map((n) => Math.minOfArray(n.data))),
        Math.maxOfArray(Data.map((n) => Math.maxOfArray(n.data)))
    ];
    //绘制背景
    this.drawBackground([0, this.time], valueStart, true);
    //创建曲线画布
    for (let i = 0; i < Data.length; i++) {
        this.elementDOM.append($("<canvas>", {
            "class": "graph-canvas",
            "width": this.long.waveWidth - 2,
            "Height": this.long.waveHeight - 2,
            "id": "graph-" + this.output[i].name,
            "style": "position: absolute; left: 81px; top: 11px; display: block"
        }));
    }
    //绘制曲线
    this.drawCurve();
    //当前曲线状态为全部显示
    for(let i = 0; i < this.output.length; i++) {
        this.output[i].status = true;
    }
    //添加动态操作集合DIV
    const actionDiv = this.elementDOM.append($("<div>", {
        "class": "graph-action",
        "style": "position: absolute; left: 80px; top: 10px;" +
        "width: " + this.long.waveWidth + "px; Height: " + this.long.waveHeight + "px;"
    }));
    //创建轴线画布
    actionDiv.append($("<canvas>", {
        "class": "graph-action-canvas",
        "width": this.long.waveWidth,
        "Height": this.long.waveHeight,
        "style": "position: absolute; left: 0px; top: 0px;"
    }));
    //创建曲线说明DIV
    for(let i = 0; i < this.output.length + 1; i++) {
        actionDiv.append($("<div>", {
            "class": "graph-action-tip",
            "style": "position: absolute; display: none;"
        }));
    }
    //最后一层div覆盖整个曲线窗口，防止误操作
    actionDiv.append($("<div>", {
        "class": "graph-action-cover",
        "style": "position: absolute; left: 0px; top: 0px;" +
        "width: " + this.long.waveWidth + "px; Height: " + this.long.waveHeight + "px;"
    }));
    //添加右上角图例
    this.createTable();
}
Graph.prototype = {
    //绘制背景
    drawBackground(time, value, expend = false) {
        //取出数据
        const waveWidth = this.long.waveWidth,
            waveHeight = this.long.waveHeight,
            waveRound = this.long.waveRound,
            //寻找或者创建背景画布
            background = this.elementDOM.childSelect("canvas.graph-background", 1, {
                "width": this.elementDOM.width() + "px",
                "height": this.elementDOM.height() + "px",
                "style": "position: absolute; left: 0px; top: 0px;"
            });

        //当前坐标轴序列
        this.axisList = [];

        //创建画笔
        const drawer = new Graphics(background[0]);
        //面板背景
        drawer.fillRect(waveRound[0], [waveWidth, waveHeight], {
            "fillStyle" : "#fffdf6"
        });
        //边缘阴影
        drawer.line(waveRound.slice(1,4), {
            "shadowOffsetX" : 2,
            "shadowOffsetY" : 2,
            "shadowBlur" : 3,
            "shadowColor" : "rgba(0, 0, 0, 0.7)",
            "strokeStyle" : "#999999"
        });
        drawer.line(waveRound.slice(0,2), {
            "shadowOffsetX" : -2,
            "shadowOffsetY" : 2,
            "shadowBlur" : 3,
            "shadowColor" : "rgba(0, 0, 0, 0.7)",
            "strokeStyle" : "#999999"
        });
        //设置画笔属性
        drawer.attributesAssignment({
            "strokeStyle": "#cccccc",
            "lineWidth": 1
        });
        //绘制轴线
        for(let i = 0; i < 2; i++) {
            const item = [time, value][i],
                pixel = [this.long.waveWidth, this.long.waveHeight][i],
                [axisMin, axisMax, count] = extendLine(item, pixel),
                axisLong = (axisMax - axisMin).toSFixed(),
                splitLong = (axisLong / count).toSFixed(),
                axisList = [axisMin];
            //坐标轴分割值
            while (axisList[axisList.length - 1] < axisMax) {
                axisList.push((axisList[axisList.length - 1] + splitLong).toSFixed());
            }
            //不扩展坐标时收缩当前列表
            if(!expend) { reduceList(axisList, item); }
            //按照序列绘制坐标网格
            this.drawGrid(i, axisList, drawer);
            //保存当前坐标轴序列
            this.axisList[i] = axisList;
        }
        //画笔属性恢复默认
        drawer.attributesDefault();
        //绘制边框
        drawer.strokeRect(waveRound[0], [waveWidth, waveHeight], {
            "strokeStyle" : "#999999",
            "lineWidth" : 2
        });
    },
    //坐标网格
    drawGrid(label, axis, drawer) {
        const waveRound = this.long.waveRound,
            attr = [{   //x轴
            "name": "graph-bottomList",
            "way": function (x) {
                return ([
                    [waveRound[0][0] + Math.round(x) + 0.5, waveRound[0][1]],
                    [waveRound[0][0] + Math.round(x) + 0.5, waveRound[1][1] + 5]
                ]);
            },
            "tagStyle": function (x) {
                return ("top: 8px; transform: rotate(35deg); left: " + (waveRound[0][0] + x - 10) + "px")
            },
            "signStyle": (waveRound[2][0] + 10) + "px"
        }, {   //y轴
            "name": "graph-leftList",
            "way": function (x) {
                return ([
                    [waveRound[2][0], waveRound[1][1] - Math.round(x) - 0.5],
                    [waveRound[1][0] - 4, waveRound[1][1] - Math.round(x) - 0.5]
                ]);
            },
            "tagStyle": function (x) {
                return ("right: 0px; top: " + (waveRound[1][1] - x - 9) + "px")
            },
            "signStyle": "75px"
        }],
            sidebar = this.elementDOM.childSelect("div." + attr[label].name, 1),
            lists = sidebar.childSelect("div.axis-number", axis.length),
            unit = sidebar.childSelect("div.axis-unit", 1),
            eachPixel = [this.long.waveWidth, this.long.waveHeight][label] / (axis[axis.length - 1] - axis[0]),

            maxSxis = Math.maxOfArray(axis).toShort(),
            rank = maxSxis.rank,
            power = maxSxis.number.powRank(),

            type = label
                ? ((this.type === "voltage") ? "V" : "A")
                : "s";

        //添加单位
        unit.text(maxSxis.unit + type);
        unit.attr("style", "left:" + attr[label].signStyle);

        //绘制轴线
        for (let i = 0; i < axis.length; i++) {
            const axisLast = (axis[i - 1])
                    ? (Math.round((axis[i - 1] - axis[0]) * eachPixel) - 0.5)
                    : (-30),
                axisNow = Math.round((axis[i] - axis[0]) * eachPixel) - 0.5;

            drawer.line(attr[label].way(axisNow));

            if (axisNow - axisLast > 20) {
                lists.get(i).attr("style", attr[label].tagStyle(axisNow))
                    .text((axis[i] * rank).toSFixed().toFixed(4 - power));
            } else {
                lists.get(i).remove();
            }
        }
    },
    //绘制曲线
    drawCurve() {
        const [timeStart, timeEnd, valueMin, valueMax] = this.backgroundStartToEnd(),
            pixelSplitX = this.long.waveWidth / (timeEnd - timeStart).toSFixed(),
            pixelSplitY = this.long.waveHeight / (valueMax - valueMin).toSFixed(),
            //精确求解输出时间间隔的长度
            outputTimeSplit = this.time / (this.output[0].data.length - 1);

        for(let i = 0; i < this.output.length; i++) {
            const name = this.output[i].name,
                data = this.output[i].data,
                darwLine = [];

            for(let j = 0; j < data.length; j++) {
                darwLine.push([
                    pixelSplitX * (j * outputTimeSplit - timeStart),
                    this.long.waveHeight - pixelSplitY * (data[j] - valueMin) - 1.25    //每个点的原点是左上角，现在要把点放到中点
                ]);
            }
            const drawer = new Graphics(document.getElementById("graph-" + name));
            drawer.clear();
            drawer.line(darwLine, {
                "strokeStyle" : color[i],
                "lineWidth" : 2.5
            });
        }
    },
    //创建图例
    createTable() {
        //添加table本体
        const table = this.elementDOM.append($("<table>",{
            "class": "graph-table-legend"
        })).append($("<tbody>"));

        //有多少波形就添加多少行
        for(let i = 0; i < this.output.length; i++) {
            //行元素
            const row = table.append($("<tr>", {
                "class": "graph-table-row",
                "id" : "table-legend-" + this.output[i].name
            }));
            //图例颜色框
            row.append($("<td>", {
                "class": "graph-table-swatch-column"
            })).append($("<div>", {
                "class": "table-legend-swatch-outline"
            })).append($("<div>", {
                "class": "table-legend-swatch",
                "style": "border-color:" + color[i] + ";background-color: " + color[i] + ";"
            }));
            //文字说明
            const textTd = row.append($("<td>", {
                "class": "graph-table-legend graph-table-legend-label"
            }));
            const text = this.output[i].name.split("_");
            if (text[1]) {
                textTd.text(text[0] + "(" + text[1] + ")");
            } else {
                textTd.inner(text[0]);
            }
        }
    },
    //绘制x轴线
    drawMove(x, y) {
        //画线
        const drawer = new Graphics(this.elementDOM[0].querySelector(".graph-action-canvas"));
        drawer.clear();
        drawer.line([[x, 0], [x, this.long.waveHeight]],{
            strokeStyle: "#bbbbbb",
            lineWidth: 1
        });

        const [backTimeStart, backTimeEnd, backValueMin, backValueMax] = this.backgroundStartToEnd(),
            stepTime = this.stepTime,
            width = this.long.waveWidth,
            height = this.long.waveHeight,
            error = 5,
            time2Pixel = (backTimeEnd - backTimeStart) / width,
            timeMinSub = Math.round((((x - error < 2) ? 2 : x - error) * time2Pixel + backTimeStart) / stepTime),
            timeMaxSub = Math.round((((x + error > width - 2) ? width - 2 : x + error) * time2Pixel + backTimeStart) / stepTime),

            value2Pixel = (backValueMax - backValueMin) / height,
            valueMax = backValueMax - ((y - error < 2) ? 2 : y - error) * value2Pixel,
            valueMin = backValueMax - ((y + error > height - 2) ? height - 2 : y + error) * value2Pixel;

        let min = Infinity, sub = -1;
        if(typeof y === "number") {
            //鼠标在当前面板，搜索合适的index
            for (let i = 0; i < this.output.length; i++) {
                if (!this.output[i].status) {
                    continue;
                }
                const data = this.output[i].data;
                for (let j = timeMinSub; j <= timeMaxSub; j++) {
                    if (data[j] > valueMin && data[j] < valueMax) {
                        const positionX = (j * stepTime - backTimeStart) / time2Pixel,
                            positionY = (backValueMax - data[j]) / value2Pixel,
                            distance = Math.abs(positionX - x) + Math.abs(positionY - y);

                        if (distance < min) {
                            min = distance;
                            sub = j;
                        }
                    }
                }
            }
        } else if(typeof y === "string" && y.search("index:") !== -1) {
            //鼠标不在当前面板，直接显示index的数值
            sub = Number(y.split(":")[1]);
        }


        const tips = $(".graph-action-tip", this.elementDOM),
            unit = (this.type === "voltage") ? "V" : "A";
        if(sub !== -1) {
            tips.attr("style", "position:absolute; display: block");
            const circleX = (sub * stepTime - backTimeStart) / time2Pixel;

            for(let i = 0; i < this.output.length; i++) {
                const valueNow = this.output[i].data[sub];
                if(this.output[i].status && valueNow < backValueMax && valueNow > backValueMin) {
                    //曲线显示
                    const circleY = (backValueMax - valueNow) / value2Pixel;
                    drawer.circle(circleX, circleY, 5, {
                        "fillStyle": color[i]
                    });
                    tips.get(i).text(valueNow.toShort(5).txt + unit)
                        .css({ right: (width - circleX) + "px", bottom: (height - circleY) + "px" });
                } else {
                    //曲线隐藏
                    tips.get(i).attr("style", "display: none");
                }
            }
            tips.get(-1).text((sub * stepTime).toShort(5).txt + "s")
                .css({ right: (width - circleX) + "px", bottom: "0px" });

            return("index:" + sub);
        } else {
            tips.attr("style", "display: none");
            return(false);
        }
    },
    //清空动作画布
    clearActionCanvas() {
        const canvas = $(".graph-action-canvas", this.elementDOM)[0],
            drawer = canvas.getContext("2d");
        drawer.clearRect(0, 0, this.long.waveWidth, this.long.waveHeight);

        $(".graph-action-tip", this.elementDOM)
            .attr("style", "display: none");
    },
    //绘制选择框
    drawSelect(event, current) {
        //初次运行，计算临时变量
        if(!current.drawer) {
            current.drawer = new Graphics(current.canvas);
            current.offset = $(current.canvas).offset($("div#graph-page"));
        }

        //面板外框线宽度
        const border = 2,
            drawer = current.drawer,
            size = current.drawer.length,
            offset = [
                event.offsetX - current.offset[0],
                event.offsetY - current.offset[1]
            ];

        //源元素和触发元素不同，定位offset需要重新计算
        if(event.target !== event.currentTarget) {
            let node = event.target;
            //offset是鼠标所在源元素到块级元素的偏移
            while(node.tagName.toLowerCase() !== "div") {
                node = node.parentNode;
            }
            //求当前块级元素到page的偏移值
            while(node !== event.currentTarget) {
                offset[0] += node.offsetLeft;
                offset[1] += node.offsetTop;
                node = node.parentNode;
            }
        }

        //选中范围
        let left = Math.min(current.start[0], offset[0]),
            right = Math.max(current.start[0], offset[0]),
            top = Math.min(current.start[1], offset[1]),
            bottom = Math.max(current.start[1], offset[1]);

        //范围限定
        if(left < border) { left = border; }
        if(top < border) { top = border; }
        if(right > size.width - border) { right = size.width - border; }
        if(bottom > size.height - border) { bottom = size.height - border; }

        const start = [left, top],                  //左上角坐标
            long = [right - left, bottom - top];    //x、y轴长度

        //绘制方框
        drawer.clear();
        drawer.fillRect({"fillStyle": "rgba(187,187,187,0.5)"});
        drawer.clear(start, long);
        drawer.strokeRect(start, long, {"strokeStyle": "#aaaaaa"});

        //保存当前范围
        current.select = [left, top, right, bottom];
    },
    //返回当前背景的XY轴起始和终止坐标
    backgroundStartToEnd() {
        return([
            this.axisList[0][0],                            //当前时间起点
            this.axisList[0][this.axisList[0].length - 1],  //当前时间终点
            this.axisList[1][0],                            //当前值起点
            this.axisList[1][this.axisList[1].length - 1]   //当前值终点
        ]);
    },
    //由像素到实际值
    pixel2Value(range) {
        const [timeStart, timeEnd, valueMin, valueMax] = this.backgroundStartToEnd(),
            time2pixel = (timeEnd - timeStart).toSFixed() / this.long.waveWidth,
            value2pixel = (valueMax - valueMin).toSFixed() / this.long.waveHeight,
            time = [range[0], range[2]].map((n) => (n * time2pixel + timeStart).toSFixed(4)),
            value = [range[3], range[1]].map((n) => (valueMax - n * value2pixel).toSFixed(4));

        return([time, value]);
    }
};
//把整个波形页面转换成图像
Graph.toImage = function() {
    if(page.attr("class").search("visionAll") === -1) {
        throw("波形界面尚未打开，无法转换");
    }

    //创建临时画布，网页数据流中不显示
    const tempCanvas = new Graphics($("<canvas>", {
        "style" : "display: none",
        "height" : page.height() + "px",
        "width" : page.width() + "px"
    })[0]);
    //绘制背景
    tempCanvas.fillRect([0,0], [tempCanvas.length.width, tempCanvas.length.height], {
        "fillStyle" : background
    });
    //绘制标题
    $("div#graph-title span").each((n) => {
        const elem = $(n),
            offset = elem.offset(page),
            position = [offset[0], offset[1] + 15.5];

        /*
        对于文字而言，offset求得的是元素左上角到page元素左上角的距离
        然而对于canvas而言，书写文字的时候，是以文字左下角为起点坐标的，所以这里写文字的坐标需要加上文字自身的高度，文字自身是16px
         */

        tempCanvas.toText(elem.text(), position, {
            "font" : "16px Microsoft YaHei"
        });
    });
    //说明文字属性
    tempCanvas.attributesAssignment({
        "font" : "10px Arial"
    });
    //横向文字
    $("div.graph-individual div.graph-leftList div.axis-number, " +
        "div.graph-individual div.axis-unit").each((n) => {
        const elem = $(n),
            offset = elem.offset(page),
            position = [offset[0], offset[1] + 10.5];

        tempCanvas.toText(elem.text(), position, {}, false);
    });
    //绘制波形
    $("div.graph-individual canvas.graph-background, " +
        "div.graph-individual canvas.graph-individual, " +
        "div.graph-individual canvas.graph-canvas").each((n) => {
        const position = $(n).offset(page);
        tempCanvas.drawImage(n, position[0], position[1]);
    });
    //画笔属性恢复默认
    tempCanvas.attributesDefault();
    //绘制图例
    $("div.graph-individual tbody").each((table) => {
        const elem = $(table),
            position = elem.offset(page).map((n) => n + 0.5),
            size = [elem.innerWidth(), elem.innerHeight()];

        tempCanvas.fillRect(position, size, {
            "fillStyle" : "rgba(255, 255, 255, 0.6)"
        });
        tempCanvas.strokeRect(position, size, {
            "strokeStyle" : "#cccccc",
            "lineWidth" : 1
        });

        //每行的内框
        $("div.table-legend-swatch-outline", table).each((n, i) => {
            const elem = $(n),
                position =  elem.offset(page).map((n) => n + 1.5),
                size = [elem.innerWidth() + 1, elem.innerHeight() + 1];

            if(i) {
                position[1] -= 1;
            }

            tempCanvas.strokeRect(position, size, {
                "strokeStyle" : "#cccccc",
                "lineWidth" : 1
            });
        });
        //每行的色块
        $("div.table-legend-swatch", table).each((n, i) => {
            const elem = $(n),
                position =  elem.offset(page).map((n) => n + 1),
                //这里是border的宽度
                size = [n.clientLeft * 2, n.clientTop * 2];

            if(i) {
                position[1] -= 1;
            }

            tempCanvas.fillRect(position, size, {
                "fillStyle" : elem.attr("style").split(";")[0].split(":")[1]
            });
        });
        //每行的说明
        $("td.graph-table-legend.graph-table-legend-label", table).each((n, i) => {
            const elem = $(n),
                position =  elem.offset(page);

            position[0] += 1;
            if(i) {
                position[1] += 12;
            } else {
                position[1] += 13;
            }

            tempCanvas.toText(elem.text(), position, {
                "font" : "10px Arial",
                "fillStyle" : "#696969"
            });
        });
    });
    //x轴坐标斜着的文字
    tempCanvas.attributesAssignment({
        "font" : "10px Arial"
    });
    const deg = 35 / 180 * Math.PI;     //倾斜角度
    tempCanvas.ctx.rotate(deg);
    $(".graph-bottomList .axis-number").each((n) => {
        const elem = $(n),
            position = elem.offset(page),
            x1 = position[0] / Math.cos(deg),
            y1 = position[0] * Math.tan(deg),
            y2 = position[1] - y1,
            x2 = y2 * Math.sin(deg);
        tempCanvas.toText(elem.text(), [x1 + x2, y2 * Math.cos(deg)], {}, false);
    });
    return(tempCanvas.toDataURL());
}

export { Graph };
'use strict';

import { $ } from './jquery';
import { iniData, SVG_NS } from './init';
import { schMap } from './maphash';
import { Point } from './point';
import { LineClass } from './lines';
import { Solver } from './solver';
import { Graph } from './graph';
import { styleRule } from './styleRule';
import { PartClass } from './parts';
import { partsAll, partsNow } from './collection';
import './test';

//全局变量定义
const doc = document,
    u = undefined;
//图纸网格模块
const grid = (function SchematicsGrid() {
    //模块对象
    const self = {};
    //持续型状态标志位
    let flag = 0;
    const continuous = [
        'newMark',      //新建器件标志位
        'moveParts',    //移动器件标志位
        'pasteParts',   //粘贴器件
        'moveMap',      //移动图纸标志位
        'selectBox',    //绘制复选框标志位
        'deformLine',   //导线变形标志位
        'moveText',     //移动txt标志位
        'drawLine',     //绘制导线标志位
        'graphSelecte'  //波形选择框标志位
    ];
    //标志位
    for (let i = 0; i < continuous.length; i++) {
        //这是块级作用域，所以不必在内部再保存i的值
        Object.defineProperty(self, continuous[i], {
            enumerable: true,
            configurable: true,

            get() {
                return (!!(flag & (1 << i)));
            }
        });
        const setValue = 'set' + continuous[i].substring(0, 1).toUpperCase() + continuous[i].substring(1);
        //对标志位的操作必须通过此函数
        self[setValue] = function(value) {
            value = Number(!!value);
            if (value) {
                flag |= 1 << i;
            } else {
                flag &= 0xFFFF ^ (1 << i);
            }
        };
    }
    //总标志位
    Object.defineProperty(self, 'totalMarks', {
        enumerable: true,
        configurable: true,

        get() {
            return (!!flag);
        },
        //禁止直接操作属性
        //set() {}
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

    const copyStack = [],   //复制器件堆栈
        revocation = [],    //撤销堆栈，最多保留10次操作
        textTip = $('<div>', {id: 'error-tip', class: 'disappear'});

    $('#editor-container').append(textTip);

    //当前鼠标位置
    function mouse(event) {
        return (Point([
            (event.pageX - SVGX) / zoom,
            (event.pageY - SVGY) / zoom
        ]));
    }
    //鼠标偏移位置
    function mouseBias(event) {
        const ans = Point([
            (event.pageX - mouseLastX) / zoom,
            (event.pageY - mouseLastY) / zoom
        ]);
        mouseLastX = event.pageX;
        mouseLastY = event.pageY;
        return (ans);
    }
    //保存器件属性
    function save(arr) {
        const ans = [];

        for (let i = 0; i < arr.length; i++) {
            ans.push(arr[i].toSimpleData());
        }

        return (ans);
    }

    self.size = function(num) {
        if (num === u) {
            return (size);
        } else {
            size = num;
        }
    };
    self.rate = function(num) {
        if (num === u) {
            return (rate);
        } else {
            rate = num;
        }
    };
    self.zoom = function(num) {
        if (num === u) {
            return (zoom);
        } else {
            zoom = num;
        }
    };
    self.bias = function(x, y) {
        if (x === u && y === u) {
            return ([placeX, placeY]);
        } else if (x !== u && y !== u) {
            placeX = x;
            placeY = y;
        } else if (x instanceof Array && u === u) {
            placeX = x[0];
            placeY = x[1];
        }
    };
    self.SVG = function(x, y) {
        if (x === u && y === u) {
            return ([SVGX, SVGY]);
        } else if (x !== u && y !== u) {
            SVGX = x;
            SVGY = y;
        } else if (x instanceof Array && u === u) {
            SVGX = x[0];
            SVGY = x[1];
        }
    };
    self.mouse = function(event) {
        return ( mouse(event) );
    };
    self.createData = function(event) {
        //偏移量初始化
        mouseBias(event);

        //初始数据
        const ans = {
            zoom: self.zoom(),
            SVG: self.SVG(),
            mouse,
            mouseBias,
            gridL: []
        };
        if (event.pageX && event.pageY) {
            ans.pageL = mouse(event);
            ans.gridS = Point([event.pageX, event.pageY]).floor();
        }
        return (ans);
    };

    //复制
    self.copy = function(arr) {
        const data = arr ? arr : partsNow;

        let move = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].current.status === 'move') {
                move.push(data[i]);
            }
        }
        move = save(move);

        copyStack.length = 0;
        for (let i = 0; i < move.length; i++) {
            copyStack.push(move[i]);
        }
    };
    //剪切
    self.cut = function() {
        let half = [];
        const move = [];
        //保存变形导线
        for (let i = 0; i < partsNow.length; i++) {
            if (partsNow[i].current.status === 'move') {
                move.push(partsNow[i]);
            } else {
                half.push(partsNow[i]);
            }
        }
        //复制
        self.copy(partsNow);
        //记录数据
        half = save(half);
        //删除
        move.forEach((n) => n.deleteSelf());
        //再粘贴部分导线
        self.paste(half);
        partsNow.forEach((n) => {
            n.elementDOM.removeAttr('opacity');
            n.nodeToConnect(0);
            n.nodeToConnect(1);
            n.markSign();
        });
    };
    //粘贴
    self.paste = function(arr) {
        const now = arr ? arr : copyStack, name = [];

        partsNow.deleteAll();
        for (let i = 0; i < now.length; i++) {
            const data = now[i];
            if (data.partType === 'config') {
                for (const j in data) {
                    if (data.hasOwnProperty(j)) {
                        $('#' + j).prop('value', data[j]);
                    }
                }
                continue;
            } else if (data.partType !== 'line') {
                partsNow.push(new PartClass(data));
            } else {
                partsNow.push(new LineClass(data));
            }

            const part = partsNow.get(-1), id = {};
            //记录新旧id
            if (data.id && data.id !== part.id) {
                id.old = data.id;
                id.new = partsNow.get(-1).id;
                name.push(id);
            }

            part.current = {};
            part.current.status = 'move';
            part.elementDOM.attr('opacity', 0.4);
        }

        //替换新旧id
        for (let i = 0; i < name.length; i++) {
            for (let j = 0; j < partsNow.length; j++) {
                for (let k = 0; k < partsNow[j].connect.length; k++) {
                    const part = partsNow[j],
                        con = part.connect[k],
                        old = name[i].old,
                        id = name[i].new;

                    part.connect[k] = con.replace(old, id);
                }
            }
        }
        //删除不存在的器件连接
        for (let i = 0; i < partsNow.length; i++) {
            const part = partsNow[i],
                con = part.connect;
            for (let j = 0; j < con.length; j++) {
                con[j] = con[j].split(' ')
                    .filter((n) => partsNow.has(n))
                    .join(' ');
            }
        }
        //合并部分导线
        for (let i = 0; i < partsNow.length; i++) {
            const line = partsNow[i],
                con = line.connect;
            if (!line.isExist() || line.partType !== 'line') {
                continue;
            }

            for (let j = 0; j < 2; j++) {
                if (line.connectStatus(j) === 'line' &&
                    con[j].split(' ').length === 1) {
                    line.mergeLine(con[j]);
                }
            }
        }
        //清理器件集合
        partsNow.deleteParts((n) => n.isExist());
    };
    //记录当前所有器件状态
    self.now = function() {
        const ans = [];
        for (let i = 0; i < partsAll.length; i++) {
            ans.push(partsAll[i].toSimpleData());
        }
        if (!ans.isEqual(revocation.get(-1))) {
            revocation.push(ans);
        }
        if (revocation.length > 10) {
            revocation.splice(0, 1);
        }
    };
    //撤销
    self.revocate = function(arr) {
        //取出上次的操作
        const last = arr ? arr : revocation.pop();
        if (!last) { return (false); }

        //删除图中所有器件
        partsNow.deleteAll();
        partsAll.forEach((n) => partsNow.push(n));
        partsNow.forEach((n) => n.deleteSelf());
        partsNow.deleteAll();
        partsAll.deleteAll();

        //加载指定数据
        grid.paste(last);
        partsNow.deleteAll();
        //放置器件
        for (let i = 0; i < partsAll.length; i++) {
            partsAll[i].elementDOM.removeAttr('opacity');
            partsAll[i].render && partsAll[i].render();
            partsAll[i].markSign();
        }
        //确定连接关系
        for (let i = 0; i < partsAll.length; i++) {
            if (partsAll[i].partType === 'line') {
                partsAll[i].nodeToConnect(0);
                partsAll[i].nodeToConnect(1);
            }
        }
    };
    //复制堆栈中是否有数据
    self.isPaste = function() {
        return (!!copyStack.length);
    };
    //记录堆栈是否有数据
    self.isRevocate = function() {
        return (!!revocation.length);
    };
    //错误提示
    self.error = function(text) {
        textTip.text(text);
        textTip.attr('style', '');
        textTip.removeClass('disappear');

        //5秒后消失
        setTimeout(() => textTip.addClass('disappear'), 5000);
        //6秒后脱离文档流
        setTimeout(() => textTip.css('z-index', '-10'), 6000);
    };

    //保留的全局临时变量
    self.current = [];
    //封闭模块
    Object.seal(self);

    //返回模块对象
    return (self);
})();
//全局jq元素定义
const sidebar = $('#sidebar-menu'),
    action = $('#action-container'),
    mainPage = $('#container-grid'),
    parameter = $('#parameter-menu'),
    graphPage = $('#graph-page'),
    context = $('#right-button-menu');

//鼠标移动的入口函数
function mousemoveEvent(event) {
    if (!grid.totalMarks) { return (false); }

    switch (true) {
        //器件移动
        case grid.newMark:
        case grid.pasteParts:
        case grid.moveParts: {
            partsNow.moveParts(event);
            break;
        }
        //图纸移动
        case grid.moveMap: {
            //移动图纸时不需要对鼠标距离做缩放
            const bias = grid.current.mouseBias(event)
                .mul(grid.current.zoom);

            if (bias.isEqual([0, 0])) {
                return (false);
            }

            //只有确实移动了，才会让鼠标变形
            mainPage.attr('class', 'mouse-movemap');

            let SVGPos = grid.SVG();
            grid.SVG(SVGPos[0] + bias[0], SVGPos[1] + bias[1]);

            SVGPos = grid.SVG();
            grid.bias(
                SVGPos[0] % grid.size(),
                SVGPos[1] % grid.size()
            );
            mainPage.css('background-position', grid.bias().join('px ') + 'px');
            $('#area-of-parts').attr('transform',
                'translate(' + SVGPos.join(', ') + ') scale(' + grid.zoom() + ')');

            break;
        }
        //绘制多选框
        case grid.selectBox: {
            const node = grid.mouse(event),
                start = grid.current.selectionBoxStart,
                maxLen = Math.max(
                    Math.abs(node[0] - start[0]),
                    Math.abs(node[1] - start[1])
                );

            $('#select-box').attr('points',
                start.join(', ') + ' ' +
                node[0] + ', ' + start[1] + ' ' +
                node.join(', ') + ' ' +
                start[0] + ', ' + node[1]
            );
            (maxLen > 3) && mainPage.attr('class', 'mouse-selectBox');
            break;
        }
        //导线变形
        case grid.deformLine: {
            partsNow[0].setPath(event, 'deformation');
            break;
        }
        //移动器件说明文字
        case grid.moveText: {
            partsNow[0].move(event, 'text');
            break;
        }
        //绘制导线
        case grid.drawLine: {
            partsNow.get(-1).setPath(event, 'draw');
            break;
        }
        //绘制波形界面选择框
        case grid.graphSelecte: {
            grid.current.graph.drawSelect(event, grid.current);
            break;
        }
        //其他
        default: {
            break;
        }
    }

    return (false);
}
//清除当前所有状态
function clearStatus() {
    contextSet();
    for (let i = 0; i < partsNow.length; i++) {
        partsNow[i].toNormal();
    }
    partsNow.deleteAll();
    partsNow.current = {};
}
//右键菜单
function contextSet(event, status) {
    const contextMenu = $('#right-button-menu'),
        rotateId = [
            '#clockwise-direction',
            '#anticlockwise-direction',
            '#X-Mirror',
            '#Y-Mirror'
        ];

    //关闭右键菜单
    if (status === 'close' || status === u) {
        contextMenu.attr('class', '');
        $('.right-button-option', contextMenu).each((n) => $(n).removeClass('disable'));
        return (false);
    }

    contextMenu.attr('class', 'right-' + status);
    //先放置在左上角，透明度为0
    contextMenu.css({
        'left': 0,
        'top': 0,
        'opacity': 0
    });
    //强制刷新菜单，并获取菜单大小
    const win = $(window),
        Height = win.height(),
        Width = sidebar.hasClass('open-add-parts')
            ? win.width() - sidebar.width()
            : win.width(),
        menuWidth = contextMenu.width(),
        menuHeight = contextMenu.height(),
        left = (Width - event.pageX < menuWidth)
            ? event.pageX - menuWidth
            : event.pageX,
        top = (Height - event.pageY < menuHeight)
            ? event.pageY - menuHeight
            : event.pageY;

    contextMenu.css({
        'left': left + 'px',
        'top': top + 'px',
        'opacity': 1
    });

    if (status.indexOf('part') !== -1) {
        //器件部分，旋转功能可行性
        const rotate = partsNow.isRotate();
        for (let i = 0; i < 4; i++) {
            const elem = $(rotateId[i]);
            rotate[i]
                ? elem.removeClass('disable')
                : elem.addClass('disable');
        }
    } else if (status === 'map') {
        //图纸部分，撤销和粘帖功能是否可用
        let elem = $('#right-undo');
        grid.isRevocate()
            ? elem.removeClass('disable')
            : elem.addClass('disable');

        elem = $('#parts-paste');
        grid.isPaste()
            ? elem.removeClass('disable')
            : elem.addClass('disable');
    }

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
        graphMain = $('#graph-main'),
        graphWidth = (totalHeight * ratio < totalWidth) ? totalHeight * ratio : totalWidth,
        graphForm = graphMain.childSelect('div.graph-individual', maxForm);

    //删除DOM中的所有元素
    for (let i = 0; i < graphForm.length; i++) {
        const form = graphForm.get(i);
        form.childrens().remove();
        form.css('height', boxHeight + 'px');
    }

    //设置波形页面宽度
    graphPage.attr('style', 'width: ' + graphWidth + 'px');
    //创建波形
    for (let i = 0; i < 2; i++) {
        const label = ['voltage', 'current'][i];
        if (data[label].length) {
            const sub = (graphForm.length === 2) ? i : 0;
            graphForm.get(sub).attr('id', 'graphForm-' + i);
            graphForm.get(sub).prop('_data', new Graph(data[label], graphForm[sub], label));
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
        ].map((n) => n.join('px ')).join('px,') + 'px';

    graphPage.attr('class', 'run');

    const circle = graphPage.append($('<div>', {
        'id': 'background-circle',
        'style': 'position: absolute; background-color: #66CCCC; border-radius: 50%;' +
        '-webkit-clip-path: polygon(' + clipPath + ');' +
        'margin : 0; right: ' + actionRight + 'px; bottom: ' + actionBottom + 'px; ' +
        'width: ' + (2 * R) + 'px; height: ' + (2 * R) + 'px; transform: translate(50%,50%)'
    }));
    const anime = new styleRule('graph-vision');
    anime.setRule('0%', {
        'width' : '0px',
        'height' : '0px',
        '-webkit-clip-path' : 'circle(0)'
    });
    anime.setRule('100%', {
        'width' : 2 * R + 'px',
        'height' : 2 * R + 'px',
        '-webkit-clip-path': 'circle(200vh)'
    });

    setTimeout(function() {
        graphPage.attr('class', 'visionAll');
        circle.remove();
    }, 600);
}

//网页元素相关事件
//添加器件菜单中器件的所有事件
sidebar.on({
    mousemove(event){
        $('#float-tool-tip').css({
            bottom : (window.innerHeight - event.pageY) + 'px',
            right : (window.innerWidth - event.pageX) + 'px'
        });
    },
    mouseenter(event){
        const text = $(event.currentTarget).prop('introduction');
        $('#float-tool-tip').css({
            display: 'block',
            width: (text.length * 16) + 'px'
        }).text(text);
    },
    mouseleave(){
        $('#float-tool-tip').css({
            display: 'none'
        }, true);
    },
    click(event){
        if (event.which === 1 && !grid.totalMarks) {
            clearStatus();
            grid.now();
            grid.setNewMark(true);

            (new PartClass(event.currentTarget.id)).toFocus();

            partsNow.checkLine();
            partsNow.current = grid.createData(event);
            partsNow.current.pageL = partsNow.center();
            partsNow.moveParts({pageX: -50000, pageY: -50000});
            mainPage.on('mousemove', mousemoveEvent);
        }
    }
}, '.parts-list');
//点击添加器件菜单栏的关闭按钮
sidebar.on('click', '#menu-add-parts-close', function(event) {
    if (event.which === 1) {
        $('#menu-add-parts-close').addClass('disappear');
        $(document.body).removeClass('open-sidebar open-gray');
        sidebar.removeClass('open-menu-config open-add-parts');
    }
});
//打开设置边栏
action.on('click', '#fab-config', function(event) {
    if (event.which === 1) {
        $(document.body).addClass('open-sidebar open-gray');
        sidebar.addClass('open-menu-config');
    }
});
//打开添加器件边栏
action.on('click', '#fab-adds', function(event) {
    if (event.which === 1) {
        $(document.body).addClass('open-sidebar');
        sidebar.addClass('open-add-parts');
        $('#menu-add-parts-close').removeClass('disappear');
    }
});
//时域模拟
action.on('click', '#fab-run', function(event) {
    if (event.which !== 1) { return (false); }
    clearStatus();

    const delayTime = 10,   //延迟时间，单位毫秒
        fabs = action.childrens(),
        fabRun = $('#fab-run'),
        fabText = $('#fab-text'),
        text = fabText.childrens(0),
        data = {voltage: [], current: []};

    //建立电路求解器
    const diagrams = partsAll.connectGraph()
        .map(function(n) {
            const ans = { solver: new Solver(n) };
            ans.iteration = ans.solver.solve();
            return (ans);
        });
    //错误代码
    let error = '';

    if (!diagrams.length) {
        //电路图为空
        grid.error('电路图不能为空');
        return (false);
    } else if (diagrams.some((n) => (error = n.solver.error))) {
        //某电路网络有错误
        grid.error(error);
        return (false);
    }

    //求解前先变换图标
    for (let i = 1; i < fabs.length; i++) {
        fabs.get(i).css('display', 'none');
    }
    fabRun.css('display', 'none');
    fabText.css('display', '');
    text.text('0%');

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
            text.text(diagrams[0].now.value + '%');
            setTimeout(process, delayTime);
        } else {
            text.text('100%');
            for (let i = 0; i < diagrams.length; i++) {
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
                text.text('');
                fabRun.css('display', '');
                fabText.css('display', 'none');
                for (let i = 1; i < fabs.length; i++) {
                    fabs.get(i).css('display', '');
                }
            }, 1000);
        }
    }, delayTime);
});
//器件属性菜单的取消键
parameter.on('click', '#parameter-bottom-cancel', function() {
    $(doc.body).removeClass('open-gray');
    parameter.css('z-index', '20');
    parameter.attr('class', 'parameter-close');

    setTimeout(function() {
        parameter.css('z-index', '');
    }, 350);
});
//器件属性菜单的确定键
parameter.on('click', '#parameter-bottom-accept', function() {
    //记录数据
    grid.now();
    //检查输入数据的格式
    if (partsNow[0].inputVision()) {
        $(doc.body).removeClass('open-gray');
        parameter.css('z-index', '20');
        parameter.attr('class', 'parameter-close');
        setTimeout(function() {
            parameter.css('z-index', '');
        }, 350);
    }
});
//鼠标滚轮事件
mainPage.on('mousewheel', function(event) {
    if (!$(doc.body).hasClass('open-gray')) {
        const mousePosition = [ event.pageX, event.pageY ];

        const sizeL = grid.size();
        if (event.deltaY > 0) {
            grid.size(sizeL - 5);
        } else if (event.deltaY < 0) {
            grid.size(sizeL + 5);
        }

        if (grid.size() < 20) {
            grid.size(20);
            return (true);
        }
        if (grid.size() > 80) {
            grid.size(80);
            return (true);
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
            'background-size': size + 'px',
            'background-position': grid.bias().join('px ') + 'px'
        });
        $('#area-of-parts').attr('transform', 'translate(' + SVGPos.join(', ') + ') scale(' + grid.zoom() + ')');
    }
});
//鼠标点击黑幕
$('#shade-gray').on('click', function() {
    const body = $(doc.body);
    if (body.hasClass('open-sidebar')) {
        body.removeClass('open-gray open-sidebar');
        sidebar.removeClass('open-menu-config open-add-parts');
    }
});

//器件相关事件
//器件mousedown事件
mainPage.on('mousedown', 'g.editor-parts .focus-part, g.editor-parts path, g.editor-parts .features-text', function(event) {
    if (grid.totalMarks) {
        return false;
    }
    //寻找当前器件的对象
    const clickpart = partsAll.findPart(event.currentTarget.parentNode.id);
    if (event.which === 1) {
        if (event.currentTarget.tagName === 'text') {
            //单击器件说明文本
            clearStatus();
            const text = $(this);
            clickpart.toFocus();
            clickpart.current = grid.createData(event)
                .extend({
                    text,
                    position: Point([
                        parseInt(text.attr('x')),
                        parseInt(text.attr('y'))
                    ])
                });
            grid.setMoveText(true);
        } else {
            //单击本体
            if (!partsNow.has(clickpart.id)) {
                //单个器件
                clearStatus();
                clickpart.toFocus();
            } else {
                //多个器件
                contextSet();
            }
            partsNow.checkLine();
            partsNow.moveStart();
            partsNow.current = grid.createData(event);
            grid.now();
            grid.setMoveParts(true);
        }
        //绑定全局移动事件
        mainPage.on('mousemove', mousemoveEvent);
    } else if (event.which === 3) {
        const parts = partsNow.filter((n) => n.partType !== 'line');

        if (parts.has(clickpart.id) && (parts.length > 1)) {
            //多个器件的右键
            partsNow.checkLine();
            contextSet(event, 'parts');
        } else {
            //单个器件的右键
            clearStatus();
            clickpart.toFocus();
            partsNow.checkLine();
            //参考地的右键时，隐藏“编辑参数”选项
            (clickpart.partType === 'reference_ground')
                ? contextSet(event, 'parts')
                : contextSet(event, 'part');
        }
    }
    //阻止事件冒泡
    return (false);
});
//器件双击事件
mainPage.on('dblclick', 'g.editor-parts .focus-part, g.editor-parts path, g.editor-parts .features-text', function(event) {
    const clickpart = partsAll.findPart(event.currentTarget.parentNode.id);
    if (event.which === 1 && !grid.totalMarks &&
        clickpart.partType !== 'reference_ground') {
        clickpart.viewParameter(grid.zoom(), grid.SVG());
    }
});
//鼠标经过器件和导线
mainPage.on({
    mouseenter(event) {
        const tagName = event.currentTarget.tagName.toLowerCase(),
            elem = $(event.currentTarget);

        if (!grid.totalMarks) {
            if (tagName === 'rect' || tagName === 'text') {
                //经过导线和器件
                mainPage.attr('class', 'mouse-movepart');
            } else if (tagName === 'g' && elem.hasClass('point-close')) {
                //经过关闭的引脚
                mainPage.attr('class', 'mouse-closepoint');
            } else if (tagName === 'g' && elem.hasClass('point-open')) {
                //经过开放的引脚
                mainPage.attr('class', 'mouse-line');
            }
        } else if (grid.drawLine) {
            if (tagName !== 'text' && !elem.hasClass('line-rect')) {
                //绘制导线时鼠标经过器件
                const line = partsNow.get(-1);
                line.current.enforceAlign.extend({
                    flag: true,
                    onPart: true,
                    part: partsAll.findPart(event.currentTarget.parentNode.id)
                });
            }
        }
    },
    mouseleave() {
        if (!grid.totalMarks) {
            //没有状态，鼠标恢复默认
            mainPage.attr('class', '');
        } else if (grid.drawLine) {
            const line = partsNow.get(-1);
            if (line.current.enforceAlign.label) {
                line.current.enforceAlign.extend({
                    flag: true,
                    part: false,
                    onPart: false
                });
            }
        }
    },
}, 'g.editor-parts rect.focus-part, g.editor-parts g.part-point, g.editor-parts text, g.line rect.line-rect');
//导线mousedown事件
mainPage.on('mousedown', 'g.line rect.line-rect', function(event) {
    if (grid.totalMarks) { return false; }

    clearStatus();
    grid.now();
    const line = partsAll.findPart(this.parentNode.id);
    line.toFocus();
    if (event.which === 1) {
        line.current = grid.createData(event);
        line.startPath(event, 'deformation');
        grid.setDeformLine(true);
        mainPage.on('mousemove', mousemoveEvent);
    } else if (event.which === 3) {
        contextSet(event, 'line');
    }

    //阻止事件冒泡
    return (false);
});

//左键器件引脚mousedown，绘制导线开始
mainPage.on('mousedown', 'g.editor-parts g.part-point', function(event) {
    if (event.which === 1 && !grid.totalMarks) {
        clearStatus();
        grid.now();
        grid.setDrawLine(true);

        const part = partsAll.findPart(event.currentTarget.parentNode.id),
            mark = parseInt(event.currentTarget.id.split('-')[1]),
            point = part.position.add(part.pointRotate()[mark].position),
            connect = part.connect[mark],
            line = connect
                ? partsAll.findPart(connect)
                : new LineClass([point]);

        line.toFocus();
        line.current = grid.createData(event);

        if (!connect) {
            part.toFocus();
            part.setConnect(mark, line.id);
            line.setConnect(0, part.id + '-' + mark);
            line.startPath(event, 'draw', 'new');
        } else {
            line.startPath(event, 'draw');
        }

        mainPage.attr('class', 'mouse-line');
        mainPage.on('mousemove', mousemoveEvent);
    }
    return (false);
});
//导线临时结点的mousedown操作
mainPage.on('mousedown', 'g.line g.draw-open', function(event) {
    if (event.which === 1 && !grid.totalMarks) {
        const line = partsAll.findPart(event.currentTarget.parentNode.id);

        clearStatus();
        grid.now();
        grid.setDrawLine(true);
        line.toFocus();
        line.current = grid.createData(event);
        line.startPath(event, 'draw', 'new');
        mainPage.attr('class', 'mouse-line');
        mainPage.on('mousemove', mousemoveEvent);
    }
    return (false);
});
//交错节点事件
mainPage.on({
    mousemove(event) {
        if (!grid.totalMarks) {
            const mouse = grid.mouse(event),
                mouseRound = mouse.roundToSmall(),
                bias = mouse.add(-1, mouseRound.mul(20));

            let tempdi = '', tempVector = [];
            if (Math.abs(bias[0]) > Math.abs(bias[1])) {
                if (bias[0] > 0) {
                    tempdi = 'right';
                    tempVector = mouseRound.add([1, 0]);
                } else {
                    tempdi = 'left';
                    tempVector = mouseRound.add([-1, 0]);
                }
            } else {
                if (bias[1] > 0) {
                    tempdi = 'down';
                    tempVector = mouseRound.add([0, 1]);
                } else {
                    tempdi = 'up';
                    tempVector = mouseRound.add([0, -1]);
                }
            }
            const mouseConnect = schMap.getValueBySmalle(mouseRound).connect;
            if (mouseConnect.some((n, i) => (tempVector.isEqual(mouseConnect[i])))) {
                mainPage.attr('class', 'mouse-cross' + tempdi);
            } else {
                mainPage.attr('class', '');
            }
        }
        return (false);
    },
    mouseleave(){
        if (!grid.totalMarks) {
            mainPage.attr('class', '');
        }
        return (false);
    },
    mousedown(event) {
        if (event.which === 1 && !grid.totalMarks) {
            grid.now();
            grid.setDrawLine(true);

            const mouseRound = grid.mouse(event).roundToSmall(),
                style = (mainPage.attr('class') || '').match(/right|left|up|down/),
                dire = {
                    'right': [1, 0],
                    'left': [-1, 0],
                    'up':   [0, -1],
                    'down':  [0, 1]
                }[style],
                point = mouseRound.add(dire),
                id = schMap.getValueBySmalle(point).id,
                line = partsAll.findPart(id),
                lines = schMap.getValueBySmalle(mouseRound).id.split(' '),
                del = lines.length === 4 ? false : 'new';

            if (!style) { return false; }

            partsNow.deleteAll();

            line.toFocus();
            line.current = grid.createData(event);
            line.startPath(event, 'draw', del);

            mainPage.attr('class', 'mouse-line');
            mainPage.on('mousemove', mousemoveEvent);
        }
    }
}, 'g.line g.cross-point');
//图纸全局的mousedown操作
mainPage.on('mousedown', function(event) {
    //有持续性事件，那么直接返回
    if (grid.totalMarks)  { return (false); }

    clearStatus();
    if (event.which === 1) {
        //左键
        $('#area-of-parts').append($('<polygon>', SVG_NS, {id: 'select-box'}));
        grid.current.selectionBoxStart = grid.mouse(event);
        grid.setSelectBox(true);
    } else if (event.which === 3) {
        //右键
        grid.current = grid.createData(event);
        grid.setMoveMap(true);
    }
    mainPage.on('mousemove', mousemoveEvent);
});
//图纸的全局mouseup操作
mainPage.on('mouseup', function(event) {
    //是否取消mousemove事件标志位
    let off = true;
    if (event.which === 1) {
        //左键
        switch (true) {
            //新建器件
            case grid.newMark: {
                grid.setNewMark(false);
                partsNow.putDownParts('new');
                break;
            }
            //粘贴器件
            case grid.pasteParts: {
                if (partsNow.putDownParts('paste')) {
                    grid.setPasteParts(false);
                } else {
                    off = false;
                }
                break;
            }
            //移动器件
            case grid.moveParts: {
                grid.setMoveParts(false);
                partsNow.putDownParts();
                break;
            }
            //绘制多选框
            case grid.selectBox: {
                const node = grid.mouse(event),
                    top = Math.min(grid.current.selectionBoxStart[1], node[1]),
                    bottom = Math.max(grid.current.selectionBoxStart[1], node[1]),
                    left = Math.min(grid.current.selectionBoxStart[0], node[0]),
                    right = Math.max(grid.current.selectionBoxStart[0], node[0]);

                clearStatus();
                for (let i = 0; i < partsAll.length; i++) {
                    const position = partsAll[i].position;
                    if (partsAll[i].partType !== 'line' &&
                        position[0] >= left && position[0] <= right &&
                        position[1] >= top && position[1] <= bottom) {
                        partsAll[i].toFocus();
                    }
                }
                $('#select-box').remove();
                partsNow.checkLine();
                grid.setSelectBox(false);
                break;
            }
            //导线变形
            case grid.deformLine: {
                grid.setDeformLine(false);
                partsNow[0].putDown(event, 'deformation');
                break;
            }
            //移动器件属性说明文字
            case grid.moveText: {
                grid.setMoveText(false);
                partsNow[0].textVisition(partsNow[0].current.text.attr(['x', 'y']));
                break;
            }
            //导线绘制
            case grid.drawLine: {
                grid.setDrawLine(false);
                partsNow.get(-1).putDown(event, 'draw');
                break;
            }
            //其他
            default: {
                clearStatus();
            }
        }
    } else if ((event.which === 3) && (grid.moveMap)) {
        //右键放开，且正在移动图纸移动整个图纸结束
        grid.setMoveMap(false);
        grid.current = [];
        //如果没有这个标签，说明鼠标没有移动，那么弹出右键菜单
        if (!mainPage.hasClass('mouse-movemap')) {
            clearStatus();
            contextSet(event, 'map');
        }
    }
    //全局解除移动事件
    off && mainPage.off('mousemove', mousemoveEvent);
    //鼠标恢复原样
    off && mainPage.attr('class', '');
});

//曲线面板事件
//取消缩放
graphPage.on('click', '#waveRecover', function() {
    $('#graph-main .graph-individual').each((n) => {
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
graphPage.on('click', '#waveToImage', function() {
    const graphImg = $(window.open('about:blank').document.body);
    graphImg.css({
        'margin': '0px',
        'padding': '0px'
    });
    graphImg.append($('<img>', {
        'src' : Graph.toImage()
    }));
});
//输出数据
graphPage.on('click', '#waveToData', function() {
    const data = [],
        dataPage = window.open('about:blank'),
        graphData = $('#graph-main .graph-individual').map((n) => n._data),
        stepTime = graphData[0].stepTime;

    let ans = '<p>time,';

    for (let i = 0; i < graphData.length; i++) {
        for (let j = 0; j < graphData[i].output.length; j++) {
            data.push(graphData[i].output[j]);
        }
    }
    for (let i = 0; i < data.length; i++) {
        ans += data[i].name + ', ';
    }
    ans += '</p>';
    for (let i = 0; i < data[0].data.length; i++) {
        ans += '<p>' + (i * stepTime).toSFixed() + ', ';
        for (let j = 0; j < data.length; j++) {
            ans += data[j].data[i] + ', ';
        }
        ans += '</p>';
    }
    dataPage.document.body.innerHTML = ans;
});
//关闭面板
graphPage.on('click', '#waveClose', function() {
    graphPage.attr('class', 'disappear');
    setTimeout(function() {
        graphPage.attr({
            'class': 'silence',
            'style': 'display:none;'
        });
    }, 500);
});
//点击面板的图例
graphPage.on('click', 'tr.graph-table-row', function(event) {
    const id = event.currentTarget.id.split('-').pop(),
        graph = $('#graph-' + id),
        display = [/display *: *none/, /display *: *block/];

    //波形显示
    const attribute = graph.attr('style');
    if (attribute.search(display[0]) !== -1) {
        graph.attr('style', attribute.replace(display[0], 'display:block'));
    } else if (attribute.search(display[1]) !== -1) {
        graph.attr('style', attribute.replace(display[1], 'display:none'));
    }
    //标签删除线
    const text = event.currentTarget.querySelector('.graph-table-legend-label');
    if (text.innerHTML.search('strike') !== -1) {
        text.innerHTML = text.innerHTML.replace(/<\/?strike>/g, '');
    } else {
        text.innerHTML = text.innerHTML.strike();
    }
    //波形显示标志位
    const data = event.currentTarget.parentNode.parentNode.parentNode._data;
    for (let i = 0; i < data.output.length; i++) {
        if (data.output[i].name === id) {
            data.output[i].status = !data.output[i].status;
        }
    }
});
//面板之上鼠标移动
graphPage.on('mousemove', '.graph-action', function(event) {
    if (!grid.totalMarks) {
        const graphTarget = event.currentTarget.parentNode._data,
            graphs = $('#graph-main .graph-individual').map((n) => n._data),
            vision = graphTarget.drawMove(event.offsetX, event.offsetY);

        for (let i = 0; i < graphs.length; i++) {
            if (graphs[i] !== graphTarget) {
                graphs[i].drawMove(event.offsetX, vision);
            }
        }
        //这里运行之后禁止冒泡
        return (false);
    }
});
//鼠标移出面板
graphPage.on('mouseleave', '.graph-action', function() {
    if (!grid.totalMarks) {
        $('#graph-main .graph-individual').each((n) => n._data.clearActionCanvas());
        return (false);
    }
});
//波形界面鼠标点下
graphPage.on('mousedown', '.graph-action', function(event) {
    if (event.which !== 1) { return (false); }

    if (!grid.totalMarks) {
        //清空所有面板画布
        $('#graph-main .graph-individual').each((n) => n._data.clearActionCanvas());

        grid.current = {
            graph: event.currentTarget.parentNode._data,
            start: [event.offsetX, event.offsetY],
            canvas: event.currentTarget.querySelector('.graph-action-canvas')
        };
        grid.setGraphSelecte(true);
        //绑定鼠标移动事件
        graphPage.on('mousemove', mousemoveEvent);
        graphPage.addClass('mouse-select');
    }
});
//波形界面的鼠标移动
graphPage.on('mouseup', function() {
    if (grid.totalMarks && grid.graphSelecte) {
        //取消移动事件绑定
        graphPage.off('mousemove', mousemoveEvent);
        graphPage.removeClass('mouse-select');
        //标志位置低
        grid.setGraphSelecte(false);

        //重绘当前面板
        const graph = grid.current.graph,
            [time, value] = graph.pixel2Value(grid.current.select);

        graph.clearActionCanvas();
        graph.drawBackground(time, value);
        graph.drawCurve();

        //其余面板需要根据时间轴缩放
        $('#graph-main .graph-individual').each(function(n) {
            if (n._data !== graph) {
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

//右键菜单
//编辑参数
context.on('click', '#edit-parameters', function(event) {
    const clickpart = partsNow.get(0);
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        clickpart.viewParameter(grid.zoom(), grid.SVG());
    }
    return (false);
});
//顺时针旋转
context.on('click', '#clockwise-direction', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        if (partsNow.isRotate(0)) {
            partsNow.rotate(0);
        }
    }
    return (false);
});
//逆时针旋转
context.on('click', '#anticlockwise-direction', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        if (partsNow.isRotate(1)) {
            partsNow.rotate(1);
        }
    }
    return (false);
});
//沿X轴镜像
context.on('click', '#X-Mirror', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        if (partsNow.isRotate(2)) {
            partsNow.rotate(2);
        }
    }
    return (false);
});
//沿Y轴镜像
context.on('click', '#Y-Mirror', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        if (partsNow.isRotate(3)) {
            partsNow.rotate(3);
        }
    }
    return (false);
});
//复制
context.on('click', '#parts-copy', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        grid.copy(partsNow);
    }
    return (false);
});
//剪切
context.on('click', '#parts-cut', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        grid.cut();
    }
    return (false);
});
//粘贴
context.on('click', '#parts-paste', function(event) {
    if (event.which === 1 && !grid.totalMarks && grid.isPaste()) {
        contextSet();
        grid.paste();
        grid.setPasteParts(true);

        partsNow.checkLine();
        partsNow.current = grid.createData(event);
        partsNow.current.pageL = partsNow.center();
        partsNow.moveParts({pageX: -50000, pageY: -50000});
        mainPage.on('mousemove', mousemoveEvent);
    }
    return (false);
});
//全选
context.on('click', '#parts-all', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        partsAll.forEach((n) => n.toFocus());
        partsNow.checkLine();
    }
    return (false);
});
//删除
context.on('click', '#parts-delete', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        partsNow.forEach((n) => n.deleteSelf());
        partsNow.deleteAll();
    }
    return (false);
});
//撤销
context.on('click', '#right-undo', function(event) {
    if (event.which === 1 && !grid.totalMarks && !$(this).hasClass('disable')) {
        contextSet();
        if (grid.isRevocate()) {
            grid.revocate();
        }
    }
    return (false);
});

//键盘事件
$('body').on('keydown', function(event) {
    if (grid.totalMarks) { return (false); }

    //触发右键事件函数
    function trigger(selector) {
        $(selector).trigger({
            type: 'click',
            which: 1,
            currentTarget: $(selector)[0]
        });
    }

    switch (true) {
        //ctrl + D，顺时针旋转
        case (event.ctrlKey && (event.keyCode === 68)): {
            trigger('#clockwise-direction');
            break;
        }
        //ctrl + alt + D，逆时针旋转
        case (event.ctrlKey && event.altKey && (event.keyCode === 68)) :{
            trigger('#anticlockwise-direction');
            break;
        }
        //alt + X，X轴镜像
        case (event.altKey && (event.keyCode === 88)): {
            trigger('#X-Mirror');
            break;
        }
        //alt + C，Y轴镜像
        case (event.altKey && (event.keyCode === 67)): {
            trigger('#Y-Mirror');
            break;
        }
        //ctrl + A，全选
        case (event.ctrlKey && (event.keyCode === 65)): {
            trigger('#parts-all');
            break;
        }
        //ctrl + V，粘贴
        case (event.ctrlKey && (event.keyCode === 86)): {
            trigger('#parts-paste');
            break;
        }
        //ctrl + C，复制
        case (event.ctrlKey && (event.keyCode === 67)): {
            trigger('#parts-copy');
            break;
        }
        //ctrl + X，剪切
        case (event.ctrlKey && (event.keyCode === 88)): {
            trigger('#parts-cut');
            break;
        }
        //ctrl + Z，撤销操作
        case (event.ctrlKey && (event.keyCode === 90)): {
            trigger('#right-undo');
            break;
        }
        //Delete，删除
        case (event.keyCode === 46): {
            trigger('#parts-delete');
            break;
        }
        //Esc，取消
        case (event.keyCode === 27): {
            if ($('#parameter-menu').hasClass('parameter-open')) {
                trigger('#parameter-bottom-cancel');
            }
            break;
        }
        //Enter，回车
        case (event.keyCode === 13): {
            if ($('#parameter-menu').hasClass('parameter-open')) {
                trigger('#parameter-bottom-accept');
            } else if (sidebar.hasClass('open-menu-config')){
                trigger('#shade-gray');
            }
            break;
        }
    }
});

//页面加载完毕之后运行初始化
doc.body.onload = function() {
    //读取地址信息
    const cover = $('#load-cover'),
        src = window.location.href.split('?')[1],
        parameters = {};

    //分解输入参数
    if (src && src.length) {
        const data = src.split('&');
        for (let i = 0; i < data.length; i++) {
            const obj = data[i].replace(/#/g, '').split('=');
            parameters[obj[0]] = obj[1];
        }
    }

    //加载参数
    if (parameters.init) {
        grid.revocate(iniData[parameters.init]);
    }

    //去掉灰幕
    cover.css('opacity', 0);
    const timer = setInterval(function() {
        if (cover.css('display') === 'none') {
            clearInterval(timer);
        } else {
            cover.css('display', 'none');
        }
    }, 300);
};

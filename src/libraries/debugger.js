'use strict';
// import { schMap } from './maphash';

const doc = document, NS = window.$SVG_NS;

class MapDebug {
    constructor() {
        this.$el = doc.createElementNS(NS, 'g');
        this.$el.setAttribute('class', 'map-debugger');
    }
    point(node, color = 'black', mul = 1) {
        const el = doc.createElementNS(NS, 'circle');
        el.setAttribute('stroke-width', '3');
        el.setAttribute('fill', 'transparent');
        el.setAttribute('class', 'debug-point');
        el.setAttribute('stroke', color);
        el.setAttribute('cx', node[0] * mul);
        el.setAttribute('cy', node[1] * mul);
        el.setAttribute('r', '3');

        this.$el.appendChild(el);
    }
    clearPoint() {
        this.$el
            .querySelectorAll('.debug-point')
            .forEach((el) => el.remove());
    }
    clearAll() {
        Array.from(this.$el.childNodes)
            .forEach((el) => el.remove());
    }
}
// function MapDebug() {
//     this.$el = doc.createElement('g');
//     this.$el.setAttribute('class', 'map-debugger');
// }
// MapDebug.prototype = {
//     point([x, y], color = '#00ff00', mul = 1) {
//         const el = doc.createElement('circle');

//         this.test.append($('<circle>', {
//             'stroke-width': '3',
//             'fill': 'transparent',
//             'stroke': color,
//             'cx': x * mul,
//             'cy': y * mul,
//             'r': 3,
//         }));
//     },
// path(way, color = '#ff0000') {
//     let wayData = 'M' + way[0].join(', ');
//     for (let i = 1; i < way.length; i++) {
//         wayData += 'L' + way[i].join(', ');
//     }
//     this.test.append($('<path>', SVG_NS, {
//         'stroke-width': '2',
//         'fill': 'transparent',
//         'stroke': color,
//         'd': wayData,
//         'class': 'testPath'
//     }));
// },
// text([x, y], text) {
//     this.test.append($('<text>', SVG_NS, {
//         x,
//         y,
//         fill: '#3B4449',
//         'stroke-width': '0',
//         'font-size': '14'
//     })).text(text);
// },
// clear(className) {
//     switch (className) {
//         case 'Point' :
//             this.test.childrens('.testPoint').remove();
//             return true;
//         case 'Path' :
//             this.test.childrens('.testPath').remove();
//             return true;
//         case undefined :
//             this.test.childrens().remove();
//             return true;
//         default :
//             return (false);
//     }
// },
// whole() {
//     let countx = 0;
//     for (let i = 0; i < partsAll.length; i++) {
//         if (partsAll[i].partType === 'line') {
//             this.text(
//                 [1000, countx * 25 + 50],
//                 partsAll[i].connect[0] + '--->' + partsAll[i].id + '--->' + partsAll[i].connect[1]
//             );
//             countx ++;
//         }
//     }
//     countx ++;
//     const mapNodes = schMap.toSmallNodes();
//     for (let k = 0; k < mapNodes.length; k++) {
//         const i = mapNodes[k][0],
//             j = mapNodes[k][1],
//             tempstatus = schMap.getValueBySmalle(mapNodes[k]);

//         if (tempstatus.form === 'part-point') {
//             //红色
//             this.point([i, j], '#ff0000', 20, 4);
//         } else if (tempstatus.form === 'part') {
//             //黑色
//             this.point([i, j], '#000000', 20, 4);
//         }

//         if (tempstatus.connect) {
//             for (let k = 0; k < tempstatus.connect.length; k++) {
//                 const connect = tempstatus.connect,
//                     tempx = connect[k][0] - i,
//                     tempy = connect[k][1] - j;
//                 if (tempx < 0) {
//                     this.path([[i * 20, j * 20 - 3], [connect[k][0] * 20, connect[k][1] * 20 - 3]], '#000000');
//                 } else if (tempx > 0) {
//                     this.path([[i * 20, j * 20 + 3], [connect[k][0] * 20, connect[k][1] * 20 + 3]], '#000000');
//                 } else if (tempy < 0) {
//                     this.path([[i * 20 - 3, j * 20], [connect[k][0] * 20 - 3, connect[k][1] * 20]], '#000000');
//                 } else if (tempy > 0) {
//                     this.path([[i * 20 + 3, j * 20], [connect[k][0] * 20 + 3, connect[k][1] * 20]], '#000000');
//                 }
//             }
//             if (tempstatus.form === 'line') {
//                 //蓝色
//                 this.point([i, j], '#0000ff', 20, 4);
//             } else if (tempstatus.form === 'cross-point') {
//                 //黄色
//                 this.point([i, j], '#dcfc02', 20, 4);
//             } else if (tempstatus.form === 'line-point') {
//                 //绿色
//                 this.point([i, j], '#02fc31', 20, 4);
//             } else if (tempstatus.form === 'cover-point') {
//                 //绿色
//                 this.point([i, j], '#E9967A', 20, 4);
//             }
//         }
//         if (tempstatus.form === 'line') {
//             this.text([i * 20 + 5, j * 20 + 15], tempstatus.id.split('_')[1]);
//         } else if (tempstatus.form === 'part-point') {
//             this.text([i * 20 + 5, j * 20 + 15], tempstatus.id.split('-')[1]);
//         } else if (tempstatus.form === 'cross-point') {
//             this.path([[i * 20, j * 20], [1000, countx * 25 + 50]], '#222222');
//             this.text([1000, countx * 25 + 50], tempstatus.id);
//             countx++;
//         } else if (tempstatus.form === 'cover-point') {
//             this.path([[i * 20, j * 20], [1000, countx * 25 + 50]], '#222222');
//             this.text([1000, countx * 25 + 50], tempstatus.id);
//             countx++;
//         }
//     }
// },
// };

export default MapDebug;

// 科学计数法匹配正则
const NUM_REG = /^\d+(?:\.\d+)?$|^\d+?(?:\.\d+)?[eE]-?\d+$|^\d+(?:\.\d+)?[puμnmkMG]$/;

// 科学计数法转换为实际数字
function numParser(str) {
    if (str.search(/[eE]/) !== -1) {
        const label = str.split(/[eE]/);
        return (+label) * Math.pow(10, +label[1]);
    } else if (str.search(/[puμnmkMG]/) !== -1) {
        const exp = { p: -12, u: -9, μ: -9, n: -6, m: -3, k: 3, M: 6, G: 9 },
            label = exp[str[str.length - 1]];

        str = str.substring(0, str.length - 1);
        return (+str) * Math.pow(10, label);
    } else {
        return +str;
    }
}

export { NUM_REG, numParser };

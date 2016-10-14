import { $ } from "./jquery"

//css动画属性类
class styleRule {
    constructor(name) {
        let styleSheet = document.styleSheets;
        let index = -1;
        for (let i = 0; i < styleSheet.length; i++) {
            if(!styleSheet[i].href) index = i;
            if(styleSheet[i].cssRules) for (let j = 0; j < styleSheet[i].cssRules.length; j++){
                if(styleSheet[i].cssRules[j].name === name) {
                    this.original = styleSheet[i].cssRules[j];
                    return(this);
                }
            }
        }
        //当前样式表中没有搜索到以index为名的样式，那么在本地样式表中创建一个以index为名的样式
        //没有本地样式表，那么就创建一个
        if(index === -1) {
            const head = $("head");
            head.append($("<style>"));
            //更新列表
            styleSheet = document.styleSheets;
            index = styleSheet.length - 1;
        }
        //css规则集合
        const cssStyleSheet = styleSheet[index];
        cssStyleSheet.insertRule("@keyframes " + name + "{}", cssStyleSheet.cssRules.length);
        this.original = cssStyleSheet.cssRules[cssStyleSheet.cssRules.length - 1];
        return(this);
    }
    setRule(index, rules) {
        const cssRule = this.original;
        cssRule.deleteRule(index);
        let tempRule = "";
        for (let i in rules) if(rules.hasOwnProperty(i)) {
            tempRule += i + ":" + rules[i] + ";";
        }
        tempRule = index + " {" + tempRule + "}";
        cssRule.appendRule(tempRule);
    }
}

export { styleRule };
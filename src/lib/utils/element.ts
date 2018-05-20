import { makeMap } from './shared';

/** 命名空间数据 */
export const namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML',
};

/** 是否是 HTML 元素 */
export const isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot',
);

/**
 * 是否是 SVG 元素
 *  - this map is intentionally selective, only covering SVG elements that may contain child elements.
 */
export const isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true,
);

/** 是否是 pre 元素 */
export const isPreTag = (tag: string) => tag === 'pre';

/** 是否是浏览器内置元素 */
export const isReservedTag = (tag: string) => isHTMLTag(tag) || isSVG(tag);

/** 获取当前元素的命名空间值 */
export function getTagNamespace(tag: string) {
    if (isSVG(tag)) {
        return namespaceMap.svg;
    }
    else if (tag === 'math') {
        return namespaceMap.math;
    }
}

/** 是否是 text 或者 input 类型元素 */
export const isTextInputType = makeMap('text,number,password,search,email,tel,url');

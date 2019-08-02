/** 按钮行为 */
export const enum MenuAction {
    separat,

    edit,

    copy,
    cut,
    paste,
    delete,

    clockwise,
    anticlockwise,
}

/** 按钮显示模式 */
export const enum MenuMode {
    space,
    line,
    singlePart,
    multipleParts,
}

interface MenuData {
    action: MenuAction;
    mode: MenuMode[];
    title?: string;
    tooltip?: string;
}

/** 器件编辑 */
const edit: MenuData[] = [
    {
        action: MenuAction.edit,
        mode: [MenuMode.singlePart],
        title: '编辑参数',
    },
];

/** 器件操作 */
const opration: MenuData[] = [
    {
        action: MenuAction.copy,
        mode: [MenuMode.singlePart, MenuMode.multipleParts],
        title: '复制',
        tooltip: 'Ctrl+C',
    },
    {
        action: MenuAction.cut,
        mode: [MenuMode.singlePart, MenuMode.multipleParts],
        title: '剪切',
        tooltip: 'Ctrl+X',
    },
    {
        action: MenuAction.paste,
        mode: [MenuMode.singlePart, MenuMode.multipleParts],
        title: '粘贴',
        tooltip: 'Ctrl+V',
    },
    {
        action: MenuAction.delete,
        mode: [MenuMode.singlePart, MenuMode.multipleParts],
        title: '删除',
        tooltip: 'Delete',
    },
];

/** 旋转 */
const rotate: MenuData[] = [
    {
        action: MenuAction.clockwise,
        mode: [MenuMode.singlePart, MenuMode.multipleParts],
        title: '顺时针旋转',
        tooltip: 'Ctrl+C',
    },
    {
        action: MenuAction.anticlockwise,
        mode: [MenuMode.singlePart, MenuMode.multipleParts],
        title: '逆时针旋转',
        tooltip: 'Ctrl+C',
    },
];

/** 按照当前的模式生成右键菜单列表 */
export function getMenu(mode: MenuMode) {
    const all = [edit, rotate, opration];
    const item: Array<Omit<MenuData, 'mode'>> = [];

    all.forEach((wait) => {
        const lists = wait.filter(({ mode: waitMode }) => waitMode.includes(mode));

        if (lists.length > 0) {
            item.push(...item);
            item.push({
                action: MenuAction.separat,
            });
        }
    });

    return item;
}

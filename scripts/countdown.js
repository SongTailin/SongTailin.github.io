/**
 * 实时倒计时模块（多实例版）
 * 支持单个/多个元素批量初始化，每个倒计时独立运行
 * 全局调用方式：startCountdown(element, targetTime, options)
 *
 * @param {string|HTMLElement} element CSS选择器 或 DOM元素
 * @param {string|Date|number} targetTime 全局默认目标时间
 * @param {Object} options 全局配置选项
 * @returns {Function} 停止所有匹配倒计时的函数
 */
function startCountdown(element, targetTime, options = {}) {
    // 收集所有需要初始化的节点
    let nodes = [];
    if (typeof element === "string") {
        nodes = Array.from(document.querySelectorAll(element));
    } else if (element instanceof HTMLElement) {
        nodes = [element];
    }

    if (nodes.length === 0) {
        console.error("找不到匹配的倒计时元素：" + element);
        return function () {};
    }

    const stopFunctions = [];

    // 逐个初始化每个倒计时（完全独立，互不影响）
    nodes.forEach(node => {
        // 优先使用节点自身 data-target-time，覆盖全局时间
        const nodeTargetTime = node.dataset.targetTime || targetTime;
        const stop = initSingleCountdown(node, nodeTargetTime, options);
        stopFunctions.push(stop);
    });

    // 返回统一停止函数
    return function stopAll() {
        stopFunctions.forEach(fn => fn());
    };
}

/**
 * 单个倒计时的初始化逻辑（内部函数）
 */
function initSingleCountdown(node, targetTime, options = {}) {
    // 防重复初始化：清理已有定时器
    if (node._countdownTimer) {
        clearInterval(node._countdownTimer);
        node._countdownTimer = null;
    }

    // 1. 解析目标时间
    function parseTargetTime(value) {
        if (value instanceof Date) return value.getTime();
        if (typeof value === "number") return value;
        if (typeof value !== "string" || !value.trim()) return NaN;

        let timeString = value.trim().replace(" ", "T");
        if (/^\d{4}-\d{2}-\d{2}$/.test(timeString)) {
            timeString += "T00:00:00";
        }
        timeString = timeString.replace(/\//g, "-");

        const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timeString);
        if (!hasTimezone) {
            timeString += "+08:00";
        }
        return Date.parse(timeString);
    }

    const targetTimestamp = parseTargetTime(targetTime);
    if (!Number.isFinite(targetTimestamp)) {
        node.textContent = "时间格式无效";
        console.error("目标时间格式无效：", targetTime);
        return function () {};
    }

    // 2. 全局配置默认值
    const defaultOptions = {
        align: "center",
        fontSize: "36px",
        interval: 1000,
        expiredText: "00天 00:00:00",
        applyInlineStyle: true,
        style: {}
    };
    const config = Object.assign({}, defaultOptions, options);

    // 参数异常自动回退
    if (!["left", "center", "right"].includes(config.align)) config.align = "center";
    if (!Number.isFinite(config.interval) || config.interval <= 0) config.interval = 1000;

    // 3. 读取节点自身的 data-* 样式属性（优先级高于全局配置）
    function getDataStyles(dom) {
        const data = dom.dataset;
        const styleMap = {
            fontSize: data.fontSize,
            color: data.color,
            textAlign: data.align,
            fontWeight: data.fontWeight,
            backgroundColor: data.bgColor,
            padding: data.padding,
            borderRadius: data.borderRadius,
            lineHeight: data.lineHeight,
            letterSpacing: data.letterSpacing,
            border: data.border
        };
        Object.keys(styleMap).forEach(key => {
            if (styleMap[key] === undefined) delete styleMap[key];
        });
        return styleMap;
    }

    // 4. 合并样式：节点data属性 > JS配置 > 基础默认
    if (config.applyInlineStyle) {
        const baseStyles = {
            textAlign: config.align,
            fontSize: typeof config.fontSize === "number" ? `${config.fontSize}px` : config.fontSize
        };
        const dataStyles = getDataStyles(node);
        const finalStyles = Object.assign({}, baseStyles, config.style, dataStyles);

        Object.keys(finalStyles).forEach(key => {
            node.style[key] = finalStyles[key];
        });
    }

    // 5. 数字补零
    const pad = value => String(value).padStart(2, "0");

    // 6. 倒计时更新逻辑
    function update() {
        const diff = targetTimestamp - Date.now();
        if (diff <= 0) {
            node.textContent = config.expiredText;
            return false;
        }
        const totalSeconds = Math.ceil(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        node.textContent = `${pad(days)} days天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        return true;
    }

    // 7. 立即渲染，立刻替换「正在计算...」占位
    const isRunning = update();

    // 8. 启动定时器
    if (isRunning) {
        node._countdownTimer = setInterval(() => {
            if (!update()) {
                clearInterval(node._countdownTimer);
                node._countdownTimer = null;
            }
        }, config.interval);
    }

    // 9. 返回单个停止函数
    return function stopSingle() {
        if (node._countdownTimer) {
            clearInterval(node._countdownTimer);
            node._countdownTimer = null;
        }
    };
}

window.startCountdown = startCountdown;
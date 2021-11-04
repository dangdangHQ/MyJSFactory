var cutFn = (function initCutFactory(win) {
    var doc = document;
    if (win) {
        doc = win.document;
    }
    function cutFactory(opt) {
        var cfg = {
            padding: opt.padding || "...",
            classList: opt.classList || [],
            style: opt.style || {},
            debug: opt.debug
        };
        cfg.placeholder = bitCompute(cfg.padding).total;
        var el = doc.createElement("span");
        el.className = cfg.classList.join(" ");
        var customStyles = [];
        for (var styleKey in cfg.style) {
            if (cfg.style.hasOwnProperty(styleKey)) {
                customStyles.push(styleKey + ":" + cfg.style[styleKey]);
            }
        }
        el.style.cssText = "position:absolute;left:0;top:0;background:transparent;color:transparent;height:100%;white-space:nowrap;overflow:visible;border:0;" + (cfg.debug ? "background:white;color:red;" : "") + customStyles.join(";");
        var div = doc.createElement("div");
        div.appendChild(el);
        div.style.cssText = "width:99%;min-height:50px;line-height:50px;position:absolute;left:3px;top:3px;overflow:hidden;outline:0;background:transparent;" + (cfg.debug ? "outline:1px solid red;background:black;" : "");
        doc.body.appendChild(div);
        var css = win.getComputedStyle(el);
        cfg.fontSize = parseFloat(css.fontSize) || 16;

        function complate() {
            var offsetWidth = el.offsetWidth;
            var scrollWidth = el.scrollWidth;
            var gap = scrollWidth - offsetWidth;
            var percent = Math.floor(offsetWidth / scrollWidth * 1e3) / 1e3;
            return {
                gap: gap,
                percent: percent
            }
        }

        function cut(content) {
            el.innerHTML = content;
            var info = complate(),
                percent = info.percent;
            var total = bitCompute(content).total;
            var showLen = +(total * percent).toFixed(0) - cfg.placeholder;
            content = bitCompute(content, showLen).content;
            return content + cfg.padding;
        }

        function bitCompute(content, maxLen) {
            var total = 0,
                len = arguments[0].length || 0,
                outContent = '';
            for (var i = 0; i < len; i++) {
                if (content[i].charCodeAt() > 255) {
                    total += 2;
                } else {
                    total += 1;
                }
                if (maxLen && total > maxLen) {
                    break;
                }
                outContent += content[i];
            }
            return {
                total: total,
                content: outContent
            }
        }

        return function (content) {
            el.innerHTML = content;
            var out = {
                flag: false,
                cut: '',
                all: content,
                last: content
            }
            if (complate().gap > 0) {
                out.flag = true,
                out.last = out.cut = cut(content)
            }
            return out
        }

    }
    return cutFactory
})(window)

function subStringEL(name, fontSize, width) {
    this.subStringELFns || (this.subStringELFns = {});
    var key = 'key_' + fontSize + '_' + width;
    var fn = this.subStringELFns[key];
    if (!fn) {
        fn = this.subStringELFns[key] = cutFn({
            style: {
                'font-size': fontSize,
                'width': width
            }
        })
    }
    return fn(name);
}

export {
    subStringEL
}
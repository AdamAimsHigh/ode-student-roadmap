/* Chart kernel for the statistics dashboard (Sprint Rec 4).

   A dependency-free canvas renderer in the style of the sandbox engines
   (Pillar 3): plain script-injected global, no ES modules, no fetch, no
   charting library, fully file:// executable. Four chart forms:

     ODECharts.line(canvas, spec)     trend lines over a shared x axis
     ODECharts.radar(canvas, spec)    normalized mastery polygon
     ODECharts.bars(canvas, spec)     horizontal labeled value bars
     ODECharts.heatmap(canvas, spec)  daily-activity calendar grid

   Rendering contract, shared with the sandbox engines:
   - Theme-token aware: every color is read live from the Pillar 4 custom
     properties (--accent-color, --text-color, ...) at draw time, so Light
     and Dark both render natively and a mid-view theme flip repaints the
     chart on its next frame without a re-mount.
   - Self-terminating requestAnimationFrame loop: each mounted chart owns
     one RAF loop that stops itself the moment its canvas leaves the DOM
     (navigation through the router replaces #app-content's children), so
     an abandoned view can never keep animating in the background.
   - Idle frames are near-free: after the ~700 ms ease-in completes, a
     frame redraws only when the theme token signature or the element's
     layout size actually changed.
   - devicePixelRatio aware: the backing store scales to the CSS size so
     lines stay crisp on high-density displays.

   Copy rule: any text drawn onto a canvas is user-facing UI copy and must
   follow the Section 1 constraint, no em-dashes and no ampersands. */

const ODECharts = (function () {

    const FONT_STACK = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
    const ANIMATION_MS = 700;

    /* Live theme palette, read from the Pillar 4 tokens on the root element
       each time a frame decides whether to draw. */
    function readPalette() {
        const style = getComputedStyle(document.documentElement);
        function token(name, fallback) {
            const v = style.getPropertyValue(name).trim();
            return v || fallback;
        }
        return {
            accent: token("--accent-color", "#6200ee"),
            accentText: token("--accent-text", "#6200ee"),
            text: token("--text-color", "#1a1a1a"),
            secondary: token("--text-secondary", "#5a5a6e"),
            border: token("--panel-border", "rgba(0,0,0,0.08)"),
            panel: token("--panel-bg", "#f4f4f4"),
            success: token("--success-color", "#1b7a43"),
            error: token("--error-color", "#b3261e")
        };
    }

    function paletteSignature(p) {
        return p.accent + "|" + p.text + "|" + p.secondary + "|" +
            p.border + "|" + p.success + "|" + p.error;
    }

    /* Resolves a series' declarative color role to a live palette value, so
       callers never hard-code a hex that would break one of the themes. */
    function roleColor(palette, role) {
        if (role === "success") return palette.success;
        if (role === "error") return palette.error;
        if (role === "secondary") return palette.secondary;
        return palette.accent;
    }

    function easeOutCubic(t) {
        const u = 1 - t;
        return 1 - u * u * u;
    }

    /* The shared mount loop. Sizes the backing store to the CSS box times
       devicePixelRatio, then drives draw(ctx, w, h, palette, progress) on a
       RAF loop that terminates itself once the canvas leaves the DOM. */
    function mountLoop(canvas, draw) {
        if (!canvas || typeof canvas.getContext !== "function") return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const startedAt = (typeof performance !== "undefined" && performance.now)
            ? performance.now() : Date.now();
        let lastSignature = "";
        let lastWidth = 0;
        let lastHeight = 0;

        function frame(nowMs) {
            /* Self-termination: the router swaps #app-content's children on
               every navigation, so a detached canvas means the view is gone
               and this loop simply ends. */
            if (!canvas.isConnected) return;

            const cssWidth = canvas.clientWidth || canvas.width;
            const cssHeight = canvas.clientHeight || canvas.height;
            const elapsed = (nowMs || Date.now()) - startedAt;
            const progress = Math.min(1, elapsed / ANIMATION_MS);
            const palette = readPalette();
            const signature = paletteSignature(palette) + "@" +
                cssWidth + "x" + cssHeight;

            const mustDraw = progress < 1 ||
                signature !== lastSignature ||
                cssWidth !== lastWidth || cssHeight !== lastHeight;

            if (mustDraw && cssWidth > 0 && cssHeight > 0) {
                const dpr = window.devicePixelRatio || 1;
                const backingWidth = Math.round(cssWidth * dpr);
                const backingHeight = Math.round(cssHeight * dpr);
                if (canvas.width !== backingWidth) canvas.width = backingWidth;
                if (canvas.height !== backingHeight) canvas.height = backingHeight;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                ctx.clearRect(0, 0, cssWidth, cssHeight);
                try {
                    draw(ctx, cssWidth, cssHeight, palette, easeOutCubic(progress));
                } catch (err) {
                    /* A drawing fault must never wedge the view in a RAF
                       error loop; log once and stop. */
                    console.warn("Chart draw stopped:", err);
                    return;
                }
                lastSignature = signature;
                lastWidth = cssWidth;
                lastHeight = cssHeight;
            }
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function setFont(ctx, sizePx, weight) {
        ctx.font = (weight ? weight + " " : "") + sizePx + "px " + FONT_STACK;
    }

    /* Fits a label into maxWidth by trailing ellipsis, so long skill names
       never overflow their lane. */
    function fitLabel(ctx, text, maxWidth) {
        if (ctx.measureText(text).width <= maxWidth) return text;
        let out = text;
        while (out.length > 1 &&
            ctx.measureText(out + "...").width > maxWidth) {
            out = out.slice(0, -1);
        }
        return out + "...";
    }

    /* ---- Line chart ------------------------------------------------------ *
       spec: {
           series: [ { label, values: [n...], color?: "accent"|"success"|
                       "error"|"secondary" } ],
           labels: [ x tick label per index ],   (sparse labels allowed: "")
           yMax?:  fixed ceiling, else the data maximum
       } All series share the label axis and are drawn left to right. */
    function line(canvas, spec) {
        const series = (spec && spec.series || []).filter(function (s) {
            return s && Array.isArray(s.values) && s.values.length > 0;
        });
        if (!series.length) return;
        const labels = (spec && spec.labels) || [];
        const pointCount = series.reduce(function (m, s) {
            return Math.max(m, s.values.length);
        }, 0);
        const dataMax = series.reduce(function (m, s) {
            return Math.max(m, s.values.reduce(function (mm, v) {
                return Math.max(mm, v || 0);
            }, 0));
        }, 0);
        const yMax = Math.max(spec && spec.yMax || 0, dataMax, 1);

        mountLoop(canvas, function (ctx, w, h, palette, t) {
            const pad = { left: 34, right: 10, top: 12, bottom: 22 };
            const plotW = w - pad.left - pad.right;
            const plotH = h - pad.top - pad.bottom;
            if (plotW < 20 || plotH < 20) return;

            /* Grid and y scale: four horizontal rules. */
            ctx.strokeStyle = palette.border;
            ctx.fillStyle = palette.secondary;
            ctx.lineWidth = 1;
            setFont(ctx, 10);
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            for (let g = 0; g <= 4; g++) {
                const y = pad.top + plotH - (plotH * g / 4);
                ctx.beginPath();
                ctx.moveTo(pad.left, y);
                ctx.lineTo(pad.left + plotW, y);
                ctx.stroke();
                ctx.fillText(String(Math.round(yMax * g / 4)), pad.left - 6, y);
            }

            /* Sparse x tick labels under the axis. */
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            const step = pointCount > 1 ? plotW / (pointCount - 1) : 0;
            for (let i = 0; i < labels.length && i < pointCount; i++) {
                if (!labels[i]) continue;
                ctx.fillText(labels[i], pad.left + step * i, pad.top + plotH + 6);
            }

            series.forEach(function (s) {
                const color = roleColor(palette, s.color);
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.lineWidth = 2;
                ctx.lineJoin = "round";
                ctx.beginPath();
                for (let i = 0; i < s.values.length; i++) {
                    const x = pad.left + step * i;
                    const y = pad.top + plotH - (plotH * (s.values[i] || 0) / yMax) * t;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                /* Endpoint dot anchors the eye on the latest value. */
                const lastIndex = s.values.length - 1;
                const lx = pad.left + step * lastIndex;
                const ly = pad.top + plotH -
                    (plotH * (s.values[lastIndex] || 0) / yMax) * t;
                ctx.beginPath();
                ctx.arc(lx, ly, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            /* Compact legend, top right. */
            setFont(ctx, 10);
            ctx.textBaseline = "middle";
            let legendX = w - pad.right;
            for (let i = series.length - 1; i >= 0; i--) {
                const s = series[i];
                if (!s.label) continue;
                const color = roleColor(palette, s.color);
                ctx.textAlign = "right";
                ctx.fillStyle = palette.secondary;
                ctx.fillText(s.label, legendX, pad.top);
                legendX -= ctx.measureText(s.label).width + 12;
                ctx.fillStyle = color;
                ctx.fillRect(legendX, pad.top - 3, 7, 7);
                legendX -= 10;
            }
        });
    }

    /* ---- Radar chart ------------------------------------------------------ *
       spec: { axes: [ { label, value } ] } with each value already
       normalized into [0, 1]. Three axes minimum for a readable polygon. */
    function radar(canvas, spec) {
        const axes = (spec && spec.axes || []).filter(function (a) {
            return a && typeof a.value === "number";
        });
        if (axes.length < 3) return;

        mountLoop(canvas, function (ctx, w, h, palette, t) {
            const cx = w / 2;
            const cy = h / 2 + 4;
            const radius = Math.min(w, h) / 2 - 34;
            if (radius < 20) return;
            const n = axes.length;

            function pointAt(index, magnitude) {
                const angle = (Math.PI * 2 * index / n) - Math.PI / 2;
                return {
                    x: cx + Math.cos(angle) * radius * magnitude,
                    y: cy + Math.sin(angle) * radius * magnitude
                };
            }

            /* Concentric guide rings and spokes. */
            ctx.strokeStyle = palette.border;
            ctx.lineWidth = 1;
            for (let ring = 1; ring <= 4; ring++) {
                ctx.beginPath();
                for (let i = 0; i <= n; i++) {
                    const p = pointAt(i % n, ring / 4);
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }
            for (let i = 0; i < n; i++) {
                const p = pointAt(i, 1);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }

            /* The mastery polygon, eased outward from the center. */
            ctx.beginPath();
            for (let i = 0; i <= n; i++) {
                const a = axes[i % n];
                const magnitude = Math.max(0, Math.min(1, a.value)) * t;
                const p = pointAt(i % n, magnitude);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = palette.accent;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = palette.accent;
            ctx.lineWidth = 2;
            ctx.stroke();
            for (let i = 0; i < n; i++) {
                const magnitude = Math.max(0, Math.min(1, axes[i].value)) * t;
                const p = pointAt(i, magnitude);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = palette.accent;
                ctx.fill();
            }

            /* Axis labels just past the outer ring. */
            setFont(ctx, 10);
            ctx.fillStyle = palette.secondary;
            ctx.textBaseline = "middle";
            for (let i = 0; i < n; i++) {
                const p = pointAt(i, 1.12);
                ctx.textAlign = Math.abs(p.x - cx) < radius * 0.3
                    ? "center" : (p.x < cx ? "right" : "left");
                ctx.fillText(fitLabel(ctx, axes[i].label, w / 3), p.x, p.y);
            }
        });
    }

    /* ---- Horizontal bars --------------------------------------------------- *
       spec: { bars: [ { label, value, max, detail?, color? } ] }
       Each row: label lane on the left, track + eased fill, and the
       optional detail string right-aligned inside the track lane. */
    function bars(canvas, spec) {
        const rows = (spec && spec.bars || []).filter(function (b) {
            return b && typeof b.value === "number" && b.max > 0;
        });
        if (!rows.length) return;

        mountLoop(canvas, function (ctx, w, h, palette, t) {
            const labelWidth = Math.min(180, w * 0.38);
            const trackX = labelWidth + 10;
            const trackW = w - trackX - 8;
            const rowH = Math.min(30, h / rows.length);
            if (trackW < 30) return;

            rows.forEach(function (row, i) {
                const y = i * rowH + rowH / 2;
                setFont(ctx, 11);
                ctx.fillStyle = palette.text;
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                ctx.fillText(fitLabel(ctx, row.label, labelWidth), labelWidth, y);

                const barH = Math.min(10, rowH - 8);
                ctx.fillStyle = palette.border;
                ctx.fillRect(trackX, y - barH / 2, trackW, barH);
                const share = Math.max(0, Math.min(1, row.value / row.max));
                ctx.fillStyle = roleColor(palette, row.color);
                ctx.fillRect(trackX, y - barH / 2, trackW * share * t, barH);

                if (row.detail) {
                    setFont(ctx, 10);
                    ctx.fillStyle = palette.secondary;
                    ctx.textAlign = "right";
                    ctx.fillText(row.detail, trackX + trackW, y - barH / 2 - 7);
                }
            });
        });
    }

    /* ---- Activity heatmap --------------------------------------------------- *
       spec: { days: { "YYYY-MM-DD": count }, weeks?: n } A calendar grid,
       one column per week ending today, one row per weekday, cell intensity
       scaled to the busiest day. */
    function heatmap(canvas, spec) {
        const days = (spec && spec.days) || {};
        const weeks = Math.max(4, Math.min(53, (spec && spec.weeks) || 26));

        /* Local-date arithmetic matching telemetry's localDateKey. */
        function dateKey(d) {
            return d.getFullYear() + "-" +
                String(d.getMonth() + 1).padStart(2, "0") + "-" +
                String(d.getDate()).padStart(2, "0");
        }
        const today = new Date();
        const grid = [];
        let maxCount = 1;
        /* Column 0 is the oldest week; the last cell is today. */
        const totalDays = weeks * 7 - (6 - today.getDay());
        for (let i = totalDays - 1; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth(),
                today.getDate() - i);
            const entry = days[dateKey(d)];
            const count = Array.isArray(entry) ? (entry[0] || 0) : (entry || 0);
            if (count > maxCount) maxCount = count;
            grid.push({ day: d.getDay(), count: count });
        }

        mountLoop(canvas, function (ctx, w, h, palette, t) {
            const cell = Math.min((w - 8) / weeks, (h - 8) / 7);
            if (cell < 3) return;
            const gap = Math.max(1, cell * 0.15);
            let column = 0;
            grid.forEach(function (item, index) {
                if (index > 0 && item.day === 0) column++;
                const x = 4 + column * cell;
                const y = 4 + item.day * cell;
                ctx.fillStyle = palette.border;
                ctx.globalAlpha = 1;
                ctx.fillRect(x, y, cell - gap, cell - gap);
                if (item.count > 0) {
                    ctx.fillStyle = palette.accent;
                    ctx.globalAlpha = (0.25 + 0.75 * (item.count / maxCount)) * t;
                    ctx.fillRect(x, y, cell - gap, cell - gap);
                    ctx.globalAlpha = 1;
                }
            });
        });
    }

    return {
        line: line,
        radar: radar,
        bars: bars,
        heatmap: heatmap
    };
})();

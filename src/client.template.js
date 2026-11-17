/**
 * Cyber Green Theme — web client half.
 *
 * Injects the theme stylesheet once, then places a small iOS-style switch in the
 * composer tool bar (right of the "+" button). The switch flips
 * `data-dsh-cyber="off"` on <html> and remembers the choice in localStorage.
 *
 *   1. design-token layer  -> any plugin that uses DSH tokens follows along
 *   2. generic text layer  -> plugins with hard-coded colours still go green
 *   3. CRT layer           -> scanlines + vignette, gated by the same switch
 */
window.__ModuleLoader__.load({
  id: 'dsh-cyber-green-theme',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const SLOT = 'conversation.input.left';
    const STORAGE_KEY = 'dsh.cyber-green';
    const ATTR = 'data-dsh-cyber';
    const STYLE_ID = 'dsh-cyber-green-theme-style';

    const THEME_CSS = `__THEME_CSS__`;

    const UI_CSS = `
.cyber-switch-wrap { display: inline-flex; align-items: center; margin: 0 6px 0 2px; flex: none; }
.cyber-switch {
  position: relative; width: 24px; height: 13px; padding: 0; border-radius: 999px;
  border: 1px solid rgba(120, 130, 126, .38); background: #39423f; cursor: pointer;
  transition: background-color .18s ease, border-color .18s ease;
  -webkit-appearance: none; appearance: none; flex: none;
}
.cyber-switch.is-on { background: #2f8f66; border-color: #58c08f; }
.cyber-switch::after { content: ""; position: absolute; inset: -6px; border-radius: 999px; }
.cyber-switch-knob {
  position: absolute; top: 1px; left: 1px; top: 1px; width: 9px; height: 9px; border-radius: 50%;
  background: #cfd8d4; display: block; transition: transform .18s ease, background-color .18s ease;
}
.cyber-switch.is-on .cyber-switch-knob { transform: translateX(11px); background: #eafff3; }
.cyber-switch-wrap { position: relative; }
.cyber-switch-tip {
  position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
  padding: 3px 8px; border-radius: 6px; white-space: nowrap;
  font-size: 10px; line-height: 14px; letter-spacing: .02em;
  color: #58c08f; background: #101713; border: 1px solid rgba(88, 192, 143, .35);
  box-shadow: 0 4px 14px rgba(0, 0, 0, .45);
  opacity: 0; pointer-events: none; transition: opacity .12s ease;
  z-index: 60;
}
.cyber-switch-wrap:hover .cyber-switch-tip,
.cyber-switch-wrap:focus-within .cyber-switch-tip { opacity: 1; }
`;


    function readEnabled() {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== 'off';
      } catch {
        return true;
      }
    }

    function paint(enabled) {
      const root = document.documentElement;
      if (enabled) root.removeAttribute(ATTR);
      else root.setAttribute(ATTR, 'off');
      try {
        window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
      } catch {
        /* storage unavailable: keep in-memory state */
      }
    }

    function ensureStyle() {
      if (document.getElementById(STYLE_ID)) return;
      const el = document.createElement('style');
      el.id = STYLE_ID;
      el.textContent = THEME_CSS;
      (document.head || document.documentElement).appendChild(el);
    }

    function CyberGreenSwitch() {
      const [enabled, setEnabled] = React.useState(readEnabled);

      React.useEffect(() => {
        paint(enabled);
      }, [enabled]);

      return h(
        'span',
        { className: 'cyber-switch-wrap' },
        h(
          'button',
          {
            type: 'button',
            className: enabled ? 'cyber-switch is-on' : 'cyber-switch',
            role: 'switch',
            'aria-checked': enabled,
            title: enabled ? "赛博绿主题：已开启（点击关闭）" : "赛博绿主题：已关闭（点击开启）",
            "aria-label": enabled ? "赛博绿主题：已开启" : "赛博绿主题：已关闭",
            onClick: () => setEnabled((v) => !v),
          },
          h('span', { className: 'cyber-switch-knob' }),
        ),
        h('span', { className: 'cyber-switch-tip' }, enabled ? "赛博绿主题：已开启" : "赛博绿主题：已关闭"),
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        const render = () =>
          h(
            React.Fragment,
            null,
            h("style", { dangerouslySetInnerHTML: { __html: UI_CSS } }),
            h(CyberGreenSwitch),
          );

        try {
          ctx.effect(() => {
            ensureStyle();
            paint(readEnabled());
            const onStorage = (event) => {
              if (event.key === STORAGE_KEY) paint(event.newValue !== "off");
            };
            window.addEventListener("storage", onStorage);
            return () => window.removeEventListener("storage", onStorage);
          });
        } catch (error) {
          ensureStyle();
        }

        const mount = (slot, priority) =>
          ctx.slots.inject(slot, () =>
            ctx.slots.register({ name: slot, id: "cyber-green-toggle", priority }, render),
          );

        // 输入框工具条左侧是首选位置；槽位不可用时退回输入框下方，绝不阻断启动。
        try {
          mount("conversation.input.left", -100);
        } catch (error) {
          try {
            mount("conversation.composer.dock", 60);
          } catch (fallbackError) {
            console.warn("[cyber-green] slot registration failed", error, fallbackError);
          }
        }
      },
    };
  },
});

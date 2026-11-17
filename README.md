# 赛博绿主题 · DSH Cyber Green Theme

把整个 DeepSeek Harness 界面换成 CRT 赛博绿：侧边栏、顶部栏、输入框、菜单、浮层统一配色，并带一层淡淡的 CRT 扫描线与暗角。

> **建议搭配 [`dsh-claude-style`](https://github.com/Nwflower/dsh-claude-style) 一起使用。**
>
> 本主题是**色彩层**，`dsh-claude-style`（作者 **Nwflower**，MIT 许可）提供的是**排版层**（字号、行高、字间距、留白、圆角与细节动效）。
> 两者叠加时效果最好；只装本主题也能用（内置了一版排版基线，但达不到 claude-style 的精致度）。
>
> `dsh-claude-style` 出处：<https://github.com/Nwflower/dsh-claude-style>（npm: `dsh-claude-style`）

## 特性

- **一键开关**：输入框工具条最左侧有一个小 iOS 开关，绿色=主题开启，灰色=恢复系统配色；鼠标悬停会显示当前状态，选择会被记住。
- **整窗覆盖**：侧边栏、顶部栏、输入框、底部状态条、模型/权限浮层、右侧详情面板统一配色。
- **对未来插件自动生效**：配色基于 DSH 设计令牌（`--dsw-alias-*`）。后续安装的插件只要使用这些令牌，就会自动变成同一套绿色；对硬编码颜色的插件还有一层通用文字/图标兜底。
- **CRT 效果**：扫描线 + 暗角，纯 CSS 伪元素实现，`pointer-events: none`，不影响点击与滚动。
- **可回退**：关掉开关即完全恢复原生界面，不修改任何 DSH 配置。

## 安装

在 DSH 中通过插件管理器安装（本地目录或打包后的 tgz）：

```
plugin_manager: install_bundle, target: <本目录绝对路径或 tgz>
```

或在「插件 → 添加插件」中选择本目录。

**推荐同时安装 `dsh-claude-style`**：

```
dsh plugin --profile <profile> add dsh-claude-style
```

## 自定义

主题颜色集中在 `src/theme.css` 顶部变量里：

```css
--cy-green: #58c08f;      /* 主字色（哑光薄荷绿） */
--cy-green-soft: #479a76; /* 次级文字 */
--cy-bg: #0b100e;         /* 底色 */
```

改完执行 `node src/build.mjs` 重新生成 `client.js`，重启 DSH 生效。

CRT 强度在 `body::after` 规则里（扫描线透明度与 `opacity`）。

## 卸载

插件页停用或移除本插件即可；如开关被留在「关」的状态，可在控制台执行
`localStorage.removeItem('dsh.cyber-green')` 复位。

## 发布

```bash
pnpm publish --access public
```

## 目录

```
package.json        清单（dsh.bundle / dsh.client / exports / files）
index.js            Host 半部（空实现）
client.js           构建产物：内联主题 CSS + 开关
src/theme.css       主题 CSS 源文件
src/client.template.js  客户端模板
src/build.mjs       把 CSS 内联进 client.js
cordis.patch.yml    插入插件行
locale/*.json       多语言展示文案
docs/               详情页文档与预览图
icon.svg            图标
```

## 致谢

- 排版与动效灵感来自 **[`dsh-claude-style`](https://github.com/Nwflower/dsh-claude-style)**（作者 Nwflower，MIT）。
  本主题只引用其设计思路与令牌数值，不包含其代码或字体资源。

## 授权

MIT

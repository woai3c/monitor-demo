# monitor
一个简易的前端监控 SDK DEMO，仅供学习，请勿在生产环境中使用。

## 文档
* [前端监控 SDK 的一些技术要点原理分析](https://github.com/woai3c/Front-end-articles/issues/26)

## DEMO
克隆项目后，执行命令打开服务器。
```
npm run server
```
然后用 vscode 的 `live server` 插件访问 examples 目录上的 html 文件，即可尝试体验监控 SDK 的效果。同时打开开发者工具，点击 network 标签，可以看到上报数据的发送请求。

## 使用
### 直接 HTML 文件中引入使用
```html
<script src="https://cdn.jsdelivr.net/npm/monitor-demo/dist/monitor.js"></script>
<script>
    monitor.init({
        url: 'http://localhost:8080/reportData'
    })
</script>
```
### 在 npm 中使用
安装
```
npm i monitor-demo
```
引入
```js
import monitor from 'monitor-demo'
// 如果有 Vue 的话
import router from './router'
import Vue from 'vue'

monitor.init({
    url: 'http://localhost:8080/reportData',
    vue: {
      Vue,
      router,
    }
})
```

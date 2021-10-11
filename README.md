# monitor
一个简易的前端监控 SDK DEMO，仅供学习，请勿在生产环境中使用。

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
```
npm i monitor-demo
```
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

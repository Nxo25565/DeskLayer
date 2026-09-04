# Custom theme 自定义主题

## 目录结构
```
│   default.json           # 默认注入文件
│   icon32.png             # 应用图标
│   README.md
│   RendererFileList.json  # 渲染进程文件列表
│   
├───arts                   #  一些设计
│       lb.pptx
│       lb_option.png
│       lb_option_choosed.png
│       search.png
│       searchIco.png
│       ~$lb.pptx
│       
├───js                      #  renderer js文件
│   │   animejsTest.js
│   │   dotGenerate.js
│   │   global.d.ts         # 全局类型定义文件
│   │   lbAnimations.js
│   │   README.md
│   │   
│   └───libs                  #  第三方库文件
│       └───animejs-4.5.0
│               anime.umd.js
│               
└───styles                  #  renderer css文件
    ├───components          #  组件css文件
    │       DragScroll.css
    │       ListItem.css
    │       SelectableListItem.css
    │       
    └───pages                 #  页面css文件
        ├───About             #  关于页面css文件
        │       index.css
        │       
        ├───LinkBrowser       #  LinkBro页面css文件
        │       index.css
        │       
        └───Settings          #  设置页面css文件
                index.css
```
## 文件列表
```default.json``` 默认注入文件，所有页面都会注入，用于第三方库的加载

```RendererFileList.json``` 渲染进程文件列表，用于加载js文件css文件等，一般用于特定页面主题的样式和动画

上述两个文件遵循以下格式
```json
[
    {
        "path": "path/to/file",
        "priority": 0,      // 优先级，数字越小越优先,-1为忽略
        "comment": "这是一个注释"
    }
]
```

## 外部库导入使用
必须编译为umd格式，用```window.xxx```调用
```javascript
function loadAnimeJS() {
  const animejs = window.anime // window.anime 是anime.js的全局变量
  console.log('hello from anime.js')
  console.log(animejs.animate)
  animejs.animate(
    '.linkbro-container',
    {
    translateX: 250,
    duration: 800,
    easying: 'easeInOutQuad',
    loop: true
  })
}

loadAnimeJS()
```
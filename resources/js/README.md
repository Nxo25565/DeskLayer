# 外部JavaScript文件导入

```
│  animejsTest.js
│  dotGenerate.js
│  README.md
│  
└─libs   # 这里放需要的动画库文件
    └─animejs-4.5.0
            anime.umd.min.js
```

## 库文件要求
必须是UMD格式，且在window对象上挂载了属性

## 使用
在需要的地方引用```window.属性名```

详细见animejsTest.js

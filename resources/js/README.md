# 外部JavaScript文件导入

```
│  animejsTest.js
│  dotGenerate.js
│  README.md
|  global.d.ts  # 定义window类型
│  
└─libs   # 这里放需要的动画库文件
    └─animejs-4.5.0 # 内嵌了animejs 4.5.0 版本
            anime.umd.min.js
```

## 库文件要求
必须是UMD格式，且在window对象上挂载了属性

## 使用
global.d.ts定义window类型，见文件内容

在需要的地方引用```window.属性名```

详细见animejsTest.js

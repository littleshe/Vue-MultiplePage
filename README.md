# Vue-MultiplePage
基于vue-cli的多页面架构实践

[webpack.dev.conf.js改动](https://github.com/littleshe/Vue-MultiplePage/blob/master/build/webpack.dev.conf.js#L16)

[webpack.prod.conf.js改动](https://github.com/littleshe/Vue-MultiplePage/blob/master/build/webpack.prod.conf.js#L23)

## 目录结构

```
└─src
    ├─assets       //资源文件
    ├─components   //公用组件
    ├─entries      //js入口文件，一个页面对应一个js，名称为html页面名称
    ├─pages        //页面级别组件
    └─templates    //html模板
```

## 主要特性

- 保持vue单文件组件写法
- 提供模板支持，查找路径如下：具体页面模板 -> 业务公用模板 -> 默认模板
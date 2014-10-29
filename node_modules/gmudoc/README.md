gmudoc
=============

Jsdoc for GMU project!

使用说明
----------------------

此程序主要作用是从指定的js源码中读取文档注释，通过模板解析，最终生成静态API文档。
以下是对js源码的一些规则说明。



### 标签说明
#### 1. file 或者 fileOverview 用来说明当前文件的主要作用。

```javascript
/**
 * @file 
 */
```
或者

```javascript
/**
 * @fileOverview 
 */
```

#### 2. 

顶级
/**
 * @namespace UE
 * @desc Ueditor API文档
 */

 /**
  * @namespace UE.Editor
  * @desc Editor类描述
  */

  /**
   * @file description
   * @namespace 
   */

  /**
   * @method 
   */
# LiteXLoaderPromiseify

LiteXLoaderPromiseify promiseify [LiteXLoader](https://lxl.litetitle.com/)的API。

[English documentation is here.](./README.md)

## API 参考

> 以下文档摘抄改写自LiteXLoader的官方文档

## LiteXLoader - GUI表单界面文档

> 这里API使你可以在游戏中创建、修改或者影响 **GUI界面**

### 📊 表单相关 API

对于某个特定的玩家对象`pl`，有以下这些表单接口可用

#### 向玩家发送模式表单

模式表单包含一个标题、一个文本显示框以及两个按钮

`pl.sendModalFormPromise(title,content,button1,button2)`

- 参数：
  - title : `String`  
    表单标题  
  - content : `String`  
    表单内容
  - button1 : `String`  
    按钮1文本的字符串  
  - button2 : `String`  
    按钮2文本的字符串   
- 返回值：Promise  
- 返回值类型：`Promise<{formId, player, id}>`
  - 如果返回值被reject，则代表发送失败
  - formId : `Integer`  
    发送的表单ID
  - player : `Player`  
    与表单互动的玩家对象
  - id : `Integer`    
    玩家点击的表单按钮的序号  
    如果id为`Null`，则代表玩家取消了表单

<br>

#### 向玩家发送普通表单  

普通表单包含一个标题、一个文本显示框以及若干按钮，可以设置按钮上显示的图标  
由于按钮的内容设置相对复杂，建议使用表单构建器API更好地完成这项任务。

`pl.sendSimpleFormPromise(title,content,buttons,images)`

- 参数：
  - title : `String`  
    表单标题  
  - content : `String`  
    表单内容
  - buttons : `Array<String,String,...>`  
    各个按钮文本的字符串数组
  - images : `Array<String,String,...>`  
    各个按钮对应的图片路径
- 返回值：Promise  
- 返回值类型：`Promise<{formId, player, id}>`
  - 如果返回值被reject，则代表发送失败
  - formId : `Integer`  
    发送的表单ID
  - player : `Player`  
    与表单互动的玩家对象
  - id : `Integer`    
    玩家点击的表单按钮的序号  
    如果id为`Null`，则代表玩家取消了表单

<br>

图片路径参数 `images` 使用材质包路径或者URL来标识按钮对应的图标。  
对于表单上的每个按钮，如下设置对应的图标

1. 如果使用材质包路径，图片路径应该形如 `textures/items/apple`
2. 如果使用URL路径，那么在这里放入完整的URL即可，形如 `https://www.baidu.com/img/flexible/logo/pc/result.png`
3. 如果这个按钮你不需要显示图片，那将对应的图片路径设置为空字符串即可

<br>

#### 向玩家发送自定义表单（Json格式）  

自定义表单可以包含丰富的自定义控件。  
由于相关Json定义格式相对复杂，建议使用表单构建器API更好地完成这项任务。

`pl.sendCustomFormPromise(json)`

- 参数：
  - json : `String`  
    自定义表单json字符串  
- 返回值：Promise  
- 返回值类型：`Promise<{formId, player, data}>`
  - 如果返回值被reject，则代表发送失败
  - formId : `Integer`  
    发送的表单ID
  - player : `Player`  
    与表单互动的玩家对象
  - id : `Integer`    
    玩家点击的表单按钮的序号  
    如果id为`Null`，则代表玩家取消了表单
  - data : `Array<...>`    
    返回的表单内容数组  
    数组中，第一项一定为`Null`，从第二项开始，按表单上的控件顺序储存了每一个控件的内容  
    如果data为`Null`，则代表玩家取消了表单

<br>

#### 发送表单构建器构建的普通表单

在用表单构建器构建普通表单就绪之后，你可以将配置好的表单对象发送给玩家，并监听玩家的互动消息
表单对象可以被反复发送，每次发送都会返回一个不同的表单ID，并在有玩家互动时调用各自设置的回调函数，不会打架。

对于某个玩家对象`pl`，使用函数：

`pl.sendForm(fm)`

- 参数：
  - fm : `SimpleForm`
    配置好的表单对象
- 返回值：Promise
- 返回值类型：`Promise<{formId, player, id}>`
  - 如果返回值被reject，则代表发送失败
  - formId : `Integer`
    发送的表单ID
  - player : `Player`
    与表单互动的玩家对象
  - id : `Integer`
    玩家点击的表单按钮的序号，从0开始编号
    如果id为`Null`，则代表玩家取消了表单

<br>

#### 发送表单构建器构建的自定义表单

在用表单构建器构建自定义表单就绪之后，你可以将配置好的表单对象发送给玩家，并监听玩家的互动消息
表单对象可以被反复发送，每次发送都会返回一个不同的表单ID，并在有玩家互动时调用各自设置的回调函数，不会打架。

对于某个玩家对象`pl`，使用函数：

`pl.sendForm(fm)`

- 参数：
  - fm : `CustomForm`
    配置好的自定义表单对象
- 返回值：Promise
- 返回值类型：`Promise<{formId, player, data}>`
  - 如果返回值被reject，则代表发送失败
  - formId : `Integer`
    发送的表单ID
  - player : `Player`
    与表单互动的玩家对象
  - data : `Array<...>`
    返回的表单内容数组
    数组中中按表单上的控件顺序储存了每一个控件的内容
    如果data为`Null`，则代表玩家取消了表单


<br>

### 🌏 网络接口 API

下面这些API为脚本提供了基本的网络接口。  
如果有更复杂的需求，可以使用各自语言平台的网络库来完成任务  

#### 发送一个异步HTTP(s) Get请求  

`network.httpGetPromise(url)`

- 参数：
  - url : `String`  
    请求的目标地址（包括 Get 请求附带的参数）
- 返回值：Promise  
- 返回值类型：`Promise<{status, result}>`
  - 如果返回值被reject，则代表发送失败
  - status : `Integer`    
    返回的HTTP(s)响应码，如200代表请求成功
  - result : `String`  
    返回的具体数据

如果请求执行失败，status值将为 -1

<br>

#### 发送一个异步HTTP(s) Post请求  

`network.httpPostPromise(url,data,type)`

- 参数：
  - url : `String`  
    请求的目标地址
  - data : `String`  
    发送的数据
  - type : `String`  
    发送的 Post 数据类型，形如 `text/plain` `application/x-www-form-urlencoded` 等
- 返回值：Promise  
- 返回值类型：`Promise<{status, result}>`
  - 如果返回值被reject，则代表发送失败
  - status : `Integer`    
    返回的HTTP(s)响应码，如200代表请求成功
  - result : `String`  
    返回的具体数据

如果请求执行失败，status值将为 -1

<br>

### 📋 文件对象 API

在LXL中，使用「文件对象」来操作和读写某一个特定的文件。

> 文件对象 API 中的异步接口尚未被 promiseify ，将来 LiteXLoaderPromiseify 会包含这些接口。

### 📡 系统调用 API

下面这些API提供了执行一些系统调用的接口

#### 调用shell执行指定系统命令

`system.cmdPromise(cmd[,timeLimit])`

- 参数：
  - cmd : `String`  
    执行的系统命令
  - timeLimit : `Integer`  
    （可选参数）命令运行的最长时限，单位为毫秒  
    默认为`-1`，即不限制运行时间
- 返回值：Promise  
- 返回值类型：`Promise<{exitcode, output}>`
  - 如果返回值被reject，则代表发送失败
  - exitcode : `Integer`    
    shell退出码
  - output : `Integer`  
    标准输出和标准错误输出的内容

注意！这里执行的不是MC命令系统的命令  
此函数异步工作，不会等待系统执行完命令后再返回，而是由引擎自动调用给出的回调函数来返回结果

<br>

#### 运行指定位置程序

`system.newProcessPromise(process[,timeLimit])`

- 参数：
  - process : `String`  
    运行的程序路径（与命令行参数）
  - timeLimit : `Integer`  
    （可选参数）程序进程运行的最长时限，单位为毫秒  
    默认为`-1`，即不限制运行时间
- 返回值：Promise  
- 返回值类型：`Promise<{exitcode, output}>`
  - 如果返回值被reject，则代表发送失败
  - exitcode : `Integer`    
    程序进程退出码
  - output : `Integer`  
    程序标准输出和标准错误输出的内容

此函数异步工作，不会等待系统执行完命令后再返回，而是由引擎自动调用给出的回调函数来返回结果

<br>

## 关于LiteXLoaderPromiseify的作者

LiteXLoaderPromiseify的作者是[callstackexceed](https://github.com/callstackexceed)，也是MC addon[**NormaConstructor**](https://docs.norma.observer/zh-hans/)的一个开发者。

**NormaConstructor**是一个开源的快速构建插件，目前运行在scripting API和lxl上。

**NormaConstructor**刚刚发布了beta版，它不仅需要用户，也需要开发人员。

如果你喜欢这个lxl插件，请也看看**NormaConstructor**。

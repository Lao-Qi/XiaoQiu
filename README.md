# 小秋(xiaoqiu)

## 项目介绍

机器人基于库`OICQ`进行开发，其菜单可分为五个部分，即

- 群管理操作&nbsp;&nbsp;(&nbsp;groupchatAdmin&nbsp;)
- 群聊相关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(&nbsp;groupchat&nbsp;)
- 小秋相关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(&nbsp;xiaoqiu&nbsp;)
- 积分玩法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(&nbsp;scorePlayMethods&nbsp;)
- 其它玩法&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(&nbsp;otherPlay&nbsp;)

每个部分均由若干指令构成，例如**群管理操作**下包含**修改群昵称**、**禁言成员**、**撤回消息**等其它指令

菜单中所有的指令均拥有各自的配置项，例如修改群昵称指令

```typescript
const sendContent: SendContent = {
    name: '改群昵称',
    reg: [],
    role: 'admin',
    member: () => {},
    deverDefined: () => {},
    equal: () => {},
    level: () => {}
}
const setCard = { fn, sendContent }

export { setCard }
```

稍后会在文末引出各配置项的具体用法

## 生成项目

1. 克隆至本地

```javascript
git clone https://github.com/FuncJin/xiao-qiu.git
```

2. 此时会在根目录中生成`xiao-qiu`文件夹，接着在该文件夹下安装所需依赖

```javascript
npm i -D
```

3. 由于账号所对应的数据问题，需要将`xiao-qiu/lib`下的`user-copy`文件夹名称修改为`user`（`user`文件夹中所需的数据可稍后进行配置）

4. 随后在`xiao-qiu`文件夹下编译TS文件

```javascript
tsc
```

使用`tsc`命令编译后会在根目录`xiao-qiu`下生成`xiaoqiu`新文件夹，部署时只需部署新文件夹即可

> `xiao-qiu`文件夹为`clone`后的根目录，而`xiaoqiu`则是由`tsc`命令生成的部署时文件夹

## 准备工作

按照上述步骤生成项目后，目录结构为

```
├─xiao-qiu        // 开发环境(TS)
|   ├─assets
|   ├─database
|   ├─eventHandle
|   ├─lib
|   ├─temporary
|   ├─timing
|   ├─xiaoqiu     // 使用tsc命令生成的JS文件所在处
|   ├─......
|   ├─app.ts
```

`xiao-qiu/assets`文件夹结构如下
```
├─assets
|   ├─images
|   ├─readme
|   ├─videos
|   ├─package.json
|   ├─xiaoqiu_alpha.sql
```

随后执行以下两步

1. 将`xiao-qiu/assets`文件夹整体移至`xiao-qiu/xiaoqiu`文件夹下

2. 将`xiao-qiu/xiaoqiu/assets`中的`pakcage.json`文件移至`xiao-qiu/xiaoqiu`目录下

移动完毕后，新的`xiao-qiu/xiaoqiu`目录结构为

```
├─xiaoqiu
|   ├─assets
|   |   └images
|   |   └readme
|   |   └videos
|   |   └xiaoqiu_alpha.sql
|   ├─......
|   ├─app.js
|   ├─package.json
```

随后在`xiao-qiu/xiaoqiu`下安装所需依赖

```javascript
npm i
```

## 账号配置

`xiao-qiu/lib/user`中存在`account.ts`与`account-alpha.ts`两个文件，前者为正式版配置，后者为测试版配置，可以在`xiao-qiu/lib/user/index.ts`中根据不同的需要进行切换

以`account-alpha.ts`为例，用户必须指定机器人的登录账号与密码、所监听的群聊账号、要修改群昵称的群聊账号、绝对权限、以及数据库配置

绝对权限是相对于指令的叫法，对于用户来说，绝对权限即特定用户，是独立于`member(普通成员)`、`admin(管理员)`、`owner(群主)`之外的用户，若某个指令指定了其所需的最低触发权限为特定用户，则只有该特定用户可触发，判断规则是账号层面的判断，而不是权限层面的判断

数据库配置方面，您可以选择新建一个数据库，并运行`xiao-qiu/xiaoqiu/assets/xiaoqiu_alpha.sql`文件，创建其所需数据结构（项目启动时会自动初始化表数据，所以只需关心它们的结构，而非数据），然后在`connectionDbConfig`中指定刚才创建好的数据库相关数据，例如

```javascript
const connectionDbConfig = {
    host: '主机名',
    user: '数据库账号',
    password: '数据库密码',
    database: '数据库名称'
}
```

> 在修改`account-alpha.ts`文件之后，应当重新执行`tsc`命令

## 启动项目

完成以上步骤，便可在`xiao-qiu/xiaoqiu`下启动该项目

```javascript
node app
```

初次登陆时，您可能会收到一条滑动验证，此时需要在该验证地址中得到`ticket`，然后将其输入在终端窗口中即可成功登陆（在`network`中找到对应请求地址）

> 登录后，`oicq`会在您的`xiao-qiu/xiaoqiu`下自动生成`data`文件夹，用于存放账号相关数据

## 开发新指令

> 只要您修改了源代码，则必须通过`tsc`命令生成新的JS文件，并`node app`运行它们

由于每个指令配置项众多，所以您可以参考`xiao-qiu/lib/Temp/temp-comment.ts`进行开发，或者您可以选择复制一份`xiao-qiu/lib/Temp/temp.ts`文件至您的新指令所在处

### 开发新指令的步骤

例如要开发[测试]指令用于进行一些测试工作，将该指令划分在“小秋相关”模块中，开发时必须要遵循以下步骤

1. 复制`xiao-qiu/lib/Temp/temp.ts`文件至您的新指令所在处
> 因为[测试]指令隶属于“小秋相关”模块，所以将该文件复制到`eventsHandle/xiaoqiu`下，并将`temp.ts`改名为`test.ts`(test意为[测试])。如果新指令隶属于其它模块，比如“群管理操作”，则将该文件复制到`eventsHandle/groupchatAdmin`下即可

2. 在`xiao-qiu/database/forms/interface.ts`文件中，为`CommandsName`新增一个指令名称，新增的指令名称与新指令的名称必须相同
> 因为开发的是[测试]指令，所以`eventsHandle/xiaoqiu/test.ts`文件中的`sendContent.name`和`CommandsName`新增的指令名称必须全部为'测试'

3. 在当前新指令所处文件夹的`index.ts`中引入并暴露出去
> 因为在`eventsHandle/xiaoqiu`下新增了[测试]指令，则`eventsHandle/xiaoqiu/test.ts`文件必须通过`eventsHandle/xiaoqiu/index.ts`暴露出去

4. 在`xiao-qiu/eventHandle/fn.ts`中引入新指令

5. 完成以上步骤后，在`xiao-qiu`文件夹下执行`tsc`命令，并在`xiao-qiu/xiaoqiu`下执行`node app`命令，执行完毕后小秋便成功启动
> 确保数据表`switch_commands`中新指令为开启状态，否则新指令不会被触发（ps：每增加新指令时，可以在小秋启动前将数据表`switch_commands`清空，因为小秋启动时会自动初始化数据库中的所有数据）

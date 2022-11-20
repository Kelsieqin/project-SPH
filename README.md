# app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## 项目中遇到的问题记录
### 1.路由配置功能模块
* 问题1：编程式路由导航，当路由跳转参数不变，重复请求跳转会抛出 NavigationDuplicated警告错误？
   * 原因：
     * 声明式路由导航（router-link）不出现该问题，内部已经处理； 
     * 编程式路由导航($router.push|replace)由于vue-promise3.5.2引入promise,参数传递多次且重复时，会出现上述问题。原因是没有处理promise状态为成功或者失败的回调。
   * 解决方法：
     * 重写$route.push|replace方法, 加入判断，增加成功或者失败的回调。
     ```javascript
     // 路由的push和replace方法重写
     // 1. 保存原始push方法
     const orginPush = VueRouter.prototype.push;
     // 2. 重写
     VueRouter.prototype.push = function(location,resolve,reject){
         if( resolve && reject){
             // 需要：更改指针指回VueRouter实例对象$router
             // 因为: 当前指针是window,使用原始push方法的前提是，this指向VueRouter的实例对象
             // 方法：使用call方法 | apply（参数为数组）
             orginPush.call(this,location,resolve,reject)
         }else{
             orginPush.call(this,location,()=>{},()=>{})
         }
     }
     ```
### 2.Home组件再拆分
* 问题1：轮播图swaper
  
* 问题2：接口不可用 
  * 最新接口地址：http://gmall-h5-api.atguigu.cn

### 3.获取数据  
#### 3.1 axios二次封装
* 功能：增加请求拦截器和响应拦截器 
* api文件夹-request.js
   
#### 3.2 接口统一管理
* 问题1：跨域问题，axios请求失败404
  * 解决办法：配置代理服务器。参考webpack文档devserve。Vue中再vue.config.js中配置
* 功能：nprogress进度条
  * 安装；引入； 注意别忘记引入进度条样式！！！
  * api文件夹-index.js

### 4.vuex模块化
* 功能：对于每个组件单独建立自己的小仓库，方便管理
* store-index.js 中modules配置项实现

### 5.动态展示三级联动组件数据
* 在typenav中当挂载完毕后，通过vuex发送请求，并将数据存在小仓库中
  * 1. typenav派遣actions
  * 2. home仓库中，添加对应actions, 并在actions中发请求，通过async和await获取由API接口拿到的被封装在promise对象中的数据。
  * 3. 在mutations中，修改state为收到的数据
  * 4. 在typenav中引入mapState，利用对象方式获取小仓库的中的数据
  * 5. 根据一级、二级、三级目录 v-for循环展示数据
  * 6. 根据一级目录的index 与当前currentIndex比较，动态绑定类实现背景颜色动态添加
  * 7. 利用事件委派，将全部商品种类，与一级目录放在一个父元素中，实现鼠标移出冒泡效果


### 6. 防抖与节流
* 概念：
  * 防抖：用户频繁操作，最终只执行一次；
  * 节流：用户频繁操作，多次的请求会被转化为少量的请求，给浏览器充分的时间解析
* 实现：lodash库
  * 防抖：_.debounce(function,time)
  * 节流：_.throttle(function,time)
* 问题1：用户快速划过所有一级目录，只能触发部分内容，浏览器反应不过来了，出现卡顿现象？
  * 解决方式：增加函数节流操作，给浏览器充分的时间解析

### 7. 三级联动路由参数传递实现
* 声明式导航会造成页面卡顿 因为有很多次循环
* 编程式路由导航：
  * 难点1：如何获取标签元素？
  * 难点2：如何区分一级、二级、三级标签？
  * 解决办法：事件委托 + 自定义属性
    * 注意： event.targrt获取当前事件，event.targrt.dataset获取当前事件的全部属性【自定义属性必须加：data-XXX，才能被dataset捕获到！！！】, 另外浏览器将自定义属性全部转为【小写字母】，解构参数时注意！！！
  
### 8.过渡与动画
* 增加判断是否为search组件 && 添加过渡样式

### 9. typenav性能优化？
* 问题1：home和search切换会频繁发请求，获得三级列表数据
  * 解决办法： 将请求数据命令放在 app组件的mounted中，因为app组件只挂载一次。
* 问题2：query与params参数合并
  * 描述： 搜索按钮 携带params参数； 三级分类中目录对应query参数， 都需要保留
  * 解决办法：增加判断是都当前路由有query | params参数


### 10.轮播图模拟数据
* mockjs插件: 提供假数据，不想后台发请求
  * 使用：
    * 1. 安装
    * 2. 准备json数据 - 一定要格式化，不能有空格，否则跑不起来
    * 3. 把mock数据中需要的图片放在public文件夹下。【public文件夹在打包的时候，会把相应资源原封不动的打包到dist文件夹中去】
    * 4. 开始mock虚拟数据。 创建mockServer.js
    * 5. 在main.js文件中引入mock【至少执行一次，才能模拟数据】
* swper插件使用：
  * 注意： 在new swapper之前，页面中结构必须得先有！！ 【因为有结构才能操作dom】
  * 步骤：
    * 1. 引包 js|css
    * 2. 设置页面结构
    * 3. 引入库 & new swaper实例 添加动态效果

### 11.ListContainer 
* 轮播图实现：
  * 1. 安装： npm i swiper@5 【报错：安装4.5.1版本】
  * 2. 引包：`import 'swiper/dist/css/swiper.css'`多个组件都有轮播图，可以把**样式**引入到main.js文件中
  * 3. 组件中**引入Swiper** `import Swiper from "swiper"`& 遍历多张图片 【记得！！否则没效果】
    
* 问题1：new swapper之前必须有结构，但是在mounted中new swiper， 轮播图效果没实现？
  * 原因：结构没有完整。因为dispatch中涉及【异步请求】，所以v-for遍历服务器返回的数据还没有完全，但是swiper实例已经创建
  * 基础解决方法：将new swiper放入定时器中，设置时间来等待渲染结束
  * 完美解决办法：**watch + $nextTick**
    * 1. watch:监听数据已经从服务器返回
    * 2. nextTick：保证v-for已经遍历完毕，页面结构渲染完成。
      * nextTick定义： 在下次DOM更新(数据从服务器返回)**循环结束后**(v-for渲染结构)延迟回调。在**修改数据后**(服务器数据变为bannerList中的数据)立即执行这个方法，获取更新后的DOM。
  * 总结：nextTick经常和很多插件一起使用，因为nextTick可以保证DOM已经存在了，页面中的结构一定是有的。

### Floor组件
* 切记：仓库中数据格式，不能胡写，数据格式取决于服务器返回的数据
1. 问题1： getFloorList这个action在哪里派发？ 需要在home路由组件中发，不能在floor中发，因为需要v-for遍历floor
   * v-for也可以在自定义标签中使用
2. 问题2：home组件与floor组件，父子通信 - props
   * 组件通信方式：
     * props:父子通信
     * 自定义事件：$on $emit 子父通信
     * 全局事件总线：$bus 全能
     * pubsub: vue中几乎不用
     * 插槽：默认插槽、具名、作用域 
     * vuex
3. 问题3：之前listcontainer中new swiper不能放在mounted中，floor中就可以，为什么？
   * 原因：之前的数据请求是在mounted中发的，然后动态渲染解析【前提至少服务器数据得回来】，而floor中请求的数据来自父组件home，父组件早已拿到数据，早已渲染好了结构，因此可以在mounted中书写

4. 将轮播图组件封装为全局组件
  * 问题：需要保证再使用轮播图位置的结构、使用方式一致
  * 解决：将floor中的new swiper从mounted中，挪到watch中。 但是因为floor中的数据一直不变，所有需要在监听中添加配置型immediate：true，强行在最开始的时候监听一次
  

### 12.搜索页面完善
#### 整体步骤：
1. 静态页面 + 组件
2. 封装api发送数据请求 
3. vuex处理数据
4. 动态展示数据
  
#### 具体实现： 
1. 商品详情数据、品牌数据、品牌属性数据获取
   
2. 处理多次请求数据问题？
  * 问题：将请求数据指令放在mounted中，只会在挂载完毕后，执行一次。不能多次请求数据，实现页面刷新
  * 解决办法：将请求数据指令封装在函数里，哪里需要就在哪里调用
    * 1. mounted()中调用
    * 2. 监控路由变化，调用
  
3. 面包屑处理
  * 1. 展示：路由参数
  * 2. 删除事件：不展示，重新请求数据刷新页面
    * 这里，采用**自己跳转自己**操作实现，刷新页面??? 原因
  * 3. 清空头部搜索框：**兄弟组件通信- bus**
    * 1. 注册$bus
    * 2. 在header组件中 mounted中$on定义事件名和回调函数
    * 3. 在search组件中 $emit该事件,实现通信
  * 4. 品牌和品牌属性面包屑：**子父通信 - 自定义事件**
    * 1. 在父组件中，子组件标签中绑定自定义事件
    * 2. 在子组件对应位置，通过$emit向对应事件提交数据
    * 3. 父组件中定义自定事件，传递的数据通过参数形式获得
  * 5. 获取品牌属性信息：props为数组，如何展示对应的属性值？并且删除呢？
    * 解决方法：v-for遍历数组展示数据； splice(index,1)删除对应属性
    * 注意：需要处理重复属性不能多次展示问题？ => 加入数组前增加判断是否在数组中

4. 排序处理
  * 1. 引入阿里图标库，选择icon - 
    * 首先，font class模式，复制链接，link引入图标地址, 地址中添加https:
    * 其次，在网站中对应位置引入图标标签，class="iconfont icon-类名"
  * 2. 实现箭头、排序关键字切换效果
    * 问题1： 谁应该有active类名 => order中包含1综合|2价格  定义计算属性：isOne|isTwo
    * 问题2：箭头的类型 => order中包含desc降序|asc升序： isDesc|isAsc
    * 问题3：重复点击箭头切换效果
      * 解决办法：
        * 1. 获取当前orderId和orderSortType，
        * 2. 首先与用户点击的ID比较，如果一致，更新neworder为原始ID: 切换后的排序类型；如果不一致，更新neworder为新ID: 原始的排序类型
        * 3. 整理参数，发请求

5. 分页器处理 - 因为在多个组件中使用，可以封装为【全局组件】
自定义分页器开发步骤：
   1. 获取静态组件 - 文档中
   2. 判断需要数据：
       * 当前页码pageNo
       * 每页展示数据数pageSize
       * 总共有多少条数据total - 【获取总共需要多少页 total/pageSize 向上取整】
       * **连续的页码数continues**【奇数 对称，好看】
   3. 先自己传递假数据调试，调试成功后，在获取服务器数据 
   4. 动态展示分页器效果: 上 中 下 三部分展示
   5. 页码点击事件与真实数据替换 - 子父通信：自定义事件
   6. 分页器当前页类名添加
   
* 难点1: 连续页码的起始和结束位置？ 
  * 举例： 当前第8页，前面为6 7 后边为9 10
* 注意2：v-for可以遍历数组|对象|数字|。。
* 注意3： computed计算属性一定记得返回return!!

### 商品详情Detail模块
1. 静态组件
2. 注册为路由组件
  * 当点击商品的图片的时候，跳转到详情页面，这里需要判断是否有参数【产品id】,params参数需要占位
  * 问题：点击图片跳转时，滚轮位置需要自动跳转到顶部？
    * 解决：vue官方文档- 路由滚动行为
      * 为了方便管理路由，将所有routes中的路由规则单独放在一个模块中routes.js
3. 发数据请求api vuex 动态展示数据
   * 新建detail组件的小仓库，并在大仓库中注册
   * 问题1：什么时候派发action? => 在detail挂载完毕的时候 
   * 动态展示数据：使用mapGetters
     * 问题：虚假报错，找不到数据。`Error in render: "TypeError: Cannot read properties of undefined (reading 'category1Name')"`
     * 原因：在仓库汇总配置getters时，由于最初state中数据为一个空对象{}，所以有可能无法获取属性，需要进行处理
     * 解决办法：追加`|| {}`
4. 放大镜Zoom数据获取 
   * 父子通信-props
   * 报错1：放大镜第一项读取渲染假报错。`Error in render: "TypeError: Cannot read properties of undefined (reading '0')"`
   * 原因：父组件给子组件的数据可能会为undefined,因为只有数据请求回来了，仓库中有数据才能传递，否则则为undefined
   * 解决办法：父组件至少给个空数组 `|| []`
     * 报错2：空数组第0项打.报错。`Error in render: "TypeError: Cannot read properties of undefined (reading 'imgUrl')"`
     * 处理：给第一项追加 `|| {}`, 因为数组中的元素为对象
5. 产品属性详细信息动态展示
   * 目标：点击哪个属性，哪个高亮
   * 解决办法：**排他思想**。绑定点击事件，参数需要知道：**点击对象 和 其他所有对象**。 
   * 具体实现：更改所有的属性对象isChecked为0，只有点击的那个属性对象为1
6. 轮播图实现
   * 引包、样式
   * 构建结构
   * watch + nextTick: new swiper
   * 控制每次显示几个图片和每次切换几张图片
   * 实现点击高亮效果js:  配置一个数组，初始值为-1，点击谁，获取谁的索引值;
     * 同时实现点击轮播图，上方大图跟着变： 兄弟通信 => $bus传递当前点击的图片索引值
7. 放大镜实现
   * 为了方框可以移动，有top和left元素，所以一定为定位元素
   * 计算水平位移：offsetx（鼠标距离左侧父亲边框的距离） - 盒子宽度的一半 =  盒子距离父亲边框距离
   * 修改盒子的left top属性前，需要增加超出边界处理
   * 问题：**放大镜实现原理**？
8. 商品数量选择
   * 用户可以输入商品数量 —— **用户可以输入的地方需要谨慎！**
   * 问题：判断用户输入是否合法？
   * 思路：输入框内容* 1，如果有文字，结果为NaN; 另外输入不能Wie负数； 最后合法情况下，数量必须为整数。


### 购物车模块
#### 1. 加入购物车页面
业务：
1. 首先，发请求给服务器，在后台记录商品名和数量 
   * 步骤：api、vuex
   * 注意：**这里服务器不返回数据，不需要在仓库中存储数据**
   * 但是，在组件中需要获得服务器是否存储成功，因此，需要在action中对成功或者失败情况处理
   * 然后，在组件中通过await和async获得promise的结果，再根据try-catch进行成功或者失败的处理
2. 服务器存储成功后，路由跳转到『 成功加入购物车』页面，传参 & 展示商品信息
   * 1. 路由组件编写步骤: 获取静态组件、注册路由、路由跳转到『成功加入购物车』页面
   * 2. 传递参数给购物车页面： 路由传参 - *简单形式*比如：产品个数，直接通过query传参
   * 3. 传递产品信息给购物车页面：产品个数、产品名字、产品图片、产品详情 -- *对象*
    * 问题：如果将*对象*当做query参数进行路由传参，路径恶心（对象会被转义为字符串）! 如何在路由传参不传递产品详情的情况下，获取产品的详情信息呢？
    * 解决办法：**会话存储sessionStorage**，会话结束，数据消失。
      * 本地存储或者会话存储，只能存储字符串。将*对象转为字符串*-> JSON.Stringify(); *字符串转为对象*-> JSON.parse();
      * 具体实现：`sessionStorage.setItem(key,value)` `sessionStorage.getItem(key)`
  * ==路由传参总结：==
    - 简单参数 - query | params
    - 复杂参数（如对象） - 借助本地存储 | 会话存储
  
#### 2. 购物车页面
1. 路由组件编写步骤：获取静态组件ShopCart、注册路由、路由跳转到『购物车』页面
* 注意：需要修改静态组件结构，去掉多余内容 & 重新调整样式布局wideth百分比让各个项目对齐

2. api发请求给服务器，获取购物车数据；
* 问题：发请求获取不到购物车数据？
* 原因：服务器不知道你是谁？ 
* 解决办法：**uuid**，唯一身份标识。 在加入购物车的时候，需要告诉服务器 who are you?
  * 问题1：在『 加入购物车 』 时，接口只能携带两个参数，商品id和数量，无法携带用户临时身份，怎么处理？
    * 解决办法：通过**请求头带参**，在请求拦截器中处理！
    * 具体实现：
      * 在请求拦截器中，获取仓库中存储的uuid，配置请求头字段（不能随便写，与后台商量好的）

  * 问题2：uuid生成的游客身份，一旦生成，不能在变，需要永久存储！
    * 解决办法：**本地存储uuid**
    * 具体实现：
      1. 新建文件夹utils,用来存储常用的功能模块，比如：正则、token等
      2. 在utils中新建文件uuid_token.js，在detail小仓库中使用，返回一个函数getUUID()  注意：该函数别忘了返回值！！！
3. 操作vuex、组件获取数据、展示数据
* 注意：后台返回的购物车数据格式有点不完美~
* 获取数据：使用mapGetters
* 展示数据：
  * 表格中各项
  * 全选按钮
    * 问题1：全选按钮代码不成功？
  * 商品数据处理事件：添加、减少、输入【不同操作，对应不同传参；用户输入位置需要特殊处理】 & 发请求给后台【使用detail仓库中的action方法】& 从后台获取数据重新展示
    * 问题：用户操作太快，可能会出现商品个数负数情况？
    * 解决办法：**节流【重复操作，只计算最后一次】**
    * 具体实现：
      * 1. 引包lodash/throttle
      * 2. 改写方法，使用节流【还未实现！！！】
  * 删除商品
    * api请求：detele 带商品参数 没有返回值
    * vuex
    * 组件展示

 
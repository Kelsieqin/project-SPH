<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件委派|事件委托 -->
      <!-- 将移出的动作添加给父组件，子组件动作通过冒泡机制传递给父组件执行 -->
      <div @mouseleave="leaveIndex" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- search组件中，增加过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="isShow">
            <div class="all-sort-list2" @click="goSearch">
              <!-- 动态展示三级联动数据 -->
              <!-- 遍历展示一级目录 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currtIndex == index }"
              >
                <!-- 动态绑定cur类，实现背景颜色切换 -->
                <h3 @mouseenter="enterIndex(index)">
                  <!-- 自定义属性区分a标签 -->
                  <a
                    :data-categoryname="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <div class="item-list clearfix">
                  <!-- 遍历展示二级目录 -->
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryname="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <!-- 遍历展示三级目录 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryname="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
// 引入小仓库,借助辅助函数处理数据
import { mapState } from "vuex";
// 引入节流函数, 已经自动安装了lodash,直接引入即可。注意： 为了优化性能，可以按需引入
import throttle from "lodash/throttle";

export default {
  name: "Typenav",
  data() {
    return {
      // 初始化索引为非（0-15）
      currtIndex: -1,
      isShow: true,
    };
  },
  methods: {
    // 鼠标进入 添加背景色
    // 注意用户快递划过时，浏览器会出现卡顿现象，需要加入函数节流
    enterIndex: throttle(function (index) {
      this.currtIndex = index;
    }, 50),
    leaveIndex() {
      // 1. 鼠标移出 一级目录失去背景色
      this.currtIndex = -1;
      // 2. 在search中需要，同时隐藏商品列表
      if (this.$route.path !== "/home") {
        this.isShow = false;
      }
    },
    // 事件委托的路由跳转: event获取当前点击对象
    goSearch(event) {
      let element = event.target;
      console.log(element.dataset);
      // 获取当前事件的全部属性【dataset】, 浏览器将自定义属性全部转为小写字母;
      // 解构参数：！！！注意自定义属性必须为data-XXX才能被dataset属性捕捉到！
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      // 1. 处理参数传递
      // 有categoryname属性的都是a标签
      if (categoryname) {
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        if (category1id) {
          // 在query中追加属性
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }

        // 3. 路由传参
        // 3.1 需要增加判断：当前路由身上是否有params参数
        if (this.$route.params) {
          // 2. 合并参数
          location.query = query;
          // 增加params参数
          location.params = this.$route.params;
          // 路由跳转
          this.$router.push(location);
        }
      }
    },
    // 当鼠标移入显示列表
    enterShow() {
      this.isShow = true;
    },
  },
  computed: {
    // 1. 数组写法 ： --  注意这里不能用，因为仓库进行了模块化开发，需要区分是哪个小仓库里的数据！！！
    // ...mapState(['categoryList']),
    // 2. 对象写法：
    ...mapState({
      categoryList(state) {
        // 注意这里的state是大仓库，需要定位到小仓库home获取数据
        return state.home.categoryList;
      },
    }),
  },
  // 组件挂载完毕就发请求，获取数据
  mounted() {

    // 性能优化：切换组件，会频繁发请求数据，将请求指令放在app组件中，优化性能；
    // // 通知vuex发请求，获取数据，存储与仓库中
    // this.$store.dispatch("categoryList");
    // 当组件挂载完毕，增加判断当前路由中组件路径,只要不是home组件，三节列表隐藏
    if (this.$route.path == "/search") {
      this.isShow = false;
    }
  },
};
</script>

<style lang='less' scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }

        // 动态绑定类 修改一级目录背景色
        .cur {
          background-color: skyblue;
        }
      }
    }
    // 过渡动画样式
    // 1. 进入的开始状态
    .sort-enter{
        height: 0px;
    }
    // 2. 进入的结束状态
    .sort-enter-to{
        height: 461px;
    }
    // 3. 进入的方式
    .sort-enter-active{
      // 0.5s  匀速
      transform: all .5s linear ;
    }
  }
}
</style>
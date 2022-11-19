<template>
  <div>
    <Typenav />
    <div class="main">
      <div class="py-container">
        <!--bread 面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类参数面包屑 -->
            <li class="with-x" v-show="searchparams.categoryName">
              {{ searchparams.categoryName
              }}<i @click="deleteCategoryName">×</i>
            </li>
            <!-- 关键字参数面包屑 -->
            <li class="with-x" v-show="searchparams.keyword">
              {{ searchparams.keyword }}<i @click="deleteKeyword">×</i>
            </li>
            <!-- 品牌参数面包屑 -->
            <li class="with-x" v-show="searchparams.trademark">
              {{ searchparams.trademark.split(":")[1]
              }}<i @click="deleteTrademark">×</i>
            </li>
            <!-- 品牌属性字参数面包屑  遍历所有属性，展示属性值-->
            <li
              class="with-x"
              v-for="(attrvalue, index) in searchparams.props"
              :key="index"
            >
              {{ attrvalue.split(":")[1] }}<i @click="deleteProps(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector 商品属性选择-->
        <!-- 子组件向父组件传递参数: 绑定自定义事件【事件名：回调函数】 -->
        <SearchSelector
          @getTrademark="getTrademark"
          @getAttrVule="getAttrVule"
        />

        <!--details 商品详情-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 动态绑定active类  绑定点击事件实现切换排序-->
                <li :class="{ active: isOne }" @click="sort(1)">
                  <!-- 显示箭头 和 箭头样式 -->
                  <!-- 注意：动态绑定箭头样式时，需要考虑双引号""与单引号''交错使用问题 -->
                  <a href="#"
                    >综合<i
                      v-show="isOne"
                      class="iconfont"
                      :class="{
                        'icon-long-arrow-down': isDesc,
                        'icon-long-arrow-up': isAsc,
                      }"
                    ></i
                  ></a>
                </li>
                <li :class="{ active: isTwo }" @click="sort(2)">
                  <a href="#"
                    >价格<i
                      v-show="isTwo"
                      class="iconfont"
                      :class="{
                        'icon-long-arrow-down': isDesc,
                        'icon-long-arrow-up': isAsc,
                      }"
                    ></i
                  ></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 商品详情 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li
                class="yui3-u-1-5"
                v-for="(good, index) in goodsList"
                :key="good.id"
              >
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 这里点击图片应该跳转到商品详情页:声明式导航 -->
                    <!-- 在路由跳转的时候千万别忘记带id（params参数） -->
                    <router-link :to="`/detail/${good.id}`">
                      <img :src="good.defaultImg"/>
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ good.title }}</a
                    >
                  </div>
                  <!-- 评价 -->
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <!-- 测试阶段：配置假的数据，将来需要替换 -->
          <!-- 子父通信：自定义事件getPageNo, 整理参数 发送请求  -->
          <Pagination
            :pageNo="searchparams.pageNo"
            :pageSize="searchparams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from "./SearchSelector/SearchSelector";
// 获取仓库数据
import { mapState, mapGetters } from "vuex";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // 定义参数
      searchparams: {
        // 分类参数
        category1Id: "",
        category2Id: "",
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 搜索参数
        keyword: "",
        // 排序参数 1综合 2价格 desc降序 asc升序
        order: "1:desc",
        // 当前分页
        pageNo: 1,
        // 每页显示多少数据
        pageSize: 10,
        // 商品属性 【id:属性值：属性名】
        props: [],
        // 商品品牌 【id：品牌】
        trademark: "",
      },
    };
  },
  computed: {
    // 为了简化数据，使用 getter 因为getter不区分大小仓库，所以直接可以直接使用数组形式
    ...mapGetters(["goodsList"]),

    // 排序中active类区分判断
    // 综合获得active
    isOne() {
      return this.searchparams.order.indexOf("1") !== -1;
    },
    // 价格获得active
    isTwo() {
      return this.searchparams.order.indexOf("2") !== -1;
    },
    // 箭头样式
    isDesc() {
      return this.searchparams.order.indexOf("desc") !== -1;
    },
    isAsc() {
      return this.searchparams.order.indexOf("asc") !== -1;
    },

    // 获取仓库中商品数据总数total
    ...mapState({
      total(state){
        return state.search.searchList.total;
      }
    })
  },
  watch: {
    $route() {
      // 整理参数 发请求
      Object.assign(this.searchparams, this.$route.query, this.$route.params);
      this.getsearch();
    },
  },
  beforeMount() {
    // 在派发请求前，需要整理参数 - 分类参数 & 搜索参数
    Object.assign(this.searchparams, this.$route.query, this.$route.params);
  },
  // mounted只在挂载结束后，执行一次，不能实现多次数据请求，因此，可以将数据请求封装为函数，在需要时候调用
  mounted() {
    this.getsearch();
  },
  methods: {
    // 请求数据
    getsearch() {
      // 派发商品详情数据申请 - 注意这里至少传递一个空对象，表示请求参数
      this.$store.dispatch("getCategoryList", this.searchparams);
    },
    // 删除分类面包屑
    deleteCategoryName() {
      // 1. 参数置空
      this.searchparams.categoryName = "";
      // 2. 整理参数 发请求 刷新页面
      // Object.assign(this.searchparams, this.$route.query);
      // this.getsearch();

      // 注意这里实现方式：自己跳转自己???
      this.$router.push({
        name: "search",
        params: this.$route.params,
      });
    },
    // 删除关键字面包屑
    deleteKeyword() {
      // 1. 参数置空
      this.searchparams.keyword = "";
      // 2. 整理参数 发请求 刷新页面
      // 注意这里实现方式：自己跳转自己???
      this.$router.push({
        name: "search",
        query: this.$route.query,
      });
      // 3. 清除搜索框  - 利用$bus
      this.$bus.$emit("clearSearch");
    },
    // 从子组件获取品牌信息
    getTrademark(tmId, tmName) {
      // 整理参数形式
      this.searchparams.trademark = `${tmId}:${tmName}`;
      // 发请求
      this.getsearch();
    },
    // 从子组件获取品牌属性信息
    getAttrVule(attrId, attrName, attrValue) {
      // 整理参数形式 【id:属性值：属性名】
      let newProps = `${attrId}:${attrValue}:${attrName}`;
      // 避免多次点击展示重复属性，需要增加判断
      if (this.searchparams.props.indexOf(newProps) == -1) {
        this.searchparams.props.push(newProps);
        // 发请求
        this.getsearch();
      }
    },
    // 删除品牌信息
    deleteTrademark() {
      // 1. 参数置空
      this.searchparams.trademark = "";
      // 2. 发请求
      this.getsearch();
    },
    // 删除品牌属性信息
    deleteProps(index) {
      // 1. 删除对应索引的属性
      this.searchparams.props.splice(index, 1);
      // 2. 发请求
      this.getsearch();
    },
    // 排序箭头切换
    sort(Id) {
      // 1. 保存原始Id和SortType
      let originId = this.searchparams.order.split(":")[0];
      let originSortType = this.searchparams.order.split(":")[1];
      // 2. 根据用户点击的排序按钮 更新新的order
      let newOrder = "";
      if (Id == originId) {
        newOrder = `${originId}:${originSortType == "desc" ? "asc" : "desc"}`;
      } else {
        newOrder = `${Id}: desc`;
      }
      // 3. 整理参数，发请求
      this.searchparams.order = newOrder;
      this.getsearch();
    },

    // 自定义事件---获取子组件中的当前页码
    getPageNo(pageNo){
      // 整理参数
      this.searchparams.pageNo = pageNo;
      // 发送请求
      this.getsearch();
    }
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
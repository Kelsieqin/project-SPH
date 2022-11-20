<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <!-- 头 -->
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <!-- 具体产品 -->
        <ul class="cart-list" v-for="(cart, index) in cartInfoList" :key="cart.id">
          <!-- 是否全选 -->
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked == 1">
          </li>
          <!-- 产品 -->
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <!-- 单价 -->
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <!-- 数量 -->
          <li class="cart-list-con5">
            <!-- 增加或者减少数量需要发请求，告诉服务器，这样刷新后会动态更新 -->
            <!-- 使用之前detail组件中创建过的产品数量接口，参数中产品数量为『前后之前的差值 』，产品id -->
            <a href="javascript:void(0)" class="mins" @click="handler('minus', -1, cart)">-</a>
            <!-- 这里参数为现有值，需要处理 -->
            <input autocomplete="off" type="text" minnum="1" class="itxt" :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <!-- 总价 -->
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <!-- 删除|收藏 -->
          <li class="cart-list-con7">
            <a class="sindelet" @click="deletCartById(cart)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>

      </div>
    </div>
    <!-- 下 -->
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked">
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalSum }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" href="###" target="_blank">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 从仓库中获取数据
import { mapGetters } from 'vuex';
// 引入节流函数, 已经自动安装了lodash,直接引入即可。注意： 为了优化性能，可以按需引入
import throttle from "lodash/throttle";
export default {
  name: 'ShopCart',
  // 检查数据是否获取到
  mounted() {
    // 因为该页面可能要多次发请求，所以封装成函数
    this.getData();
  },
  methods: {
    // 派发获取购物车请求
    getData() {
      this.$store.dispatch('getCartList');
    },
    // 修改后台产品数量
    // 问题：操作太快可能会有负数
    async handler(type, disNum, cart) {
      // type：区分不同操作
      // disNum: 加和减 传递为变化量; input为最终的值需要计算
      // cart: 产品【身上有id】
      switch (type) {
        case 'add':
          disNum = 1
          break;
        case 'minus':
          // 判断当前产品数量是否大于1，小于1则变化量为0
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case 'change':
          // 1. 用户输入非正常情况处理(汉字、负数)- 变化量为0
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0
          } else {
            // 2. 用户输入正常情况(取整数) - 计算变化量
            disNum = parseInt(disNum) - cart.skuNum
          }
      }
      // 派发请求：携带参数，产品id和变化的数量; 并且获取请求结果进行处理
      try {
        // 成功- 获取购物车数据
        await this.$store.dispatch("addOrUpdateShopCart", { skuId: cart.skuId, skuNum: disNum })
        this.getData();
      } catch (error) {
        // 失败- 可以警告等
      }




    },
    // 删除一个商品
    async deletCartById(cart){
      try {
        // 如果删除成功，再次发请求，展示
        await this.$store.dispatch('deleteCartBySkuId',cart.skuId);
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    }

  },
  computed: {
    ...mapGetters(['cartList']),
    // 真正购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    // 计算购买总价
    totalSum() {
      let sum = 0;
      this.cartInfoList.forEach(cart => {
        sum += cart.skuNum * cart.skuPrice;
      });
      return sum
    },
    //判断全选
    isAllChecked() {
      // 每个元素的ischecked都是1 全选则为1,一个不为1，则为0
      return this.cartInfoList.every(item => {
        item.isChecked == 1
      })
    },
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }


        .cart-list-con4 {
          width: 10%;

        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
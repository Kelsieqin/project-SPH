<template>
  <div class="pagination">
    <!-- 上 -->
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">上一页</button>
    <button v-if="startNumAndEndNum.start > 1" @click="$emit('getPageNo', 1)" :class="{active:pageNo==1}">1</button>
    <button v-if="startNumAndEndNum.start > 2">···</button>

    <!-- 中间部分 -->
    <button
      v-for="(page, index) in startNumAndEndNum.end"
      :key="index"
      v-show="page >= startNumAndEndNum.start"
      @click="$emit('getPageNo', page)"
      :class="{active:pageNo==page}"
    >
      {{ page }}
    </button>

    <!-- 下 -->
    <button v-if="startNumAndEndNum.end < totalpage - 1">···</button>
    <button v-if="startNumAndEndNum.end < totalpage" @click="$emit('getPageNo', totalpage)" :class="{active:pageNo==totalpage}">
      {{ totalpage }}
    </button>
    <button :disabled="pageNo == totalpage" @click="$emit('getPageNo', pageNo + 1)">下一页</button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  // 接收父组件参数
  props: ["pageNo", "pageSize", "total", "continues"],
  // 计算属性
  computed: {
    // 总共有多少页 - 向上取整
    totalpage() {
      return Math.ceil(this.total / this.pageSize);
    },
    //计算连续页码起始 结束数字【contines至少为5， 如果小于5 则没有连续页码】
    startNumAndEndNum() {
      // 1. 定义变量
      let start = 0;
      let end = 0;
      // 解构出用到的属性
      const { totalpage, pageNo, continues } = this;
      // 2. 不正常现象：总共页数 < continues
      if (totalpage < continues) {
        start = 1;
        end = continues;
      } else {
        // 3. 正常现象: 开始为当前页码-连续页码数的一半向下取整
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);
        // 4. 处理异常： start为负数，即当前页码为1、2
        if (start < 1) {
          start = 1;
          end = continues;
        }
        // 5. 处理异常： end大于总页码数 即当前页码为 30 31
        if (end > totalpage) {
          start = totalpage - continues + 1;
          end = totalpage;
        }
      }
      // 记得！返回值
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
// 当前页的类名
.active{
  background-color: skyblue;
}
</style>

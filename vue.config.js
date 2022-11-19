const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint校验提示
  lintOnSave:false,
  // 代理跨域
  devServer:{
		proxy:{
			'/api':{//匹配所有以'/api'开头的请求路径
          target:'http://gmall-h5-api.atguigu.cn',//代理目标的基础路径
          // changeOrigin:true,
          // 不需要路径重写
          // pathRewrite:{'^/api1':''}
			},
		},
	},

})

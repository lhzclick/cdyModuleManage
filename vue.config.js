module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 6060,     // 端口
        open: true,     // 自动打开浏览器
        proxy: {
            '/api':{
                target:process.env.VUE_APP_API_ROOT,		//	后台服务地址
                changeOrigin:true,
                pathRewrite:{
                    '/api':'http://localhost:6060'				//	前端项目地址，当遇到	/api路径时做请求代理
                }
            }
        }
    },
    lintOnSave: false, 
    outputDir:'moduleManage'
}

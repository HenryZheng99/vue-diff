const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');

module.exports={
  mode: 'development',
  output:{
    path:path.resolve(__dirname,'../dist'),
    filename:'[name]-bundle.js' 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'),
      chunks  : ['index'],//可以设置chunks按需引入JS文件，不设置就会引入所有产出的js
	    chunksSortMode: 'manual',
    })
  ],
  devtool: 'source-map'
};

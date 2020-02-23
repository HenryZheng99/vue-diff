const path=require('path');

module.exports=function (env, argv){
  env=env||{};

  let conf=null;

  if(env.production){
    conf=require('./config/webpack.production');
  }else{
    conf=require('./config/webpack.development');
  }

  return {
    entry: {
      index: path.resolve(__dirname, './src/index.js')
    }, 
    module: {
      rules: [
        {
            test: /\.js/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                "presets": ["es2015", "stage-0"],
                "plugins": ["transform-runtime", "transform-decorators-legacy"]
            }
        }
    ]
    },
    ...conf
  };
};

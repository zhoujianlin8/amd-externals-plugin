### amd-externals-plugin

use
````
plugins:[new amdExternalsPlugin({
    externals: externals,
    name: '[name]',
    wrap: function(obj){ return obj.arrOutput} // you can use it to add something
})]
````


* if you use this , not use webpackConfig.externals and webpackConfig.output.libraryTarget
* it output as amd by default and the externals will use require('xx') as amd
* you can alse use it to wrap
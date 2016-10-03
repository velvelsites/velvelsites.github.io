var prod = false;//process.env.ENV.trim() === 'production';
var plugins = [];
// plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|he/));
var loaders = [{
				test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?mimetype=application/font-woff'
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/i,
				loader: 'url?mimetype=application/octet-stream'
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url'
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?mimetype=image/svg+xml'
			}, {
				test: /\.(jpg|png|gif)$/,
				loader: 'url'
			}, {
				test: /\.(css|scss)$/,
				loader: 'style!css?' + (prod ? '-minimize' : 'sourceMap') + '!postcss!sass'
			}, {
				test: /\.(sass)$/,
				loader: 'style!css?' + (prod ? '-minimize' : 'sourceMap') + '!postcss!sass?indentedSyntax'
			}, {
				test: /\.(html)$/,
				loader: 'html'
			}, {
				test: /\.(json)$/,
				loader: 'json!strip-json-comments-loader'
			}];

loaders.push({
				test: /\.(js)$/,
				exclude: /(node_modules|bower_components)/,
				loader: (prod ? 'uglify!' : '') + 'ng-annotate!babel?presets[]=es2015&plugins[]=syntax-decorators&plugins[]=ng-annotate'
			});
module.exports = {
    entry: './src/js/index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
	plugins: plugins,
    module: {
        loaders:loaders
    }
}
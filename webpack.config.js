module.exports = {
	entry: './client/main.js',
	output: {
		path: __dirname,
		// TODO two bundles, one for app code one for libraries
		// cache the libraries one in SW
		filename: './public/bundle.js'
	},
	module: {
		loaders: [
		// TODO get these two to do their job
		// then, remove cp /img/* from package.json build script
			{
				test: /\.css$/,
				loader: 'style!css'
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				loaders: [
					'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}'
				]
			}
		]
	}
};




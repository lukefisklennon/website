const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
	mode: "development",
	devServer: {
		port: 3000
	},
	output: {
		filename: "[contenthash].js",
		path: path.resolve(__dirname, "dist")
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		})
	],
	module: {
        rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"]
					}
				}
			}
		]
	}
}

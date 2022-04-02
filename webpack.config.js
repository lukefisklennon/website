const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
	mode: "production",
	devServer: {
		port: 3000
	},
	output: {
		filename: "[hash].js",
		path: path.resolve(__dirname, "dist")
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		})
	],
	devtool: "inline-source-map",
	module: {
        rules: [
			{
				test: /\.(html)$/,
				use: ["html-loader"]
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
				use: [
					"file-loader",
				],
			},
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

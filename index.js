const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const bodyParser = require('body-parser')
const { join, resolve } = require('path')
const { readFile, writeFile } = require('fs')
const app = express()

const compiler = webpack({
  entry: {
    app: join(__dirname, 'src', 'index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  externals: {
    'pixi.js': 'PIXI',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: { loader: 'babel-loader' }
      }
    ]
  }
})

const html = `
<html>
<head>
  <style>
    body, div {
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100vw;
      height: 100vh;
      margin: auto;
    }
  </style>
</head>
<body>
  <div class="container"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.5.1/pixi.min.js"></script>
  <script src="app.bundle.js"></script>
</body>
</html>
`

app.use(webpackDevMiddleware(compiler, {}))
app.get('/', (req, res) => res.status(200).send(html))
app.use(bodyParser.json())
app.post('/person/:id', (req, res) => {
  const fileContents = JSON.stringify(req.body, null, 2)
  const filePath = join(process.cwd(), 'src', 'people', `${req.params.id}.json`)
  console.log('========')
  console.log(filePath)
  console.log(fileContents)
  writeFile(filePath, fileContents, (err) => {
    if (err) res.status(500).send('Something bad.')
    else res.status(200).send('Something good.')
  })
})

app.listen(5556)

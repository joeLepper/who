const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const bodyParser = require('body-parser')
const { join, resolve } = require('path')
const { readFile, writeFile } = require('fs')
const app = express()
const cwd = process.cwd()
const DEFAULT_PERSON = 'yaml'

const compiler = webpack({
  entry: {
    app: join(__dirname, 'src', 'index.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/assets',
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

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/assets',
}))
app.get('/', (req, res) => {
  const filePath = join(cwd, 'src', 'people', `${DEFAULT_PERSON}.json`)
  readFile(filePath, 'utf8', (err, contents) => {
    const person = JSON.parse(contents)
    res.redirect(`/person/${DEFAULT_PERSON}/node/${person[0].id}`)
  })
})
app.use(bodyParser.json())
app.post('/person/:id', (req, res) => {
  const fileContents = JSON.stringify(req.body, null, 2)
  const filePath = join(cwd, 'src', 'people', `${req.params.id}.json`)
  console.log('========')
  console.log(filePath)
  console.log(fileContents)
  writeFile(filePath, fileContents, (err) => {
    if (err) res.status(500).send('Something bad.')
    else res.status(200).send('Something good.')
  })
})
app.get('/person/:id', (req, res) => {
  res.sendFile(join(cwd, 'src', 'people', req.params.id))
})
app.get('/person/:id/node/:nodeId', (req, res) => {
  res.sendFile(join(cwd, 'src', 'index.html'))
})

app.listen(5556)

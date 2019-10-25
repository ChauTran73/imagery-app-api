const app = require('./app') //import the app

const { PORT } = require('./config')

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
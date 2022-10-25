const jsonServer = require('json-server')
const cors = require('cors')
const server = jsonServer.create()
const router = jsonServer.router('tmp/db.json')
const defaultMiddlewares = jsonServer.defaults()

server.use(cors())
server.use(defaultMiddlewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})

module.exports = server
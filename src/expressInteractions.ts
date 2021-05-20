import express from 'express'
import { CreateInteractions } from './interactionTypes'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { parseLikeObject } from './commonInteractions'
import { getTemplate } from './expressTemplate'

export const createExpressInteractions = (createInteractions: CreateInteractions, target: string) => {
  const app = express()
  app.use(express.json())
  const interactions = createInteractions((v) => v)
  const config = Object.keys(interactions).reduce((acc, cur) => {
    acc[cur] = Object.keys(interactions[cur].given)[0]
    return acc
  }, {} as { [index: string]: string })
  const sortedInteractions = Object.keys(interactions)
    .map((key) => ({
      key,
      value: interactions[key],
      path: interactions[key].withRequest.path,
    }))
    .sort((a, b) => b.path.length - a.path.length)
  app.get('/__interactions', (req, res) => {
    const interactionOptions = Object.keys(interactions).map((key) => ({
      interaction: key,
      given: Object.keys(interactions[key].given),
    }))
    res.send(getTemplate(interactionOptions, config))
  })
  app.post('/__interactions', (req, res) => {
    if (!interactions[req.body?.interaction]?.given[req.body?.given]) {
      res.sendStatus(400)
      return
    }
    config[req.body?.interaction] = req.body?.given
    res.sendStatus(200)
  })
  for (const interaction of sortedInteractions) {
    const func = (req: express.Request, res: express.Response) => {
      const given = interaction.value.given[config[interaction.key]]
      const body = parseLikeObject(given.body)
      const status = parseLikeObject(given.status)
      const headers = parseLikeObject(given.headers)
      res.status(status).header(headers).send(body)
    }
    switch (interaction.value.withRequest.method) {
      case 'GET':
        app.get(interaction.path, func)
        break
      case 'POST':
        app.post(interaction.path, func)
        break
      case 'PUT':
        app.put(interaction.path, func)
        break
      default:
        throw 'Not implemented yet!'
    }
  }
  app.use('/', createProxyMiddleware({ target, changeOrigin: true }))
  return app.listen(4000)
}

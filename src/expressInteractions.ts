import express, { Express } from 'express'
import {CreateInteractions, InteractionContent} from './interactionTypes'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { parseLikeObject } from './commonInteractions'
import { getTemplate, getWrapper } from './web/expressTemplate'

const handleMockedResponses = (
  app: Express,
  interactions: { key: string; value: InteractionContent<any, any, any, any, any>; path: string }[],
  config: { [p: string]: { selected: number; values: string[] } }
) => {
  for (const interaction of interactions) {
    const func = (req: express.Request, res: express.Response) => {
      const selectedIndex = config[interaction.key].selected
      const selectedKey = config[interaction.key].values[selectedIndex]
      const given = interaction.value.given[selectedKey]
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
      case "DELETE":
        app.delete(interaction.path, func)
        break
      default:
        throw 'Not implemented yet!'
    }
  }
}

const sortInteractions = (interactions: { [p: string]: InteractionContent<any, any, any, any, any> }) =>
  Object.keys(interactions)
    .map((key) => ({
      key,
      value: interactions[key],
      path: interactions[key].withRequest.path,
    }))
    .sort((a, b) => b.path.length - a.path.length)

const createDefaultConfig = (interactions: { [p: string]: InteractionContent<any, any, any, any, any> }) =>
  Object.keys(interactions).reduce((acc, cur) => {
    const interaction = interactions[cur]
    acc[cur] = {
      values: Object.keys(interaction.given),
      selected: 0,
      method: interaction.withRequest.method,
      path: interaction.withRequest.path,
    }
    return acc
  }, {} as { [index: string]: { selected: number; values: string[]; method: string; path: string } })

const handleGetInteractions = (app: Express, config: { [p: string]: { selected: number; values: string[] } }) => {
  app.get('/__interactions', (req, res) => {
    res.send(config)
  })
}

const handleSetInteractions = (app: Express, config: { [p: string]: { selected: number; values: string[] } }) => {
  app.post('/__interactions', (req, res) => {
    if (!config[req.body?.interaction] || config[req.body?.interaction].values.length <= req.body?.index) {
      res.sendStatus(400)
      return
    }
    config[req.body?.interaction].selected = req.body?.index
    res.sendStatus(200)
  })
}

function handleWeb(app: Express) {
  app.get('/__', (req, res) => {
    res.send(getTemplate())
  })
}

function handleWrapper(app: Express) {
  app.get('/_', async (req, res) => {
    res.send(await getWrapper())
  })
}

export const createExpressInteractions = (createInteractions: CreateInteractions, target: string) => {
  const app = express()
  app.use(express.json())
  const interactions = createInteractions((v) => v)
  const config = createDefaultConfig(interactions)
  const sortedInteractions = sortInteractions(interactions)
  handleGetInteractions(app, config)
  handleSetInteractions(app, config)
  handleMockedResponses(app, sortedInteractions, config)
  handleWeb(app)
  handleWrapper(app)

  app.use('/', createProxyMiddleware({ target, changeOrigin: true }))
  return app.listen(4000)
}

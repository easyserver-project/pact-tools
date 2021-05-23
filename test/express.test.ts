import { createExpressInteractions } from '../src/expressInteractions'
import { createTestInteractions } from './testInteractions'
import axios from 'axios'

describe('Express', function () {
  test('Get value', async () => {
    const server = createExpressInteractions(createTestInteractions, 'http://localhost:1234')
    const result = await axios.get('http://localhost:4000/api/name/somename/demo')
    expect(result.data).toStrictEqual({ responseId: 'something' })
    await server.close()
  })

  test('Get interactions', async () => {
    const server = createExpressInteractions(createTestInteractions, 'http://localhost:1234')
    const result = await axios.get('http://localhost:4000/__interactions')
    expect(result.data.pathParamsInteraction).toStrictEqual({ values: ['success'], selected: 0 })
    await server.close()
  })

  test('Set interaction', async () => {
    const server = createExpressInteractions(createTestInteractions, 'http://localhost:1234')
    const before = await axios.put('http://localhost:4000/api/successfail')
    const result = await axios.post('http://localhost:4000/__interactions', {
      interaction: 'successFailInteraction',
      index: 1,
    })
    expect(result.status).toEqual(200)
    const after = await axios.put('http://localhost:4000/api/successfail', {}, { validateStatus: () => true })
    expect(before.status).toEqual(200)
    expect(after.status).toEqual(401)
    await server.close()
  })

  test('control web', async () => {
    const server = createExpressInteractions(createTestInteractions, 'http://localhost:1234')
    const result = await axios.get('http://localhost:4000/__')
    const text = result.data
    const startWith = text.trimStart().startsWith('<html')
    expect(startWith).toBeTruthy()
    await server.close()
  })
})

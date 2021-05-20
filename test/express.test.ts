import { createExpressInteractions } from '../src/expressInteractions'
import { createInteractions } from './interactions'
import axios from 'axios'

describe('Express', function () {
  test('Get value', async () => {
    const server = createExpressInteractions(createInteractions, 'http://localhost:1234')
    const result = await axios.get('http://localhost:4000/api/name/somename/demo')
    expect(result.data).toStrictEqual({ responseId: 'something' })
    await server.close()
  })

  test('Get interactions', async () => {
    const server = createExpressInteractions(createInteractions, 'http://localhost:1234')
    const result = await axios.get('http://localhost:4000/__interactions')
    expect(result.data.startsWith('<html')).toBeTruthy()
    await server.close()
  })

  test('Set interaction', async () => {
    const server = createExpressInteractions(createInteractions, 'http://localhost:1234')
    const before = await axios.put('http://localhost:4000/api/successfail')
    const result = await axios.post('http://localhost:4000/__interactions', {
      interaction: 'successFailInteraction',
      given: 'fail',
    })
    expect(result.status).toEqual(200)
    const after = await axios.put('http://localhost:4000/api/successfail', {}, { validateStatus: () => true })
    expect(before.status).toEqual(200)
    expect(after.status).toEqual(401)
    await server.close()
  })
})

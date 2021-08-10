import { createExpressInteractions } from '../src/expressInteractions'
import { createTestInteractions, interactionsWithoutLikeFunc } from './testInteractions'
import axios from 'axios'

declare const expect: jest.Expect

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
    expect(result.data.pathParamsInteraction).toStrictEqual({
      values: ['success'],
      selected: 0,
      method: 'GET',
      path: '/api/name/:firstName/:lastName',
    })
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

  test('Without like func', async () => {
    const server = createExpressInteractions(() => interactionsWithoutLikeFunc, 'http://localhost:1234')
    const result = await axios.get('http://localhost:4000/demo')
    expect(result.data).toStrictEqual({ value: 'something' })
    await server.close()
  })

  test('Transition', async () => {
    const server = createExpressInteractions(createTestInteractions, 'http://localhost:1234')
    let result = await axios.put('http://localhost:4000/api/successfail')
    expect(result.status).toEqual(200)
    await axios.post('http://localhost:4000/api/transition')
    result = await axios.put('http://localhost:4000/api/successfail', null, { validateStatus: () => true })
    expect(result.status).toEqual(401)
    await server.close()
  })
})

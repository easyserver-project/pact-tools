import { LikeFunc } from '../src/interactionTypes'
import { InteractionContent } from '../src/commonInteractions'

export const createInteractions = (like: LikeFunc = (v) => v) => {
  const emptyInteraction: InteractionContent<
    { name: string },
    undefined,
    undefined,
    undefined
  > = {
    given: {
      undefined: {
        status: 200,
        body: undefined,
      },
      unauthorized: {
        status: 401,
        body: undefined,
      },
    },
    uponReceiving: 'empty',
    withRequest: {
      method: 'PUT',
      path: '/api/empty',
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
      },
      body: {
        name: like('NameHere'),
      },
      pathParams: undefined,
      query: undefined,
    },
  }

  const responseInteraction: InteractionContent<
    undefined,
    { name: string },
    undefined,
    undefined
  > = {
    given: {
      success: {
        status: 200,
        body: { name: like('somename') },
      },
    },
    uponReceiving: 'response',
    withRequest: {
      method: 'GET',
      path: '/api/response',
      headers: {
        Authorization: like('Bearer token'),
        'Content-Type': 'application/json',
      },
      body: undefined,
      pathParams: undefined,
      query: undefined,
    },
  }

  const queryInteraction: InteractionContent<
    undefined,
    { responseId: string },
    { id: string },
    undefined
  > = {
    given: {
      success: {
        status: 200,
        body: { responseId: 'something' },
      },
    },
    uponReceiving: 'query',
    withRequest: {
      method: 'POST',
      path: '/api/query',
      pathParams: undefined,
      query: {
        id: like('something'),
      },
      body: undefined,
    },
  }

  const pathParamsInteraction: InteractionContent<
    undefined,
    { responseId: string },
    undefined,
    { lastName: string; firstName: string }
  > = {
    given: {
      success: {
        status: 200,
        body: { responseId: 'something' },
      },
    },
    uponReceiving: 'path params',
    withRequest: {
      method: 'GET',
      path: '/api/:firstName/:lastName',
      body: undefined,
      query: undefined,
      pathParams: { firstName: 'Person', lastName: 'Personsson' },
    },
  }

  return {
    emptyInteraction,
    responseInteraction,
    queryInteraction,
    pathParamsInteraction,
  }
}

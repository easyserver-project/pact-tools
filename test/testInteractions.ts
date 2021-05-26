import {InteractionContent, LikeFunc} from '../src/interactionTypes'

export const createTestInteractions = (like: LikeFunc = (v) => v) => {
  const emptyInteraction: InteractionContent<{ name: string }, void, {}, {}, {}> = {
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
      pathParams: {},
      query: {},
      headerParams: {},
    },
  }

  const responseInteraction: InteractionContent<void, { name: string }, {}, {}, {}> = {
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
      pathParams: {},
      query: {},
      headerParams: {},
    },
  }

  const queryInteraction: InteractionContent<void, { responseId: string }, { id: string }, {}, {}> = {
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
      pathParams: {},
      query: {
        id: like('something'),
      },
      body: undefined,
      headerParams: {},
    },
  }

  const pathParamsInteraction: InteractionContent<
    void,
    { responseId: string },
    {},
    { lastName: string; firstName: string },
    {}
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
      path: '/api/name/:firstName/:lastName',
      body: undefined,
      query: {},
      headerParams: {},
      pathParams: { firstName: like('Person'), lastName: like('Personsson') },
    },
  }

  const headerParamsInteraction: InteractionContent<void, void, {}, {}, { Authorization: string }> = {
    given: {
      success: {
        status: 200,
        body: undefined,
      },
    },
    uponReceiving: 'header params',
    withRequest: {
      method: 'GET',
      path: '/api/headers',
      body: undefined,
      query: {},
      pathParams: {},
      headerParams: { Authorization: like('Bearer sometokenhere') },
    },
  }

  const successFailInteraction: InteractionContent<{ name: string }, { id: string }, {}, {}, {}> = {
    given: {
      success: {
        status: 200,
        body: { id: like('something') },
      },
      fail: {
        status: 401,
        body: undefined,
      },
    },
    uponReceiving: 'success or fail',
    withRequest: {
      method: 'PUT',
      path: '/api/successfail',
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
      },
      body: {
        name: like('NameHere'),
      },
      pathParams: {},
      query: {},
      headerParams: {},
    },
  }

  return {
    emptyInteraction,
    responseInteraction,
    queryInteraction,
    pathParamsInteraction,
    headerParamsInteraction,
    successFailInteraction,
  }
}

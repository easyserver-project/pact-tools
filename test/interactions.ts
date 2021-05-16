import {LikeFunc} from "../src/interactionTypes";
import {InteractionContent} from "../src/commonInteractions";

export type TestRequestBody = {
    name: string
}

export const createInteractions = (like: LikeFunc = v => v) => {
    const emptyInteraction: InteractionContent<TestRequestBody, undefined> = {
        given: {
            undefined: {
                status: 200,
                body: undefined
            },
            unauthorized: {
                status: 401,
                body: undefined
            }
        },
        uponReceiving: 'test',
        withRequest: {
            method: 'PUT',
            path: '/api/put',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json'
            },
            body: {
                name: like("NameHere")
            }
        }
    }

    const responseInteraction: InteractionContent<void, { name: string }> = {
        given: {
            success: {
                status: 200,
                body: {name: like("somename")}
            }
        },
        uponReceiving: 'test',
        withRequest: {
            method: 'GET',
            path: '/api/get',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json'
            },
            body: undefined
        }
    }

    return {
        emptyInteraction, responseInteraction
    }
}
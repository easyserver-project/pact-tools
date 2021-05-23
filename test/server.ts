import { createExpressInteractions } from '../src/expressInteractions'
import { createTestInteractions } from './testInteractions'

createExpressInteractions(createTestInteractions, 'http://localhost:1234')
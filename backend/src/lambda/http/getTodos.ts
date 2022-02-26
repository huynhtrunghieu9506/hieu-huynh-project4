import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { getAll } from '../../helpers/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos')

// Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todos = await getAll(userId)

    logger.info(`Get all todos by user ${userId}`)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  })
handler.use(
  cors({
    credentials: true
  })
)

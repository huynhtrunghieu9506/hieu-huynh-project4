import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createToDo } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('CreateTODO')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info(`Processing create event ${event}`)

    const userId = getUserId(event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const newItem = await createToDo(userId, newTodo)

    logger.info(`Create todo succeded`)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'

import * as uuid from 'uuid'
import { generateSignedUrl, updateUrl } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('UploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const attachmentId = uuid.v4()

    logger.info(`Uploading attachment ${attachmentId}`)

    const signedUrl = await generateSignedUrl(attachmentId)
    await updateUrl(userId, todoId, attachmentId)
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: signedUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

import { ToDosAccess } from "./todosAcess";
import { AttachmentUtils } from "./attachmentUtils";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

import { createLogger } from "../utils/logger";

const toDoAccess = new ToDosAccess()
const attachmentUtils = new AttachmentUtils()

const logger = createLogger('BusinessLogic')

export async function createToDo(userId: string, request: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4()
    
    const item: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...request
    }

    logger.info(`Creating todo ${item}`)
    await toDoAccess.createToDo(item)

    return item
}

export async function getAll(userId: string): Promise<TodoItem[]> {
    logger.info(`Get todos by userId ${userId}`)

    return await toDoAccess.getAllTodos(userId)
}

export async function updateTodo(userId: string, todoId: string, request: UpdateTodoRequest): Promise<TodoItem> {
    logger.info(`Updating todo ${request} by userId ${userId} and todoId ${todoId}`)

    const todo = await toDoAccess.getToDo(todoId)

    if(!todo)
        throw new Error('Todo not found')

    if(todo.userId !== userId)
        throw new Error('User is not authorized to modify')

    return await toDoAccess.updateToDo(todoId, request)
}

export async function deleteTodo(userId: string, todoId: string) {
    logger.info(`deleting todo ${todoId} for user ${userId}`)

    const todo = await toDoAccess.getToDo(todoId)

    if(!todo)
        throw new Error('Todo not found')

    if(todo.userId !== userId)
        throw new Error('User is not authorized to delete')

    await toDoAccess.deleteTodo(todoId)
}

export async function updateUrl(userId: string, todoId: string, attachmentId: string) {
    logger.info(`update todo attachment ${attachmentId}`)

    const attachmentUrl = await attachmentUtils.getUrl(attachmentId)

    const todo = await toDoAccess.getToDo(todoId)

    if(!todo)
        throw new Error('Todo not found')

    if(todo.userId !== userId)
        throw new Error('User is not authorized to update attachment')

    await toDoAccess.updateUrl(todoId, attachmentUrl)
}

export async function generateSignedUrl(attachmentId: string): Promise<String> {
    logger.info(`Generating signed url`)

    return await attachmentUtils.getSignedUrl(attachmentId)
}
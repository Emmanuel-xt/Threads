import *  as z from 'zod'


export const ThreadValidation = z.object({
    thread: z.string().min(1, { message: 'Thread cannot be empty ' }).min(3, { message: 'Threadd must have a minimum of three characters' }),
    accountId: z.string()
})
export const CommentValidation = z.object({
    thread: z.string().min(1, { message: 'Thread cannot be empty ' }).min(3, { message: 'Threadd must have a minimum of three characters' }),
    // accountId: z.string()
})
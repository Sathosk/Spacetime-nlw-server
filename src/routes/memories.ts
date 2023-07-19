import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
    app.get('/memories', async () => {
        const memories = await prisma.memory.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        })

        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat('...')
            }
        })
    })

    app.get('/memories/:id', async (req) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(req.params)

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            }
        })

        return memory
    })

    app.post('/memories', async (req) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        })


        const { content, coverUrl, isPublic } = bodySchema.parse(req.body)

        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: '7ed7533f-d89b-44af-a524-8ca2e45948dd',
            },
        })

        return memory
    })

    app.put('/memories/:id', async (req) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        })

        const { content, coverUrl, isPublic } = bodySchema.parse(req.body)

        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(req.params)

        const updatedMemory = await prisma.memory.update({
            where: {
                id,
            },
            data: {
                content,
                coverUrl,
                isPublic
            }
        })

        return updatedMemory
    })

    app.delete('/memories/:id', async (req) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(req.params)

        await prisma.memory.delete({
            where: {
                id,
            }
        })
    })


}

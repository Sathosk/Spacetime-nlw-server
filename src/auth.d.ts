import '@fastify/jwt'
import { takeCoverage } from 'v8'

declare module '@fastify/jwt' {
    export interface FastifyJWT {
        user: {
            sub: string
            name: string
            avatarUrl: string
        }
    }
}

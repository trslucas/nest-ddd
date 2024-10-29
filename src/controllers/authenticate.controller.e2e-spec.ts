import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Authenticate account (E2E)', () => {
  let app: INestApplication

  let prisma: PrismaService
  beforeAll(async () => {
    const moduelRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduelRef.createNestApplication()

    prisma = moduelRef.get(PrismaService)

    await app.init()
  })
  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Lucas',
        email: 'lucas@thsm.global',
        password: await hash('123456', 8),
      },
    })
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'lucas@thsm.global',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})

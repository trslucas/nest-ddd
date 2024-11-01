import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create question (E2E)', () => {
  let app: INestApplication

  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {
    const moduelRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduelRef.createNestApplication()

    prisma = moduelRef.get(PrismaService)

    jwt = moduelRef.get(JwtService)

    await app.init()
  })
  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Lucas',
        email: 'lucas@thsm.global',
        password: await hash('123456', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send({
        title: 'Nova pergunta',
        content: 'Nova pergunta que foi criada',
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'Nova pergunta',
      },
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})

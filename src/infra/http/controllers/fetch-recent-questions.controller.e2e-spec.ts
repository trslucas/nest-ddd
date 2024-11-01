import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import type { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
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
  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Lucas',
        email: 'lucas@thsm.global',
        password: await hash('123456', 8),
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          slug: 'question-01',
          content: 'Question Content',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          slug: 'question-02',
          content: 'Question Content',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set(`Authorization`, `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ],
    })
  })
})

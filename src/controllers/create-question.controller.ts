import { Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

import { PrismaService } from 'src/prisma/prisma.service'
// import { z } from 'zod'

// const authenticateBodySchema = z.object({
//   email: z.string().email(),
//   password: z.string(),
// })

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle() {
    return 'questions'
  }
}

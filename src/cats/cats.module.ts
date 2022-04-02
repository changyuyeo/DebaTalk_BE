import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'

import { AuthModule } from '@auth/auth.module'
import { CatsController } from '@cats/cats.controller'
import { CatsRepository } from '@cats/cats.repository'
import { Cat, CatSchema } from '@cats/cats.schema'
import { CatsService } from '@cats/cats.service'
import { Comment, CommentSchema } from '@comments/comments.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Cat.name, schema: CatSchema },
			{ name: Comment.name, schema: CommentSchema }
		]),
		MulterModule.register({ dest: './upload' }),
		forwardRef(() => AuthModule)
	],
	controllers: [CatsController],
	providers: [CatsService, CatsRepository],
	exports: [CatsService, CatsRepository]
})
export class CatsModule {}

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentsController } from '@comments/comments.controller'
import { CommentsService } from '@comments/comments.service'
import { Comment, CommentSchema } from '@comments/comments.schema'
import { CatsModule } from '@cats/cats.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		CatsModule
	],
	controllers: [CommentsController],
	providers: [CommentsService]
})
export class CommentsModule {}

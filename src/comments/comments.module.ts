import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentsController } from '@comments/comments.controller'
import { Comment, CommentSchema } from '@comments/comments.schema'
import { CommentsService } from '@comments/comments.service'
import { PostsModule } from '@posts/posts.module'
import { UsersModule } from '@users/users.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		PostsModule,
		UsersModule
	],
	controllers: [CommentsController],
	providers: [CommentsService],
	exports: []
})
export class CommentsModule {}

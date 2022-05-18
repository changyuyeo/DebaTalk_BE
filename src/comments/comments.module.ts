import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CommentsController } from '@comments/comments.controller'
import { Comment, CommentSchema } from '@comments/comments.schema'
import { CommentsService } from '@comments/comments.service'
import { PostsModule } from '@posts/posts.module'
import { Post, PostSchema } from '@posts/posts.schema'
import { UsersModule } from '@users/users.module'
import { User, UserSchema } from '@users/users.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Comment.name, schema: CommentSchema },
			{ name: Post.name, schema: PostSchema },
			{ name: User.name, schema: UserSchema }
		]),
		PostsModule,
		UsersModule
	],
	controllers: [CommentsController],
	providers: [CommentsService],
	exports: []
})
export class CommentsModule {}

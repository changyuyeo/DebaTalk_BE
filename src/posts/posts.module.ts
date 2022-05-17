import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Comment, CommentSchema } from '@comments/comments.schema'
import { PostsController } from '@posts/posts.controller'
import { Post, PostSchema } from '@posts/posts.schema'
import { PostsService } from '@posts/posts.service'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Comment.name, schema: CommentSchema },
			{ name: Post.name, schema: PostSchema }
		])
	],
	controllers: [PostsController],
	providers: [PostsService],
	exports: [PostsService]
})
export class PostsModule {}

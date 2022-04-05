import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { PostsController } from '@posts/posts.controller'
import { PostsRepository } from '@posts/posts.repository'
import { Post, PostSchema } from '@posts/posts.schema'
import { PostsService } from '@posts/posts.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])
	],
	controllers: [PostsController],
	providers: [PostsService, PostsRepository]
})
export class PostsModule {}

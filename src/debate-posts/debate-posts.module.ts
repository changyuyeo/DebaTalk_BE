import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DebatePostService } from '@debatePosts/debate-posts.service'
import { DebatePostController } from '@debatePosts/debate-posts.controller'
import { DebatePost, DebatePostSchema } from './debate-posts.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: DebatePost.name, schema: DebatePostSchema }
		])
	],
	providers: [DebatePostService],
	controllers: [DebatePostController]
})
export class DebatePostsModule {}

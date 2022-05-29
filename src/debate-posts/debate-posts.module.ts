import { Module } from '@nestjs/common'

import { DebatePostService } from '@debatePosts/debate-posts.service'
import { DebatePostController } from '@debatePosts/debate-posts.controller'

@Module({
	providers: [DebatePostService],
	controllers: [DebatePostController]
})
export class DebatePostsModule {}

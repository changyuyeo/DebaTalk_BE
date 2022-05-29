import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import * as mongoose from 'mongoose'

import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { CommentsModule } from '@comments/comments.module'
import { LoggerMiddleware } from '@common/middlewares/logger.middleware'
import { DebatePostsModule } from '@debatePosts/debate-posts.module'
import { PostsModule } from '@posts/posts.module'
import { UsersModule } from '@users/users.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}),
		CommentsModule,
		DebatePostsModule,
		PostsModule,
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false

	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
		mongoose.set('debug', this.isDev)
	}
}

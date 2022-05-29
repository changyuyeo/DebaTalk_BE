import {
	HttpException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from '@users/users.schema'
import { DebatePost } from './debate-posts.schema'
import {
	DebatePostQueryDto,
	DebatePostRequestDto
} from './dtos/debate-posts.request.dto'

@Injectable()
export class DebatePostService {
	constructor(
		@InjectModel(DebatePost.name)
		private readonly debatePostModel: Model<DebatePost>
	) {}

	//* 모든 토론게시물 조회 serivce
	async getAllDebatePosts(data: DebatePostQueryDto) {
		const { limit, skip, key, category, title } = data
		// const CommentsModel = model('comments', CommentSchema)
		let posts: DebatePost[]

		if (key) {
			//* key 값으로 정렬
			if (key !== 'createDate' && key !== 'hits' && key !== 'likeList')
				throw new HttpException('올바른 key 값이 아닙니다.', 400)
			posts = await this.debatePostModel
				.find()
				// .populate('comments', CommentsModel)
				.sort({ [key]: -1 })
				.limit(limit ? Number(limit) : 3)
				.skip(skip ? Number(skip) : 0)
		} else if (category || title) {
			//* 게시물 검색
			posts = await this.debatePostModel
				.find({ category, title })
				// .populate('comments', CommentsModel)
				.limit(limit ? Number(limit) : 10)
				.skip(skip ? Number(skip) : 0)
		} else {
			//* 게시물 모두 조회
			posts = await this.debatePostModel
				.find()
				// .populate('comments', CommentsModel)
				.limit(limit ? Number(limit) : 10)
				.skip(skip ? Number(skip) : 0)
		}

		return posts.map(post => post.readOnlyData)
	}

	//* 특정 토론게시물 조회 serivce
	async getOneDebatePost(id: string) {
		const debatePost = await this.debatePostModel.findById(id)
		return debatePost.readOnlyData
	}

	//* 토론게시물 생성 serivce
	async createDebatePost(
		user: User,
		body: DebatePostRequestDto,
		file?: Express.Multer.File
	) {
		if (user.manageLevel === 0)
			throw new UnauthorizedException('권한이 없습니다.')

		const fileName = file ? `debate_posts/${file.filename}` : null
		const newPost = await this.debatePostModel.create({
			imgUrl: fileName
				? `${process.env.SERVER_URI}/media/${fileName}`
				: 'default',
			...body
		})

		return newPost.readOnlyData
	}
}

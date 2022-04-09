import {
	HttpException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { model, Model, Types } from 'mongoose'

import { CommentSchema } from '@comments/comments.schema'
import { PostQueryDto, PostRequestDto } from '@posts/dtos/posts.request.dto'
import { Post } from '@posts/posts.schema'

@Injectable()
export class PostsRepository {
	constructor(
		@InjectModel(Post.name) private readonly postModel: Model<Post>
	) {}

	async getAllPosts(data: PostQueryDto) {
		const { limit, skip } = data
		const CommentsModel = model('comments', CommentSchema)
		const Posts = await this.postModel
			.find()
			.populate('comments', CommentsModel)
			.sort({ hits: -1 })
		return Posts
	}

	async findPostById(id: string | Types.ObjectId) {
		const post = await this.postModel.findById(id)
		return post
	}

	async createPost(
		id: string | Types.ObjectId,
		post: PostRequestDto,
		fileName: string | null
	): Promise<Post> {
		const newPost = await this.postModel.create({
			author: id,
			imgUrl: fileName
				? `${process.env.SERVER_URI}/media/${fileName}`
				: 'default',
			...post
		})
		return newPost
	}

	async updatePost(
		postId: string | Types.ObjectId,
		userId: string | Types.ObjectId,
		body: PostRequestDto,
		fileName: string | null
	): Promise<Post> {
		const post = await this.postModel.findById(postId)
		if (!post) throw new HttpException('해당 게시물을 찾을 수 없습니다.', 400)
		const { category, title, content } = body
		if (post.author === userId) {
			post.category = category
			post.title = title
			post.content = content
			post.imgUrl = fileName
				? `${process.env.SERVER_URI}/media/${fileName}`
				: 'default'
			const newPost = await post.save()
			return newPost
		} else throw new UnauthorizedException('유저정보가 일치하지 않습니다.')
	}

	async findPostByIdAndDelete(id: string | Types.ObjectId) {
		const post = await this.postModel.findByIdAndRemove(id)
		return post
	}
}

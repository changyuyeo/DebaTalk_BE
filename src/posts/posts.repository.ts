import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { model, Model, Types } from 'mongoose'

import { CommentSchema } from '@comments/comments.schema'
import { PostRequestDto } from '@posts/dtos/posts.request.dto'
import { Post } from '@posts/posts.schema'

@Injectable()
export class PostsRepository {
	constructor(
		@InjectModel(Post.name) private readonly postModel: Model<Post>
	) {}

	async getAllPosts() {
		const CommentsModel = model('comments', CommentSchema)
		const Posts = await this.postModel
			.find()
			.populate('comments', CommentsModel)
		return Posts
	}

	async findPostById(id: string | Types.ObjectId) {
		const post = await this.postModel.findById(id)
		return post
	}

	async createPost(
		id: string | Types.ObjectId,
		post: PostRequestDto
	): Promise<Post> {
		console.log(id)

		const newPost = await this.postModel.create({
			author: id,
			...post
		})
		return newPost
	}

	async findPostByIdAndDelete(id: string | Types.ObjectId) {
		const post = await this.postModel.findByIdAndRemove(id)
		return post
	}
}

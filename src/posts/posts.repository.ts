import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { PostRequestDto } from '@posts/dtos/posts.request.dto'
import { Post } from '@posts/posts.schema'

@Injectable()
export class PostsRepository {
	constructor(
		@InjectModel(Post.name) private readonly postModel: Model<Post>
	) {}

	async findAllUsers() {
		const Posts = await this.postModel.find()
		return Posts
	}

	async findPostById(id: string | Types.ObjectId) {
		const Post = await this.postModel.findById(id)
		return Post
	}

	async createPost(post: PostRequestDto): Promise<Post> {
		const newPost = await this.postModel.create(post)
		return newPost
	}
}

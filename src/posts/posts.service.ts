import { Injectable } from '@nestjs/common'

import { PostRequestDto } from '@posts/dtos/posts.request.dto'
import { PostsRepository } from '@posts/posts.repository'

@Injectable()
export class PostsService {
	constructor(private readonly postsRepository: PostsRepository) {}

	async getAllPosts() {
		const posts = await this.postsRepository.findAllUsers()
		const readOnlyPosts = posts.map(post => post.readOnlyData)
		return readOnlyPosts
	}

	async getOnePost(id: string) {
		const post = await this.postsRepository.findPostById(id)
		return post.readOnlyData
	}

	async createPost(body: PostRequestDto) {
		const newPost = await this.postsRepository.createPost(body)
		return newPost.readOnlyData
	}
}

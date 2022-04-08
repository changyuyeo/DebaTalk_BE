import { HttpException, Injectable } from '@nestjs/common'

import { PostRequestDto } from '@posts/dtos/posts.request.dto'
import { PostsRepository } from '@posts/posts.repository'
import { User } from '@users/users.schema'

@Injectable()
export class PostsService {
	constructor(private readonly postsRepository: PostsRepository) {}

	async getAllPosts() {
		const posts = await this.postsRepository.getAllPosts()
		const readOnlyPosts = posts.map(post => post.readOnlyData)
		return readOnlyPosts
	}

	async getOnePost(id: string) {
		const post = await this.postsRepository.findPostById(id)
		return post.readOnlyData
	}

	async UpdateLikeOrUnLike(
		user: User,
		id: string,
		type: 'addLike' | 'cancleLike' | 'addUnlike' | 'cancleUnlike'
	) {
		const post = await this.postsRepository.findPostById(id)
		const findIndex = (items: string[]) => items.indexOf(user.id)

		switch (type) {
			case 'addLike':
				if (findIndex(post.likeList) < 0 && findIndex(post.unlikeList) === -1) {
					post.likeList.push(user.id)
					await post.save()
					return { id: user.id }
				} else
					throw new HttpException('이미 추천을 했거나 비추천을 했습니다.', 403)
			case 'cancleLike':
				const likerIndex = findIndex(post.likeList)
				if (likerIndex >= 0) {
					post.likeList.splice(likerIndex, 1)
					await post.save()
					return { id: user.id }
				} else throw new HttpException('추천내역이 없습니다.', 403)
			case 'addUnlike':
				if (findIndex(post.unlikeList) < 0 && findIndex(post.likeList) === -1) {
					post.unlikeList.push(user.id)
					await post.save()
					return { id: user.id }
				} else
					throw new HttpException('이미 비추천을 했거나 추천을 했습니다.', 403)
			case 'cancleUnlike':
				const unlikerIndex = findIndex(post.likeList)
				if (unlikerIndex >= 0) {
					post.likeList.splice(unlikerIndex, 1)
					await post.save()
					return { id: user.id }
				} else throw new HttpException('비추천내역이 없습니다.', 403)
		}
	}

	async createPost(
		user: User,
		body: PostRequestDto,
		file?: Express.Multer.File
	) {
		const fileName = file ? `posts/${file.filename}` : null
		const newPost = await this.postsRepository.createPost(
			user.id,
			body,
			fileName
		)
		return newPost.readOnlyData
	}

	async updatePost(
		postId: string,
		user: User,
		body: PostRequestDto,
		file?: Express.Multer.File
	) {
		const fileName = file ? `posts/${file.filename}` : null
		const newPost = await this.postsRepository.updatePost(
			postId,
			user.id,
			body,
			fileName
		)
		return newPost.readOnlyData
	}

	async deletePost(user: User, id: string) {
		const post = await this.postsRepository.findPostById(id)
		if (!post) throw new HttpException('해당 게시물이 없습니다.', 400)
		if (post.author === user.id) {
			await post.deleteOne()
			return { id: post.id }
		} else throw new HttpException('다른유저의 글은 삭제할 수 없습니다.', 403)
	}
}

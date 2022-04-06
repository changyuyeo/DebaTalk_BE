import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CommentsCreateDto } from '@comments/dtos/comments.create.dto'
import { Comment } from '@comments/comments.schema'
import { PostsRepository } from '@posts/posts.repository'
import { UsersRepository } from '@users/users.repository'

@Injectable()
export class CommentsService {
	constructor(
		@InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
		private readonly postsRepository: PostsRepository,
		private readonly usersRepository: UsersRepository
	) {}

	async getAllComments() {
		try {
			const comments = await this.commentModel.find()
			return comments
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	async getComments(id: string) {
		try {
			const comment = await this.commentModel.findById(id)
			return comment.readOnlyData
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	async createComment(id: string, comments: CommentsCreateDto) {
		try {
			const targetPost = await this.postsRepository.findPostById(id)
			const { author, content } = comments
			const validtedAuthor =
				await this.usersRepository.findUserByIdWithoutPassword(author)
			const newComment = new this.commentModel({
				author: validtedAuthor._id,
				content,
				info: targetPost._id
			})
			const readOnlyComment = await newComment.save()
			return readOnlyComment.readOnlyData
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	//* 댓글 추천 / 비추천 service
	async UpdateLikeOrUnLike(
		id: string,
		type: 'addLike' | 'cancleLike' | 'addUnlike' | 'cancleUnlike'
	) {
		const comment = await this.commentModel.findById(id)
		console.log(comment)
		switch (type) {
			case 'addLike':
				comment.likeCount += 1
				return await comment.save()
			case 'cancleLike':
				comment.likeCount -= 1
				comment.likeCount < 0 && (comment.likeCount = 0)
				return await comment.save()
			case 'addUnlike':
				comment.unlikeCount += 1
				return await comment.save()
			case 'cancleUnlike':
				comment.unlikeCount -= 1
				comment.unlikeCount < 0 && (comment.unlikeCount = 0)
				return await comment.save()
		}
	}
}

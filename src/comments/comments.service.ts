import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CommentsCreateDto } from '@comments/dtos/comments.create.dto'
import { Comment } from '@comments/comments.schema'
import { PostsRepository } from '@posts/posts.repository'
import { User } from '@users/users.schema'
import { UsersRepository } from '@users/users.repository'

@Injectable()
export class CommentsService {
	constructor(
		@InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
		private readonly postsRepository: PostsRepository,
		private readonly usersRepository: UsersRepository
	) {}

	//* 댓글 작성 service
	async createComment(id: string, comments: CommentsCreateDto) {
		try {
			const targetPost = await this.postsRepository.findPostById(id)
			console.log(targetPost)

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
		user: User,
		id: string,
		type: 'addLike' | 'cancleLike' | 'addUnlike' | 'cancleUnlike'
	) {
		const comment = await this.commentModel.findById(id)
		const findIndex = (items: string[]) => items.indexOf(user.id)

		switch (type) {
			case 'addLike':
				if (
					findIndex(comment.likeList) < 0 &&
					findIndex(comment.unlikeList) === -1
				) {
					comment.likeList.push(user.id)
					await comment.save()
					return { id: user.id }
				} else
					throw new HttpException('이미 추천을 했거나 비추천을 했습니다.', 403)
			case 'cancleLike':
				const likerIndex = findIndex(comment.likeList)
				if (likerIndex >= 0) {
					comment.likeList.splice(likerIndex, 1)
					await comment.save()
					return { id: user.id }
				} else throw new HttpException('추천내역이 없습니다.', 403)
			case 'addUnlike':
				if (
					findIndex(comment.unlikeList) < 0 &&
					findIndex(comment.likeList) === -1
				) {
					comment.unlikeList.push(user.id)
					await comment.save()
					return { id: user.id }
				} else
					throw new HttpException('이미 비추천을 했거나 추천을 했습니다.', 403)
			case 'cancleUnlike':
				const unlikerIndex = findIndex(comment.unlikeList)
				if (unlikerIndex >= 0) {
					comment.likeList.splice(unlikerIndex, 1)
					await comment.save()
					return { id: user.id }
				} else throw new HttpException('비추천내역이 없습니다.', 403)
		}
	}

	async deleteComment(user: User, id: string) {
		const comment = await this.commentModel.findById(id)
		if (!comment) throw new HttpException('해당 댓글이 없습니다.', 400)
		if (comment.author.toString() === user.id) {
			await comment.deleteOne()
			return { id: comment.id }
		} else throw new HttpException('다른유저의 댓글은 삭제할 수 없습니다.', 403)
	}
}

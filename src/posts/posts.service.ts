import {
	HttpException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { model, Model } from 'mongoose'

import { CommentSchema } from '@comments/comments.schema'
import { PostQueryDto, PostRequestDto } from '@posts/dtos/posts.request.dto'
import { Post } from '@posts/posts.schema'
import { User } from '@users/users.schema'

@Injectable()
export class PostsService {
	constructor(
		@InjectModel(Post.name) private readonly postModel: Model<Post>
	) {}

	//* 모든 게시물 조회 service
	async getAllPosts(data: PostQueryDto) {
		const { limit, skip } = data
		//* 정렬 (조회수, 추천수, 최신순) 구현
		const CommentsModel = model('comments', CommentSchema)
		const posts = await this.postModel
			.find()
			.populate('comments', CommentsModel)
			.sort({ hits: -1 })

		const readOnlyPosts = posts.map(post => post.readOnlyData)
		return readOnlyPosts
	}

	//* 특정 게시물 조회 service
	async getOnePost(id: string) {
		const post = await this.postModel.findByIdAndRemove(id)
		return post.readOnlyData
	}

	//* 게시물 좋아요 or 싫어요 service
	async UpdateLikeOrUnLike(
		user: User,
		id: string,
		type: 'addLike' | 'cancleLike' | 'addUnlike' | 'cancleUnlike'
	) {
		const post = await this.postModel.findByIdAndRemove(id)
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

	//* 게시물 생성 service
	async createPost(
		user: User,
		body: PostRequestDto,
		file?: Express.Multer.File
	) {
		const fileName = file ? `posts/${file.filename}` : null
		const newPost = await this.postModel.create({
			author: user.id,
			imgUrl: fileName
				? `${process.env.SERVER_URI}/media/${fileName}`
				: 'default',
			...body
		})

		return newPost.readOnlyData
	}

	//* 게시물 수정 service
	async updatePost(
		postId: string,
		user: User,
		body: PostRequestDto,
		file?: Express.Multer.File
	) {
		const fileName = file ? `posts/${file.filename}` : null
		const post = await this.postModel.findById(postId)

		if (!post) throw new HttpException('해당 게시물을 찾을 수 없습니다.', 400)
		const { category, title, content } = body

		if (post.author === user.id) {
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

	async deletePost(user: User, id: string) {
		const post = await this.postModel.findById(id)
		if (!post) throw new HttpException('해당 게시물이 없습니다.', 400)
		if (post.author === user.id) {
			await post.deleteOne()
			return { id: post.id }
		} else throw new HttpException('다른유저의 글은 삭제할 수 없습니다.', 403)
	}
}

import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CatRequestDto } from '@cats/dto/cats.request.dto'
import { Cat } from '@cats/cats.schema'

@Injectable()
export class CatsRepository {
	constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

	async existsByEamil(email: string): Promise<boolean> {
		const res = await this.catModel.exists({ email })
		return !!res
	}

	async findCatByEmail(email: string): Promise<Cat | null> {
		const cat = await this.catModel.findOne({ email })
		return cat
	}

	async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
		const cat = await this.catModel.findById(catId).select('-password')
		return cat
	}

	async create(cat: CatRequestDto): Promise<Cat> {
		return await this.catModel.create(cat)
	}

	async findByIdAndUpdateImg(id: string, fileName: string) {
		const cat = await this.catModel.findById(id)
		cat.imgUrl = `http://localhost:8080/media/${fileName}`
		const newCat = await cat.save()
		return newCat.readOnlyData
	}

	async findAll() {
		return await this.catModel.find()
	}
}

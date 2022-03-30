import {
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	UseInterceptors
} from '@nestjs/common'

import { SuccessInterceptor } from '@common/interceptors/success.interceptor'
import { PositiveIntPipe } from '@common/pipes/positiveInt.pipe'
import { CatsService } from '@cats/cats.service'

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
export class CatsController {
	constructor(private readonly catsService: CatsService) {}

	@Get()
	getAllCat() {
		return { cats: 'all cat' }
	}

	@Get(':id')
	getOneCat(@Param('id', ParseIntPipe, PositiveIntPipe) param: number) {
		console.log(param)
		return 'one cat'
	}

	@Post()
	createCat() {
		return 'create cat'
	}

	@Put(':id')
	updateCat() {
		return 'update cat'
	}

	@Patch(':id')
	updatePartialCat() {
		return 'update'
	}

	@Delete(':id')
	deleteCat() {
		return 'delete'
	}
}

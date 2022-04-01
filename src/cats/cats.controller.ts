import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'

import { LoginRequestDto } from '@auth/dto/login.request.dto'
import { JwtAuthGuard } from '@auth/jwt/jwt.guard'
import { AuthService } from '@auth/auth.service'
import { ReadOnlyDto } from '@cats/dto/cat.dto'
import { CatRequestDto } from '@cats/dto/cats.request.dto'
import { Cat } from '@cats/cats.schema'
import { CatsService } from '@cats/cats.service'
import { CurrentUser } from '@common/decorators/user.decorators'
import { SuccessInterceptor } from '@common/interceptors/success.interceptor'
import { multerOptions } from '@common/utils/multer.options'

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
export class CatsController {
	constructor(
		private readonly authService: AuthService,
		private readonly catsService: CatsService
	) {}

	@ApiOperation({ summary: '현재 고양이 정보 가져오기' })
	@UseGuards(JwtAuthGuard)
	@Get()
	getCurrentCat(@CurrentUser() cat: Cat) {
		return cat.readOnlyData
	}

	@ApiOperation({ summary: '모든 고양이 정보 가져오기' })
	@Get('all')
	getAllCat() {
		return this.catsService.getAllCat()
	}

	@ApiResponse({ status: 500, description: 'Server Error...' })
	@ApiResponse({ status: 200, description: '성공!', type: ReadOnlyDto })
	@ApiOperation({ summary: '회원가입' })
	@Post('signup')
	async signUp(@Body() body: CatRequestDto) {
		return await this.catsService.signUp(body)
	}

	@ApiOperation({ summary: '로그인' })
	@Post('login')
	logIn(@Body() data: LoginRequestDto) {
		return this.authService.jwtLogIn(data)
	}

	@ApiOperation({ summary: '고양이 이미지 업로드' })
	@UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
	@UseGuards(JwtAuthGuard)
	@Post('upload')
	uploadCatImg(
		@UploadedFiles() files: Array<Express.Multer.File>,
		@CurrentUser() cat: Cat
	) {
		return this.catsService.uploadImg(cat, files)
	}
}

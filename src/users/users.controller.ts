import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { LoginResponseDto } from '@auth/dtos/login.dto'
import { LoginRequestDto } from '@auth/dtos/login.request.dto'
import { JwtAuthGuard } from '@auth/jwt/jwt.guard'
import { AuthService } from '@auth/auth.service'
import { UserRequestDto } from '@users/dtos/users.request.dto'
import { ReadOnlyUserDto } from '@users/dtos/users.dto'
import { User } from '@users/users.schema'
import { UsersService } from '@users/users.service'
import { CurrentUser } from '@common/decorators/user.decorator'
import { multerOptions } from '@common/utils/multer.options'

@Controller('users')
export class UsersController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@ApiOperation({ summary: '유저정보 가져오기', tags: ['users'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseGuards(JwtAuthGuard)
	@Get()
	getCurrentsUser(@CurrentUser() user: User) {
		return user.readOnlyData
	}

	@ApiOperation({ summary: '모든 유저정보 가져오기', tags: ['users'] })
	@ApiResponse({ status: 200, description: 'success', type: [ReadOnlyUserDto] })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@Get('all')
	getAllUsers() {
		return this.usersService.getAllUsers()
	}

	@ApiOperation({ summary: '회원가입', tags: ['users'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@Post('signup')
	async signUp(@Body() body: UserRequestDto) {
		return await this.usersService.signUp(body)
	}

	@ApiOperation({ summary: '로그인', tags: ['users'] })
	@ApiResponse({ status: 200, description: 'success', type: LoginResponseDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@Post('login')
	logIn(@Body() body: LoginRequestDto) {
		return this.authService.jwtLogin(body)
	}

	@ApiOperation({ summary: '프로필 사진 업로드 및 업데이트', tags: ['users'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseInterceptors(FileInterceptor('image', multerOptions('users')))
	@UseGuards(JwtAuthGuard)
	@Post('upload')
	uploadProfileImg(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User
	) {
		return this.usersService.uploadImg(user, file)
	}
}

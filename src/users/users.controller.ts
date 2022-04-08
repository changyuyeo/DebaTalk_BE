import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
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
import { CurrentUser } from '@common/decorators/user.decorator'
import { multerOptions } from '@common/utils/multer.options'
import { ReadOnlyUserDto, ReadOnlyUserIdDto } from '@users/dtos/users.dto'
import { UserRequestDto } from '@users/dtos/users.request.dto'
import { User } from '@users/users.schema'
import { UsersService } from '@users/users.service'

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
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('image', multerOptions('users')))
	@Patch('image')
	uploadProfileImg(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User
	) {
		return this.usersService.uploadImg(user, file)
	}

	@ApiOperation({ summary: '프로필 사진 삭제', tags: ['users'] })
	@ApiResponse({ status: 200, description: 'success' })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseGuards(JwtAuthGuard)
	@Delete('image')
	deleteProfileImg(@CurrentUser() user: User) {
		return this.usersService.deleteImg(user)
	}

	@ApiOperation({ summary: '회원탈퇴', tags: ['users'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	deleteUser(@CurrentUser() user: User, @Param('id') targetId: string) {
		return this.usersService.deleteUser(user, targetId)
	}
}

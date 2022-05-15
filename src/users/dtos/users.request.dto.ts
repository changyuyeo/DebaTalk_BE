import { PickType } from '@nestjs/swagger'
import { User } from '@users/users.schema'

export class UserRequestDto extends PickType(User, [
	'userId',
	'email',
	'nickname',
	'password'
] as const) {}

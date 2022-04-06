import { ApiProperty, PickType } from '@nestjs/swagger'

import { User } from '@users/users.schema'

export class ReadOnlyUserIdDto {
	@ApiProperty({
		example: '624bc1796175813107b7ef2f',
		description: '해당유저 아이디'
	})
	id: string
}

export class ReadOnlyUserDto extends PickType(User, [
	'userId',
	'email',
	'nickname',
	'imgUrl',
	'level',
	'point'
] as const) {
	@ApiProperty({
		example: '624bc1796175813107b7ef2f',
		description: '고유 아이디'
	})
	id: string
}

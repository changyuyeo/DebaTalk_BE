import { ApiProperty, PickType } from '@nestjs/swagger'

import { Cat } from '@cats/cats.schema'

export class ReadOnlyDto extends PickType(Cat, ['email', 'name'] as const) {
	@ApiProperty({ example: '624555fcc8cf5796d735dc16', description: 'id' })
	id: string
}

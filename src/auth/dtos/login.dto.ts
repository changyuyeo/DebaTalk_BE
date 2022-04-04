import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. ...',
		description: '토큰 발급'
	})
	token: string
}

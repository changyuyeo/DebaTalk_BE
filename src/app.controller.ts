import { Controller } from '@nestjs/common'

import { AppService } from '@root/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}

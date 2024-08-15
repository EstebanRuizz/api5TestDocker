import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard, Resource, Scopes } from 'nest-keycloak-connect';

@Controller('example')
@UseGuards(AuthGuard)
@Resource('example-resource')
export class ExampleController {
  @Get()
  @Scopes('read')
  getExampleResource() {
    return 'This is a protected resource for reading';
  }

  @Post()
  @Scopes('write')
  createExampleResource() {
    return 'This is a protected resource for writing';
  }
}

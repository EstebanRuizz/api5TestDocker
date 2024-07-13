// import ResourceRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation';
// import type ScopeRepresentation from '@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation';
// import { ApiProperty } from '@nestjs/swagger';
// import { IsString, MinLength } from 'class-validator';

// export class CreateResourceDTO implements ResourceRepresentation {
//   @IsString()
//   @MinLength(1)
//   @ApiProperty()
//   public realmName: string;

//   @IsString()
//   @MinLength(1)
//   @ApiProperty()
//   public clientId: string;

//   @IsString()
//   @MinLength(1)
//   @ApiProperty()
//   public name: string;

//   @IsString({ each: true })
//   @MinLength(1)
//   @ApiProperty()
//   public uris: string[];

//   @ApiProperty()
//   public scopes: ScopeRepresentation[];
// }

// src/core/application/DTO/http/IAM/Client/CreateResourceDTO.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import ScopeRepresentation from '@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation';
import ResourceRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation';

class ScopeDTO implements ScopeRepresentation {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  name: string;
}

export class CreateResourceDTO implements ResourceRepresentation {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  realmName: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  clientId: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  name: string;

  @IsString({ each: true })
  @MinLength(1, { each: true })
  @ApiProperty()
  uris: string[];

  @ValidateNested({ each: true })
  @Type(() => ScopeDTO)
  @IsArray()
  @ApiProperty({ type: [ScopeDTO] })
  scopes: ScopeDTO[];
}

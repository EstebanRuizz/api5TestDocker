import ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import ProtocolMapperRepresentation from '@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation';
import ResourceServerRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceServerRepresentation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ClientRepresentationDTO implements ClientRepresentation {
  @ApiProperty()
  @IsString()
  public realm: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  public access?: Record<string, boolean>;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public adminUrl?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  public attributes?: Record<string, any>;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  public authenticationFlowBindingOverrides?: Record<string, any>;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public authorizationServicesEnabled?: boolean;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @ValidateNested()
  // @Type(() => ResourceServerRepresentation)
  public authorizationSettings?: ResourceServerRepresentation;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public baseUrl?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public bearerOnly?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public clientAuthenticatorType?: string;

  @ApiProperty()
  @IsString()
  public clientId?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public consentRequired?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public defaultClientScopes?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public defaultRoles?: string[];

  @ApiProperty()
  @IsString()
  public description?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public directAccessGrantsEnabled?: boolean;

  @ApiProperty()
  @IsBoolean()
  public enabled?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public alwaysDisplayInConsole?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public frontchannelLogout?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public fullScopeAllowed?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public id?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public implicitFlowEnabled?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public name?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  public nodeReRegistrationTimeout?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  public notBefore?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public optionalClientScopes?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public origin?: string;

  @ApiProperty({ type: String, default: 'openid-connect' })
  @IsNotEmpty()
  @IsString()
  public protocol: string = 'openid-connect';

  @ApiPropertyOptional({ type: [Object] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  // @Type(() => ProtocolMapperRepresentation)
  public protocolMappers?: ProtocolMapperRepresentation[];

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public publicClient?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public redirectUris?: string[];

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  public registeredNodes?: Record<string, any>;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public registrationAccessToken?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public rootUrl?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  public secret?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public serviceAccountsEnabled?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public standardFlowEnabled?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  public surrogateAuthRequired?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public webOrigins?: string[];
}

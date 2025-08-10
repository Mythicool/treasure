import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateClaimDto {
  @ApiProperty({ 
    description: 'ID of the loot box to claim',
    example: 'clm1234567890abcdef'
  })
  @IsString()
  @IsNotEmpty()
  lootBoxId: string;

  @ApiProperty({ 
    description: 'User latitude when claiming',
    example: 37.7749,
    minimum: -90,
    maximum: 90
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ 
    description: 'User longitude when claiming',
    example: -122.4194,
    minimum: -180,
    maximum: 180
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({ 
    description: 'GPS accuracy in meters',
    example: 5.0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  accuracy?: number;

  @ApiProperty({ 
    description: 'Device identifier for anti-fraud',
    example: 'device-uuid-12345',
    required: false
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiProperty({ 
    description: 'IP address for anti-fraud',
    example: '192.168.1.1',
    required: false
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ 
    description: 'User agent for anti-fraud',
    example: 'Mozilla/5.0...',
    required: false
  })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/claim.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('claims')
@Controller('claims')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new claim for a loot box' })
  @ApiResponse({ status: 201, description: 'Claim created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid claim data or already claimed' })
  @ApiResponse({ status: 403, description: 'Not close enough to loot box' })
  @ApiResponse({ status: 404, description: 'Loot box not found' })
  async create(@Request() req, @Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.createClaim(req.user.id, createClaimDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user claims with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Claims retrieved successfully' })
  async findUserClaims(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.claimsService.findUserClaims(req.user.id, page, limit);
  }

  @Patch(':id/redeem')
  @ApiOperation({ summary: 'Redeem a claim' })
  @ApiResponse({ status: 200, description: 'Claim redeemed successfully' })
  @ApiResponse({ status: 400, description: 'Claim already redeemed' })
  @ApiResponse({ status: 404, description: 'Claim not found' })
  async redeem(@Request() req, @Param('id') id: string) {
    return this.claimsService.redeemClaim(id, req.user.id);
  }
}

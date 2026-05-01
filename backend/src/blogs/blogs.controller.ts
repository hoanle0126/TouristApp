import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('destination') destination?: string,
    @Query('tour') tour?: string,
    @Query('hotel') hotel?: string,
    @Query('search') search?: string,
    @Query('per_page') perPage?: string,
  ) {
    return this.blogsService.findAll({
      category,
      destination,
      tour,
      hotel,
      search,
      perPage: this.parsePerPage(perPage),
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findOne(slug);
  }

  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogsService.create(dto);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateBlogDto) {
    return this.blogsService.update(slug, dto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.blogsService.remove(slug);
  }

  private parsePerPage(perPage?: string) {
    if (!perPage) {
      return undefined;
    }

    const parsed = Number(perPage);

    if (!Number.isInteger(parsed) || parsed < 1) {
      return undefined;
    }

    return Math.min(parsed, 50);
  }
}

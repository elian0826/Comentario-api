import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, HttpException } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { Video } from './entities/video.entity';

@Controller('videos')
@UseInterceptors(ClassSerializerInterceptor)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createVideoDto: CreateVideoDto) {
    try {
      const video = await this.videosService.create(createVideoDto);
      return {
        id: video.id,
        title: video.title,
        url: video.url,
        user_id: video.user_id,
        created_at: video.created_at
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Error al crear el video'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    const videos = await this.videosService.findAll();
    return videos.map(video => ({
      id: video.id,
      title: video.title,
      url: video.url,
      user_id: video.user_id,
      created_at: video.created_at
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const video = await this.videosService.findOne(+id);
    return {
      id: video.id,
      title: video.title,
      url: video.url,
      user_id: video.user_id,
      created_at: video.created_at
    };
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const videos = await this.videosService.findByUser(+userId);
    return videos.map(video => ({
      id: video.id,
      title: video.title,
      url: video.url,
      user_id: video.user_id,
      created_at: video.created_at
    }));
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.videosService.remove(+id);
  }
} 
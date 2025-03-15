import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { User } from '../users/entities/user.entity';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const video = this.videosRepository.create({
      title: createVideoDto.title,
      url: createVideoDto.url,
      user_id: createVideoDto.user_id
    });
    
    return await this.videosRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return this.videosRepository.find({
      relations: ['user']
    });
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videosRepository.findOne({
      where: { id },
      relations: ['user', 'comments']
    });

    if (!video) {
      throw new NotFoundException('Video no encontrado');
    }

    return video;
  }

  async findByUser(userId: number): Promise<Video[]> {
    return this.videosRepository.find({
      where: { user_id: userId },
      relations: ['user']
    });
  }

  async remove(id: number): Promise<void> {
    const video = await this.findOne(id);
    await this.videosRepository.remove(video);
  }
} 
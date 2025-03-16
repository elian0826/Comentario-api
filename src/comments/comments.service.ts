import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Video } from '../videos/entities/video.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const video = await this.videoRepository.findOne({
      where: { id: createCommentDto.video_id }
    });

    if (!video) {
      throw new NotFoundException(`Video con ID ${createCommentDto.video_id} no encontrado`);
    }

    const comment = this.commentsRepository.create({
      content: createCommentDto.content,
      video_id: createCommentDto.video_id,
      user_id: createCommentDto.user_id
    });

    return await this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.video', 'video')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'comment.id',
        'comment.content',
        'comment.video_id',
        'comment.user_id',
        'comment.created_at',
        'video.id',
        'video.title',
        'video.url',
        'user.id',
        'user.username'
      ])
      .orderBy('comment.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
    return comment;
  }

  async remove(id: number): Promise<void> {
    const result = await this.commentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comentario con ID ${id} no encontrado`);
    }
  }

  async findByVideoId(videoId: number): Promise<any> {
    console.log('Service: Buscando video con ID:', videoId);
    
    const video = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.comments', 'comments')
      .leftJoinAndSelect('comments.user', 'user')
      .where('video.id = :videoId', { videoId })
      .orderBy('comments.created_at', 'DESC')
      .getOne();

    console.log('Service: Video encontrado:', video);

    if (!video) {
      throw new NotFoundException(`Video con ID ${videoId} no encontrado`);
    }
    
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.video_id = :videoId', { videoId })
      .select([
        'comment.id',
        'comment.content',
        'comment.video_id',
        'comment.user_id',
        'comment.created_at',
        'user.id',
        'user.username'
      ])
      .orderBy('comment.created_at', 'DESC')
      .getMany();

   
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        if (!comment.user) {
          const user = await this.userRepository.findOne({
            where: { id: comment.user_id },
            select: ['id', 'username']
          });
          return {
            ...comment,
            user: user || { id: comment.user_id, username: 'Usuario no encontrado' }
          };
        }
        return comment;
      })
    );

    return {
      id: video.id,
      title: video.title,
      url: video.url,
      created_at: video.created_at,
      total_comments: commentsWithUsers.length,
      comments: commentsWithUsers.map(comment => ({
        id: comment.id,
        content: comment.content,
        video_id: comment.video_id,
        user_id: comment.user_id,
        created_at: comment.created_at,
        user: {
          id: comment.user.id,
          username: comment.user.username
        }
      }))
    };
  }

  async findByVideoAndUser(videoId: number, userId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { 
        video_id: videoId,
        user_id: userId
      }
    });
  }

  async getVideosWithComments(): Promise<any[]> {
    return this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'video.id',
        'video.title',
        'video.url',
        'video.user_id',
        'video.created_at',
        'comment.id',
        'comment.content',
        'comment.video_id',
        'comment.user_id',
        'comment.created_at',
        'user.id',
        'user.username'
      ])
      .orderBy('video.id', 'ASC')
      .addOrderBy('comment.created_at', 'DESC')
      .getMany();
  }
}


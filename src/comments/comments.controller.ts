import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    try {
      const comment = await this.commentsService.create(createCommentDto);
      return {
        id: comment.id,
        content: comment.content,
        video_id: comment.video_id,
        user_id: comment.user_id,
        created_at: comment.created_at
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al crear el comentario'
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/video/:videoId')
  async getVideoComments(@Param('videoId', ParseIntPipe) videoId: number) {
    try {
      console.log('Buscando comentarios para el video:', videoId);
      const result = await this.commentsService.findByVideoId(videoId);
      console.log('Respuesta:', result);
      return result;
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      throw new HttpException({
        status: 'error',
        message: 'Error al obtener los comentarios del video'
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Get('video/:videoId/user/:userId')
  async getVideoUserComments(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Param('userId', ParseIntPipe) userId: number
  ) {
    try {
      const comments = await this.commentsService.findByVideoAndUser(videoId, userId);
      return comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        video_id: comment.video_id,
        user_id: comment.user_id,
        created_at: comment.created_at
      }));
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al obtener los comentarios del usuario para este video'
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Get('videos/comments')
  async getAllVideosWithComments() {
    try {
      const videos = await this.commentsService.getVideosWithComments();
      return {
        videos: videos.map(video => ({
          id: video.id,
          title: video.title,
          url: video.url,
          user_id: video.user_id,
          created_at: video.created_at,
          total_comments: video.comments?.length || 0,
          comments: (video.comments || []).map(comment => ({
            id: comment.id,
            content: comment.content,
            user_id: comment.user_id,
            video_id: comment.video_id,
            created_at: comment.created_at,
            user: {
              id: comment.user.id,
              username: comment.user.username
            }
          }))
        }))
      };
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al obtener los videos con sus comentarios'
      }, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  async findAll() {
    try {
      const comments = await this.commentsService.findAll();
      return comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        video: {
          id: comment.video.id,
          title: comment.video.title,
          url: comment.video.url
        },
        user: {
          id: comment.user.id,
          username: comment.user.username
        }
      }));
    } catch (error) {
      throw new HttpException({
        status: 'error',
        message: 'Error al obtener los comentarios'
      }, HttpStatus.NOT_FOUND);
    }
  }
}

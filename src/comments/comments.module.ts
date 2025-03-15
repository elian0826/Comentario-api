import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Video } from '../videos/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Video])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}



import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PostgresDatabaseProviderService } from 'src/providers/database/postgres/provider.service';

@Injectable()
export class MessageService {
  constructor(private readonly db: PostgresDatabaseProviderService) {}

  public async CreateMessage(data: Prisma.MessageCreateManyInput) {
    return this.db.message.create({
      data,
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  public async deleteMessage(messageId: string) {
    return await this.db.message.update({
      where: {
        id: messageId,
      },
      data: {
        fileUrl: null,
        content: 'This message has been deleted',
        deleted: true,
      },
    });
  }

  public async updateMessage(
    messageId: string,
    content: string,
    updatedAt?: Date
  ) {
    return await this.db.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
        updatedAt,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  public async getMessageChannel({
    take,
    skip,
    channelId,
    cursor,
  }: {
    take: number;
    skip: number;
    channelId: string;
    cursor?: string;
  }) {
    return await this.db.message.findMany({
      take,
      skip,
      ...(cursor ? { cursor: { id: cursor } } : {}),
      where: {
        channelId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async getMessageById(messageId: string) {
    return this.db.message.findUnique({
      where: {
        id: messageId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
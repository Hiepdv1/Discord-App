import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateway/chat.gateway';
import { PostgresDatabaseProviderService } from 'src/providers/database/postgres/provider.service';
import { AuthWsMiddleware } from 'src/common/middlewares/AuthWs.middleware';
import { ConfigService } from '@nestjs/config';
import { RequestNonceService } from '../requestNonce/services/requestNonce.service';
import { ClientService } from '../client/services/client.service';
import { WsClerkAuthGuard } from 'src/common/guard/auth/WsClerkAuth.guard';
import { AuthService } from '../auth/services/auth.service';
import { ServerService } from '../server/services/server.service';
import { ChannelService } from '../channels/services/channel.service';
import { MessageService } from './services/message.service';
import { WsCombinedGuard } from 'src/common/guard/WsCombined.guard';
import { WsSignatureGuard } from 'src/common/guard/Signature/WsSignature.guard';
import { ConversationService } from '../conversation/services/conversation.service';
import { ProfileCacheService } from '../auth/services/profileCache.service';
import { ServerCacheService } from '../server/services/serverCache.service';
import { RedisCacheService } from 'src/providers/cache/redis.cache';

@Module({
  providers: [
    PostgresDatabaseProviderService,
    ChatService,
    ChatGateway,
    AuthWsMiddleware,
    ConfigService,
    RequestNonceService,
    ClientService,
    WsClerkAuthGuard,
    AuthService,
    ServerService,
    ChannelService,
    MessageService,
    ProfileCacheService,
    WsCombinedGuard,
    WsSignatureGuard,
    WsClerkAuthGuard,
    ConversationService,
    ServerCacheService,
    RedisCacheService,
  ],
  exports: [
    ChatGateway,
    ChatService,
    PostgresDatabaseProviderService,
    AuthWsMiddleware,
    ConfigService,
    RequestNonceService,
    ClientService,
    WsClerkAuthGuard,
    AuthService,
    ServerService,
    ChannelService,
    MessageService,
    ProfileCacheService,
    WsCombinedGuard,
    WsSignatureGuard,
    ConversationService,
    ServerCacheService,
    RedisCacheService,
  ],
})
export class SocketModule {}

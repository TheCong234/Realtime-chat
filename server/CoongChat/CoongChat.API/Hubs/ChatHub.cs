using System.Security.Claims;
using CoongChat.Application.Interfaces;
using CoongChat.Domain.Common;
using CoongChat.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CoongChat.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IUserConnectionRepository _userConnectionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessageStatusRepository _messageStatusRepository;

        public ChatHub(
            IUserConnectionRepository userConnectionRepository,
            IUserRepository userRepository,
            IConversationRepository conversationRepository,
            IMessageStatusRepository messageStatusRepository)
        {
            _userConnectionRepository = userConnectionRepository;
            _userRepository = userRepository;
            _conversationRepository = conversationRepository;
            _messageStatusRepository = messageStatusRepository;
        }

        private Guid GetUserId()
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            var connectionId = Context.ConnectionId;

            // Add connection record
            var connection = new UserConnection
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ConnectionId = connectionId,
                ConnectedAt = DateTime.UtcNow
            };
            await _userConnectionRepository.AddAsync(connection);

            // Update user status to Online
            await _userRepository.UpdateStatusAsync(userId, UserStatus.Online);

            // Notify all clients about user status change
            await Clients.Others.SendAsync("UserStatusChanged", new
            {
                UserId = userId,
                Status = (int)UserStatus.Online
            });

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetUserId();
            var connectionId = Context.ConnectionId;

            // Remove connection record
            await _userConnectionRepository.RemoveByConnectionIdAsync(connectionId);

            // Check if user has other active connections
            var remainingConnections = await _userConnectionRepository.GetConnectionCountByUserIdAsync(userId);

            if (remainingConnections == 0)
            {
                // Update user status to Offline
                await _userRepository.UpdateStatusAsync(userId, UserStatus.Offline);

                // Notify all clients about user status change
                await Clients.Others.SendAsync("UserStatusChanged", new
                {
                    UserId = userId,
                    Status = (int)UserStatus.Offline
                });
            }

            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Join a conversation group for real-time updates
        /// </summary>
        public async Task JoinConversation(Guid conversationId)
        {
            var userId = GetUserId();

            // Verify user is a member of the conversation
            var member = await _conversationRepository.GetMemberAsync(conversationId, userId, CancellationToken.None);
            if (member == null)
            {
                throw new HubException("User is not a member of this conversation.");
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());

            // Mark all messages in this conversation as delivered for this user
            await _messageStatusRepository.MarkAllAsDeliveredAsync(userId, conversationId);
        }

        /// <summary>
        /// Leave a conversation group
        /// </summary>
        public async Task LeaveConversation(Guid conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        /// <summary>
        /// Mark a specific message as delivered
        /// </summary>
        public async Task MarkMessageDelivered(Guid messageId)
        {
            var userId = GetUserId();

            await _messageStatusRepository.UpdateStatusAsync(messageId, userId, MessageReadStatus.Delivered);

            // Notify the sender about the delivery
            await Clients.Group(messageId.ToString()).SendAsync("MessageStatusChanged", new
            {
                MessageId = messageId,
                UserId = userId,
                Status = (int)MessageReadStatus.Delivered
            });
        }

        /// <summary>
        /// Mark all messages in a conversation as seen
        /// </summary>
        public async Task MarkConversationAsSeen(Guid conversationId)
        {
            var userId = GetUserId();

            await _messageStatusRepository.MarkAllAsSeenAsync(userId, conversationId);

            // Notify all members in the conversation
            await Clients.Group(conversationId.ToString()).SendAsync("ConversationSeen", new
            {
                ConversationId = conversationId,
                UserId = userId,
                Status = (int)MessageReadStatus.Seen
            });
        }

        /// <summary>
        /// Get list of online user IDs
        /// </summary>
        public async Task<List<Guid>> GetOnlineUsers()
        {
            return await _userConnectionRepository.GetOnlineUserIdsAsync();
        }
    }
}

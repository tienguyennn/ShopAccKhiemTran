using Microsoft.AspNetCore.SignalR;

namespace N.Api.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            Console.WriteLine($"User {userId} đã join Group {userId}");
        }
    }
}

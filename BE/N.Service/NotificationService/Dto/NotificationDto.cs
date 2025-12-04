using N.Model.Entities;

namespace N.Service.NotificationService.Dto
{
    public class NotificationDto : Notification
    {
        public string FromUserName { get; set; }
        public FileDinhKem? FileTaiLieu { get; set; }
        public string CreateStr => this.CreatedDate.ToString("dd/MM/yyyy HH:mm:ss");
    }

    public class FileDinhKem
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
    }
}

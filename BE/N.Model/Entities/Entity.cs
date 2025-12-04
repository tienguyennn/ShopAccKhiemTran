using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace N.Model.Entities
{

    public class BaseEntity
    {
        public static bool operator ~(BaseEntity baseEntity) => baseEntity is not null;
    }


    public interface IEntity
    {
        public Guid Id { get; set; }
    }

    [PrimaryKey(nameof(Id))]
    public class Entity : BaseEntity, IEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
    }
}

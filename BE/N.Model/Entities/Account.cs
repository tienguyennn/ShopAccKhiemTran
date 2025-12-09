using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace N.Model.Entities
{
    [Table("Account")]
    public class Account : AuditableEntity
    {
        [Required]
        [StringLength(100)]
        public string AccountCode { get; set; }

        [Required]
        [StringLength(50)]
        public string GameType { get; set; } // Valorant, DeltaForce, ValorantMobile

        [Required]
        [StringLength(100)]
        public string Rank { get; set; } // Bạc II, Vàng III, etc

        [Required]
        public decimal Price { get; set; }

        [Required]
        public Guid SellerId { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Status { get; set; } // Available, Sold, Pending

        public bool IsPublished { get; set; } = false;

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(1000)]
        public string? Images { get; set; } // JSON array of image URLs

        public int Rating { get; set; } = 5;

        public int SoldCount { get; set; } = 0;

        public DateTime? CreatedDate { get; set; }
        public Guid? CreatedId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Guid? UpdatedId { get; set; }
        public string? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}

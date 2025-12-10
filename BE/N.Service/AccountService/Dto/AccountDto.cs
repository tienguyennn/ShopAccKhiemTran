using System;
using System.ComponentModel.DataAnnotations;

namespace N.Service.AccountService.Dto
{
    public class AccountDto
    {
        public Guid Id { get; set; }
        public string AccountCode { get; set; }
        public string GameType { get; set; }
        public string Rank { get; set; }
        public decimal Price { get; set; }
        public Guid SellerId { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public bool IsPublished { get; set; }
        public string? ImageUrl { get; set; }
        public string? Images { get; set; }
        public int Rating { get; set; }
        public int SoldCount { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
    }

    public class AccountCreateUpdateDto
    {
        [Required]
        [StringLength(100)]
        public string AccountCode { get; set; }

        [Required]
        [StringLength(50)]
        public string GameType { get; set; }

        [Required]
        [StringLength(100)]
        public string Rank { get; set; }

        [Required]
        public decimal Price { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

        public bool IsPublished { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(1000)]
        public string? Images { get; set; }

        public int Rating { get; set; }
    }

    public class AccountSearchDto
    {
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? GameType { get; set; }
        public string? Rank { get; set; }
        public string? Status { get; set; }
        public decimal? PriceFrom { get; set; }
        public decimal? PriceTo { get; set; }
        public bool? IsPublished { get; set; }
        public string? SearchText { get; set; }
    }
}

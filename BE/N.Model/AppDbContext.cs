using N.Model.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using System.Security.Claims;

namespace N.Model
{
    public class AppDbContext : IdentityDbContext<AppUser, AppRole, Guid>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            this._httpContextAccessor = httpContextAccessor;
        }

        public DbSet<DM_NhomDanhMuc> DM_NhomDanhMuc { get; set; }
        public DbSet<DM_DuLieuDanhMuc> DM_DuLieuDanhMuc { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<Module> Module { get; set; }
        public DbSet<Operation> Operation { get; set; }
        public DbSet<RoleOperation> RoleOperation { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<Department> Department { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<AppUser>().HasData(
                new AppUser
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    UserName = "admin",
                    Type = "Admin",
                    NormalizedUserName = "ADMIN",
                    Email = "admin",
                    NormalizedEmail = "ADMIN",
                    EmailConfirmed = true,
                    PasswordHash = new PasswordHasher<AppUser>().HashPassword(null, "12345678"),
                    SecurityStamp = Guid.NewGuid().ToString()
                }
            );
            base.OnModelCreating(builder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<AuditableEntity>();

            Guid.TryParse(_httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var userId);
            var userName = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedDate = DateTime.Now;
                    entry.Entity.CreatedId = userId;
                    entry.Entity.CreatedBy = userName;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedDate = DateTime.Now;
                    entry.Entity.UpdatedId = userId;
                    entry.Entity.UpdatedBy = userName;
                }
                else if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedDate = DateTime.Now;
                    entry.Entity.DeletedId = userId;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
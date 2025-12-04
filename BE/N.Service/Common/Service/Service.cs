using Microsoft.EntityFrameworkCore;
using N.Model;
using N.Model.Entities;
using N.Service.Dto;
using System.Linq.Expressions;

namespace N.Service.Common.Service
{
    public class Service<T> : IService<T> where T : class, IAuditableEntity
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<T> _dbset;

        public Service(AppDbContext context)
        {
            this._context = context;
            this._dbset = context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(Guid? id)
        {
            return await _dbset.FindAsync(id);
        }

        public IQueryable<T> GetQueryable()
        {
            return _dbset.AsQueryable();
        }

        public virtual async Task CreateAsync(T entity)
        {
            await _dbset.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task CreateAsync(IEnumerable<T> entities)
        {
            await _dbset.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(T entity)
        {
            _dbset.Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(IEnumerable<T> entities)
        {
            _dbset.UpdateRange(entities);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
            _dbset.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(IEnumerable<T> entities)
        {
            _dbset.RemoveRange(entities);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Expression<Func<T, bool>> filter)
        {
            _dbset.RemoveRange(_dbset.Where(filter));
            await _context.SaveChangesAsync();
        }

        public async Task<List<DropdownOption>> GetDropdownOptions<TField, TValue>(Expression<Func<T, TField>> displayField, Expression<Func<T, TValue>> valueField, TValue? selected = default)
        {
            var displayFieldName = ((MemberExpression)displayField.Body).Member.Name;
            var valueFieldName = ((MemberExpression)valueField.Body).Member.Name;

#pragma warning disable CS8602
            var result = await GetQueryable()
                .Select(x => new DropdownOption
                {
                    Value = EF.Property<TValue>(x, valueFieldName).ToString(),
                    Label = EF.Property<TField>(x, displayFieldName).ToString(),
                    Selected = selected != null && selected.Equals(EF.Property<TValue>(x, valueFieldName))
                })
                .ToListAsync();
#pragma warning restore CS8602

            return result;
        }
    }
}

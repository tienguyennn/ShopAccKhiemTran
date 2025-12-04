using N.Model.Entities;
using System.Linq.Expressions;
using N.Service.Dto;

namespace N.Service.Common.Service
{
    public interface IService<T> where T : class, IAuditableEntity
    {
        Task<T?> GetByIdAsync(Guid? id);
        IQueryable<T> GetQueryable();

        Task CreateAsync(T entity);
        Task CreateAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task UpdateAsync(IEnumerable<T> entities);
        Task DeleteAsync(T entity);
        Task DeleteAsync(IEnumerable<T> entities);
        Task DeleteAsync(Expression<Func<T, bool>> filter);
        Task<List<DropdownOption>> GetDropdownOptions<TField, TValue>(Expression<Func<T, TField>> displayField, Expression<Func<T, TValue>> valueField, TValue? selected = default);
    }
}

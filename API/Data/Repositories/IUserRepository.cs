using API.Entities;

namespace API.Data.Repositories;

public interface IUserRepository
{
    Task<AppUser?> GetByIdAsync(Guid id);
    Task<AppUser?> GetByEmailAsync(string email);
    Task<AppUser?> GetByUsernameAsync(string username);
    Task<IEnumerable<AppUser>> GetAllAsync();
    void Update(AppUser user);
    void Delete(AppUser user);
}

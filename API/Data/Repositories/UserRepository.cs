using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AppUser?> GetByIdAsync(Guid id)
        => await _context.Users.FindAsync(id);

    public async Task<AppUser?> GetByEmailAsync(string email)
        => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<AppUser?> GetByUsernameAsync(string username)
        => await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

    public async Task<IEnumerable<AppUser>> GetAllAsync()
        => await _context.Users
            .Where(u => u.IsActive)
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

    public void Update(AppUser user) => _context.Users.Update(user);

    public void Delete(AppUser user) => _context.Users.Remove(user);
}

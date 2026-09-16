using machen.Models;
using Microsoft.EntityFrameworkCore;

namespace machen.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ToDo> ToDos => Set<ToDo>();
    public DbSet<User> Users => Set<User>();
}
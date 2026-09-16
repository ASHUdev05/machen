using machen.Data;
using machen.DTOs;
using machen.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace machen.Services;

public class TodoService(AppDbContext context) : ITodoService
{
    public async Task<IEnumerable<ToDoResponseDto>> GetToDosAsync(Guid userId, bool isAdmin)
    {
        if (userId == Guid.Empty)
        {
            return [];
        }

        var query = context.ToDos.AsNoTracking().Include(x => x.User);
        if (!isAdmin)
        {
            query = query.Where(x => x.UserId == userId) as IIncludableQueryable<ToDo, User>;
        }
        var todos = await query!.ToListAsync();
        return todos.Select(x => x.ToDto());
    }

    public async Task<ToDoResponseDto> CreateAsync(ToDoRequestDto dto, Guid userId)
    {
        if (userId == Guid.Empty)
            throw new ArgumentException("User ID cannot be empty.", nameof(userId));

        if (dto is null)
            throw new ArgumentNullException(nameof(dto), "Request payload cannot be null.");

        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("ToDo title cannot be empty.", nameof(dto.Title));

        var todo = dto.ToToDo();
        todo.UserId = userId;

        context.ToDos.Add(todo);
        await context.SaveChangesAsync();

        return todo.ToDto();
    }

    public async Task<ToDoResponseDto?> UpdateAsync(Guid todoId, ToDoRequestDto dto, Guid userId, bool isAdmin)
    {
        if (todoId == Guid.Empty)
            throw new ArgumentException("ToDo ID cannot be empty.", nameof(todoId));

        if (userId == Guid.Empty)
            throw new ArgumentException("User ID cannot be empty.", nameof(userId));

        if (dto is null)
            throw new ArgumentNullException(nameof(dto), "Request payload cannot be null.");

        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new ArgumentException("ToDo title cannot be empty.", nameof(dto.Title));

        var todo = await context.ToDos.FirstOrDefaultAsync(t => t.Id == todoId);

        if (todo is null)
            throw new KeyNotFoundException($"ToDo with ID '{todoId}' was not found.");

        if (!isAdmin && todo.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to modify this task.");

        todo.Title = dto.Title;
        todo.IsComplete = dto.IsComplete;
        todo.ModifiedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return todo.ToDto();
    }

    public async Task<bool> DeleteAsync(Guid todoId, Guid userId, bool isAdmin)
    {
        if (todoId == Guid.Empty)
            throw new ArgumentException("ToDo ID cannot be empty.", nameof(todoId));

        if (userId == Guid.Empty)
            throw new ArgumentException("User ID cannot be empty.", nameof(userId));

        var todo = await context.ToDos.FirstOrDefaultAsync(t => t.Id == todoId);

        if (todo is null)
            throw new KeyNotFoundException($"ToDo with ID '{todoId}' was not found.");

        if (!isAdmin && todo.UserId != userId)
            throw new UnauthorizedAccessException("You do not have permission to delete this task.");

        context.ToDos.Remove(todo);
        await context.SaveChangesAsync();

        return true;
    }
}
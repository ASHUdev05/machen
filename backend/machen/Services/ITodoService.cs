using machen.DTOs;

namespace machen.Services;

public interface ITodoService
{
    Task<IEnumerable<ToDoResponseDto>> GetToDosAsync(Guid userId, bool isAdmin);
    Task<ToDoResponseDto> CreateAsync(ToDoRequestDto dto, Guid userId);
    Task<ToDoResponseDto?> UpdateAsync(Guid todoId, ToDoRequestDto dto, Guid userId, bool isAdmin);
    Task<bool> DeleteAsync(Guid todoId, Guid userId, bool isAdmin);
}
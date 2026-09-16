using machen.Models;

namespace machen.DTOs;

public static class ToDoMapper
{
    public static ToDo ToToDo(this ToDoRequestDto dto)
    {
        return new ToDo
        {
            Title = dto.Title
        };
    }

    public static ToDoResponseDto ToDto(this ToDo todo)
    {
        return new ToDoResponseDto(todo.Id, todo.Title, todo.IsComplete, todo.User.Username);
    }
}
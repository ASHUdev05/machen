using System.Security.Claims;
using machen.DTOs;
using machen.Services;

namespace machen.Endpoints;

public class ToDoEndpoints : IEndpointModule
{
    public string BaseRoute => "todos";

    public void MapEndPoints(RouteGroupBuilder builder)
    {
        builder.WithTags("Todos");
        builder.RequireAuthorization();

        builder.MapGet("/", async (ClaimsPrincipal user, ITodoService todoService) =>
        {
            var (userId, isAdmin) = GetUserContext(user);
            var todos = await todoService.GetToDosAsync(userId, isAdmin);
            
            return Results.Ok(todos);
        }).WithName("GetToDos");

        builder.MapPost("/", async (ToDoRequestDto dto, ClaimsPrincipal user, ITodoService todoService) =>
        {
            var (userId, _) = GetUserContext(user);
            var createdTodo = await todoService.CreateAsync(dto, userId);

            return Results.Created($"/todos/{createdTodo.Id}", createdTodo);
        }).WithName("CreateToDo");

        builder.MapPut("/{id:guid}", async (Guid id, ToDoRequestDto dto, ClaimsPrincipal user, ITodoService todoService) =>
        {
            var (userId, isAdmin) = GetUserContext(user);
            var updatedTodo = await todoService.UpdateAsync(id, dto, userId, isAdmin);

            return Results.Ok(updatedTodo);
        }).WithName("UpdateToDo");

        builder.MapDelete("/{id:guid}", async (Guid id, ClaimsPrincipal user, ITodoService todoService) =>
        {
            var (userId, isAdmin) = GetUserContext(user);
            await todoService.DeleteAsync(id, userId, isAdmin);

            return Results.NoContent();
        }).WithName("DeleteToDo");
    }

    private static (Guid UserId, bool IsAdmin) GetUserContext(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
        var userId = Guid.TryParse(userIdClaim, out var id) ? id : Guid.Empty;
        var isAdmin = user.IsInRole("ADMIN");

        return (userId, isAdmin);
    }
}
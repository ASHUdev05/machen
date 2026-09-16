using System.Security.Claims;
using machen.DTOs;
using machen.Services;

namespace machen.Endpoints;

public class AuthEndpoints : IEndpointModule
{
    public string BaseRoute => "auth";
    public void MapEndPoints(RouteGroupBuilder builder)
    {
        builder.WithTags("Auth");
        builder.MapPost("/register", async (RegisterDto dto, IAuthService authService) =>
        {
            var result = await authService.RegisterAsync(dto);
            return result is null ? Results.BadRequest("User already exists.") : Results.Ok(result);
        });

        builder.MapPost("/login", async (LoginDto dto, IAuthService authService) =>
        {
            var result = await authService.LoginAsync(dto);
            return result is null ? Results.Unauthorized() : Results.Ok(result);
        });

        builder.MapGet("/me", async (ClaimsPrincipal user, IAuthService authService) =>
            {
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? user.FindFirst("sub")?.Value;

                if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Results.Unauthorized();
                }

                var profile = await authService.GetProfileAsync(userId);

                return profile is not null
                    ? Results.Ok(profile)
                    : Results.NotFound(new { message = "User profile not found." });
            })
            .RequireAuthorization();

        builder.MapPost("/refresh", async (RefreshTokenRequestDto dto, IAuthService authService) =>
        {
            var result = await authService.RefreshTokenAsync(dto);
            return result is null ? Results.BadRequest("Invalid client request.") : Results.Ok(result);
        });
    }
}
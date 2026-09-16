namespace machen.DTOs;

public record UserProfileDto(
    Guid Id,
    string Username,
    string Role
    );
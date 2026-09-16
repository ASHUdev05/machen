using System.ComponentModel.DataAnnotations;

namespace machen.DTOs;

public record LoginDto(
    [Required]
    [MinLength(4, ErrorMessage = "A Username must be at least 4 characters long."), MaxLength(12, ErrorMessage = "A Username must be 12 characters or less.")]
    string Username,
    [Required]
    [MinLength(8, ErrorMessage = "A Password must be at least 8 characters long.")]
    string Password
    );
using System.ComponentModel.DataAnnotations;

namespace machen.DTOs;

public record ToDoResponseDto(
    Guid Id, 
    [Required]
    [MaxLength(50, ErrorMessage = "A Title must be 50 characters or less.")]
    string Title, 
    bool IsComplete,
    string Username
    );
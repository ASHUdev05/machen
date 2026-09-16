using System.ComponentModel.DataAnnotations;

namespace machen.DTOs;

public record ToDoRequestDto(
    [Required]
    [MaxLength(50, ErrorMessage = "A Title must be 50 characters or less.")]
    String Title, 
    bool IsComplete =  false
    );
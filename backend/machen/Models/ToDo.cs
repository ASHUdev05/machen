using System.ComponentModel.DataAnnotations;

namespace machen.Models;

public class ToDo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required(ErrorMessage = "A Title for ToDo is required.")]
    [MaxLength(50, ErrorMessage = "A Title must be 50 characters or less.")]
    public required string Title { get; set; }
    public bool IsComplete { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedAt { get; set; }  = DateTime.UtcNow;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
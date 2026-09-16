using System.ComponentModel.DataAnnotations;

namespace machen.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required(ErrorMessage = "A Username is required.")]
    [MinLength(4, ErrorMessage = "A Username must be at least 4 characters long."), MaxLength(12, ErrorMessage = "A Username must be 12 characters or less.")]
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } =  string.Empty;
    public string Role { get; set; } = "USER";
    
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpires { get; set; }

    public ICollection<ToDo> ToDos { get; set; } = new List<ToDo>();
}
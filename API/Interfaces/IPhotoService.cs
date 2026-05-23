using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace API.Interfaces;

/// <summary>
/// Abstracts all Cloudinary operations.
/// Returning ImageUploadResult (Cloudinary's own type) gives us
/// access to both the secure_url and the public_id needed for deletion.
/// </summary>
public interface IPhotoService
{
    Task<ImageUploadResult> AddPhotoAsync(IFormFile file, string folder = "listings");
    Task<DeletionResult> DeletePhotoAsync(string publicId);
}

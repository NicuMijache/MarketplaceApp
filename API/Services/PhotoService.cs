using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

/// <summary>
/// Wraps Cloudinary SDK. Two operations only:
/// - Upload: takes an IFormFile, transforms to a stream, calls Cloudinary
/// - Delete: takes a public_id (stored in DB alongside the URL)
///
/// Folder param allows separating user avatars from listing images in Cloudinary.
/// </summary>
public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    public PhotoService(IConfiguration config)
    {
        var cloudName = config["CloudinarySettings:CloudName"]
            ?? throw new InvalidOperationException("CloudinarySettings:CloudName not configured");
        var apiKey = config["CloudinarySettings:ApiKey"]
            ?? throw new InvalidOperationException("CloudinarySettings:ApiKey not configured");
        var apiSecret = config["CloudinarySettings:ApiSecret"]
            ?? throw new InvalidOperationException("CloudinarySettings:ApiSecret not configured");

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;  // always use HTTPS URLs
    }

    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file, string folder = "listings")
    {
        if (file.Length == 0)
            throw new ArgumentException("File is empty");

        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder,
            // Auto-crop to square and limit dimensions for consistent thumbnails
            Transformation = new Transformation()
                .Width(1200)
                .Height(900)
                .Crop("limit")
                .Quality("auto")
                .FetchFormat("auto")  // serves WebP to browsers that support it
        };

        return await _cloudinary.UploadAsync(uploadParams);
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        return await _cloudinary.DestroyAsync(deleteParams);
    }
}

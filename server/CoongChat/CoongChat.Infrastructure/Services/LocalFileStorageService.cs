using CoongChat.Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace CoongChat.Infrastructure.Services
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadFolder;

        public LocalFileStorageService(IWebHostEnvironment environment)
        {
            _environment = environment;
            _uploadFolder = "uploads";
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder, CancellationToken ct = default)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null");

            // Create directory path: wwwroot/uploads/{folder}
            var uploadsPath = Path.Combine(_environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot"), _uploadFolder, folder);

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            // Generate unique filename
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, uniqueFileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream, ct);
            }

            // Return relative URL path
            return $"/{_uploadFolder}/{folder}/{uniqueFileName}";
        }

        public Task DeleteFileAsync(string relativePath, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
                return Task.CompletedTask;

            // Build full path from relative path
            var webRootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var fullPath = Path.Combine(webRootPath, relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Task.CompletedTask;
        }
    }
}

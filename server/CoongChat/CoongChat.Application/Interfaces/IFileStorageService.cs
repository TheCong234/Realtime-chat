using Microsoft.AspNetCore.Http;

namespace CoongChat.Application.Interfaces
{
    public interface IFileStorageService
    {
        /// <summary>
        /// Saves a file to the specified folder
        /// </summary>
        /// <param name="file">The file to save</param>
        /// <param name="folder">Subfolder name (e.g., "avatars")</param>
        /// <param name="ct">Cancellation token</param>
        /// <returns>The relative URL path to access the saved file</returns>
        Task<string> SaveFileAsync(IFormFile file, string folder, CancellationToken ct = default);

        /// <summary>
        /// Deletes a file by its relative path
        /// </summary>
        /// <param name="relativePath">Relative path of the file to delete</param>
        /// <param name="ct">Cancellation token</param>
        Task DeleteFileAsync(string relativePath, CancellationToken ct = default);
    }
}

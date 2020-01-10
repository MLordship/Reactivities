using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        PhotoUplopadResult AddPhoto(IFormFile file);
        string DeletePhoto(string publicId);
    }
}
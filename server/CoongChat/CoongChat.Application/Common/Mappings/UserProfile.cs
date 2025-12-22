using AutoMapper;
using CoongChat.Application.Features.Users.DTOs; 
using CoongChat.Domain.Entities;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDto>();
    }
}

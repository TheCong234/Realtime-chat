using AutoMapper;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Domain.Entities;

namespace CoongChat.Application.Features.Messages.Mapping
{
    public class MessageProfile : Profile
    {
        public MessageProfile()
        {
            CreateMap<Message, MessageDto>();
        }
    }
}

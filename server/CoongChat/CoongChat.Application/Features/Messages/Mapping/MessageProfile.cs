using AutoMapper;
using CoongChat.Application.Features.Messages.Dto;
using CoongChat.Domain.Common;
using CoongChat.Domain.Entities;

namespace CoongChat.Application.Features.Messages.Mapping
{
    public class MessageProfile : Profile
    {
        public MessageProfile()
        {
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                    src.Statuses != null && src.Statuses.Any()
                        ? src.Statuses.Any(s => s.Status == MessageReadStatus.Recalled)
                            ? MessageReadStatus.Recalled
                            : src.Statuses.Min(s => s.Status)
                        : MessageReadStatus.Sent));
        }
    }
}

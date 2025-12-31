using AutoMapper;
using CoongChat.Application.Features.Conversations.Dto;
using CoongChat.Domain.Entities;

namespace CoongChat.Application.Features.Conversations.Mapping
{
    public class ConversationProfile : Profile
    {
        public ConversationProfile()
        {
            CreateMap<Conversation, ConversationDto>()
                .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Members))
                .ForMember(dest => dest.LastMessage, opt => opt.MapFrom(src => src.LastMessage));

            CreateMap<ConversationMember, ConversationMemberDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => src.User.AvatarUrl));
        }
    }
}

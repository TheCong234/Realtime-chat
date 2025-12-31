# Backend Project Context - CoongChat API

## 1. Project Overview

- **Project Type**: Backend REST API
- **Architecture**: Clean Architecture + CQRS (Command Query Responsibility Segregation) + MediatR
- **Purpose**: Hệ thống chat realtime cho phép người dùng đăng ký, đăng nhập, gửi tin nhắn, quản lý cuộc hội thoại (private/group)
- **Domain**: Realtime Chat / Messaging Platform

## 2. Tech Stack

| Category       | Technology                                    |
| -------------- | --------------------------------------------- |
| Platform       | .NET 8 / ASP.NET Core                         |
| Language       | C# 12                                         |
| API Style      | RESTful API                                   |
| ORM            | Entity Framework Core                         |
| Database       | SQL Server                                    |
| Authentication | JWT Bearer Token                              |
| Authorization  | Role-based / Policy-based (`[Authorize]`)     |
| Validation     | FluentValidation + FluentAPI (EF Core config) |
| Mapping        | AutoMapper                                    |
| Messaging/CQRS | MediatR                                       |
| Logging        | (Sử dụng built-in ILogger của ASP.NET Core)   |
| API Docs       | Swagger / OpenAPI                             |
| Realtime       | SignalR (planned)                             |

## 3. Solution Structure

```
CoongChat.sln
├── CoongChat.API/                    # Presentation Layer
│   ├── Controllers/                  # API Controllers
│   ├── Middlewares/                  # Exception handling, logging middleware
│   ├── Program.cs                    # Entry point, DI configuration
│   └── appsettings.json              # Configuration
│
├── CoongChat.Application/            # Application Layer (Use Cases)
│   ├── Features/                     # Feature-based structure
│   │   ├── Auth/                     # Authentication feature
│   │   │   ├── Commands/             # RegisterUser, Login, RefreshToken
│   │   │   ├── Queries/              # GetMyProfile
│   │   │   ├── Handlers/             # Command/Query handlers
│   │   │   ├── Validators/           # FluentValidation validators
│   │   │   └── DTOs/                 # Data transfer objects
│   │   ├── Conversations/            # Conversation feature
│   │   ├── Messages/                 # Messaging feature
│   │   └── Users/                    # User management feature
│   ├── Common/
│   │   ├── Behaviors/                # MediatR pipeline behaviors (ValidationBehavior)
│   │   ├── Exceptions/               # Custom exceptions
│   │   ├── Mappings/                 # AutoMapper profiles
│   │   └── Models/                   # Shared models (BaseResponse, PagedResult)
│   ├── Filters/                      # Query filters
│   ├── Helpers/                      # Helper utilities
│   └── Interfaces/                   # Repository interfaces
│
├── CoongChat.Domain/                 # Domain Layer (Entities)
│   ├── Entities/                     # Domain entities
│   │   ├── User.cs
│   │   ├── Conversation.cs
│   │   ├── ConversationMember.cs
│   │   ├── Message.cs
│   │   ├── MessageAttachment.cs
│   │   ├── MessageStatus.cs
│   │   ├── Notification.cs
│   │   ├── OtpCode.cs
│   │   ├── RefreshToken.cs
│   │   └── UserConnection.cs
│   └── Common/
│       ├── BaseEntity.cs             # Base entity with Id
│       └── Enums.cs                  # Shared enums
│
└── CoongChat.Infrastructure/         # Infrastructure Layer
    ├── Persistence/
    │   └── AppDbContext.cs           # EF Core DbContext + Fluent API config
    ├── Repositories/                 # Repository implementations
    ├── Identity/                     # JWT, PasswordHasher services
    └── Migrations/                   # EF Core migrations
```

## 4. Dependency Rules (STRICT)

```
┌─────────────────────────────┐
│      CoongChat.API          │  ← Entry Point, DI Container
│  (Presentation Layer)       │
└──────────────┬──────────────┘
               │ depends on
               ▼
┌─────────────────────────────┐
│   CoongChat.Application     │  ← Use Cases, CQRS, Validation
│   (Application Layer)       │
└──────────────┬──────────────┘
               │ depends on
               ▼
┌─────────────────────────────┐
│     CoongChat.Domain        │  ← Entities, Enums, Value Objects
│     (Domain Layer)          │
└─────────────────────────────┘
               ▲
               │ implements interfaces from Application
┌─────────────────────────────┐
│  CoongChat.Infrastructure   │  ← DbContext, Repositories, External Services
│  (Infrastructure Layer)     │
└─────────────────────────────┘
```

### Quy tắc:

- ❌ **Domain KHÔNG được phụ thuộc vào bất kỳ layer nào** (pure, no external dependencies)
- ❌ **Application KHÔNG được tham chiếu Infrastructure**
- ✅ Application chỉ định nghĩa interface (`IUserRepository`), Infrastructure implement
- ✅ API layer đăng ký DI và wire everything together
- ✅ Dependency Injection qua `Program.cs` (Scoped repositories)

## 5. CQRS Rules

### Command vs Query

| Aspect       | Command                                      | Query                                   |
| ------------ | -------------------------------------------- | --------------------------------------- |
| Purpose      | Thay đổi state (Create, Update, Delete)      | Đọc dữ liệu (Read)                      |
| Naming       | `{Action}{Entity}Command`                    | `Get{Entity}Query`                      |
| Example      | `RegisterUserCommand`, `SendMessageCommand`  | `GetMyProfileQuery`, `GetUsersQuery`    |
| Return       | `BaseResponse<T>` với created/updated entity | `BaseResponse<T>` hoặc `PagedResult<T>` |
| Side Effects | ✅ Có                                        | ❌ Không                                |

### Feature Structure Pattern

```
Features/
└── {FeatureName}/
    ├── Commands/
    │   └── {Action}{Entity}/
    │       ├── {Action}{Entity}Command.cs           # MediatR IRequest
    │       ├── {Action}{Entity}CommandHandler.cs   # IRequestHandler
    │       └── {Action}{Entity}CommandValidator.cs # FluentValidation
    ├── Queries/
    │   └── {Action}/
    │       ├── {Action}Query.cs
    │       └── {Action}QueryHandler.cs
    └── DTOs/
        └── {Entity}Dto.cs
```

### Handler Rules

```csharp
// ✅ ĐÚNG: Handler inject repository interface
public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, BaseResponse<MessageDto>>
{
    private readonly IMessageRepository _messageRepository;
    private readonly IMapper _mapper;

    // Constructor injection
}

// ❌ SAI: Handler inject DbContext trực tiếp
public class BadHandler : IRequestHandler<SomeCommand, SomeResponse>
{
    private readonly AppDbContext _context; // ❌ Vi phạm Clean Architecture
}
```

## 6. Repository Rules

### Interface Definition (Application Layer)

```csharp
// Đặt trong: CoongChat.Application/Interfaces/
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByUsernameOrEmailAsync(string username);
    Task<bool> ExistsAsync(string username, string email);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(User user);
    Task<PagedResult<User>> GetPagedAsync(GetUsersFilter filter, CancellationToken ct);
}
```

### Implementation (Infrastructure Layer)

```csharp
// Đặt trong: CoongChat.Infrastructure/Repositories/
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    // ✅ Sử dụng AsNoTracking() cho queries không cần tracking
    public async Task<User?> GetByUsernameOrEmailAsync(string username)
        => await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username || u.Email == username);

    // ✅ Luôn gọi SaveChangesAsync() sau khi thay đổi
    public async Task AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
}
```

### Repository Guidelines

- ✅ Mỗi aggregate root có một repository riêng
- ✅ Repository chỉ expose domain entities, không expose DbSet
- ✅ Filtering, sorting, paging xử lý trong repository
- ✅ Sử dụng `CancellationToken` cho async operations
- ❌ Không return `IQueryable` ra ngoài repository

## 7. Database & Entity Rules

### Entity Base Class

```csharp
public abstract class BaseEntity<T>
{
    public T Id { get; set; } = default!;
}
```

### Entity Design Guidelines

```csharp
// ✅ Entity with proper navigation properties
public class Conversation : BaseEntity<Guid>
{
    public ConversationType Type { get; set; }
    public string? Name { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<ConversationMember> Members { get; set; } = new List<ConversationMember>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();

    // Optional FK
    public Guid? LastMessageId { get; set; }
    public Message? LastMessage { get; set; }
}
```

### Fluent API Configuration (AppDbContext)

```csharp
// Trong OnModelCreating:
builder.Entity<User>(e =>
{
    e.HasKey(x => x.Id);

    // Column constraints
    e.Property(x => x.Username)
        .IsRequired()
        .HasMaxLength(100);

    // Enum conversion
    e.Property(x => x.Status)
        .HasConversion<int>();

    // Indexes
    e.HasIndex(x => x.Email).IsUnique();
});

// Composite key
builder.Entity<ConversationMember>(e =>
{
    e.HasKey(x => new { x.ConversationId, x.UserId });
});

// Relationships with delete behavior
builder.Entity<RefreshToken>(e =>
{
    e.HasOne(x => x.User)
        .WithMany(x => x.RefreshTokens)
        .HasForeignKey(x => x.UserId)
        .OnDelete(DeleteBehavior.Cascade);
});
```

### Index Strategy

```csharp
// ✅ Composite index cho frequent queries
e.HasIndex(x => new { x.ConversationId, x.CreatedAt });  // Chat history
e.HasIndex(x => new { x.UserId, x.Status });              // Unread messages
e.HasIndex(x => new { x.UserId, x.IsRead });              // Notifications
```

## 8. Validation & Error Handling

### FluentValidation trong MediatR Pipeline

```csharp
// Validator class
public class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username là bắt buộc")
            .MinimumLength(3).WithMessage("Username phải có ít nhất 3 ký tự")
            .MaximumLength(100);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email là bắt buộc")
            .EmailAddress().WithMessage("Email không hợp lệ");

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(6).WithMessage("Password phải có ít nhất 6 ký tự");
    }
}
```

### ValidationBehavior (Pipeline)

```csharp
// Tự động validate trước khi handler xử lý
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);
            var results = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, ct)));

            var failures = results.SelectMany(r => r.Errors).Where(f => f != null).ToList();

            if (failures.Any())
                throw new ValidationExceptionCustom(failures);
        }

        return await next();
    }
}
```

### Custom Exceptions

```csharp
// ValidationExceptionCustom - 400 Bad Request
public class ValidationExceptionCustom : Exception
{
    public IDictionary<string, string[]> Errors { get; }
}

// UnauthorizedException - 401 Unauthorized
public class UnauthorizedException : Exception { }

// NotFoundException - 404 Not Found (cần thêm)
// ForbiddenException - 403 Forbidden (cần thêm)
```

### Global Exception Handling Middleware

```csharp
public class ExceptionHandlingMiddleware
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (UnauthorizedException ex)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { success = false, message = ex.Message });
        }
        catch (ValidationExceptionCustom ex)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new {
                success = false,
                message = "Dữ liệu không hợp lệ",
                errors = ex.Errors
            });
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { success = false, message = ex.Message });
        }
    }
}
```

## 9. API Design Rules

### Response Format

```csharp
// Standard response wrapper
public class BaseResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }

    public static BaseResponse<T> Ok(T data, string? message = null) => new() { Success = true, Data = data, Message = message };
    public static BaseResponse<T> Fail(string message) => new() { Success = false, Message = message };
}

// Paged response
public class PagedResult<T>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public IEnumerable<T> Items { get; set; } = [];
}
```

### Controller Pattern

```csharp
[Route("api/v1/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    // ✅ Inject MediatR, không inject repository trực tiếp
    public AuthController(IMediator mediator) => _mediator = mediator;

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<BaseResponse<AuthDto>>> Register([FromBody] RegisterRequest request)
    {
        var result = await _mediator.Send(new RegisterUserCommand(
            request.FullName, request.Username, request.Email, request.Password, request.PhoneNumber
        ));
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]  // Yêu cầu JWT token
    public async Task<ActionResult<BaseResponse<UserDto>>> GetMyProfile()
    {
        Guid userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new GetMyProfileQuery(userId));
        return Ok(result);
    }
}
```

### API Versioning

- Route prefix: `api/v1/[controller]`
- Ví dụ: `/api/v1/auth/login`, `/api/v1/conversations`

### HTTP Methods

| Method | Use Case                  | Example                     |
| ------ | ------------------------- | --------------------------- |
| GET    | Retrieve resource(s)      | `GET /api/v1/users`         |
| POST   | Create resource / Actions | `POST /api/v1/auth/login`   |
| PUT    | Full update               | `PUT /api/v1/users/{id}`    |
| PATCH  | Partial update            | `PATCH /api/v1/users/{id}`  |
| DELETE | Remove resource           | `DELETE /api/v1/users/{id}` |

## 10. Naming Conventions

### Files & Classes

| Type           | Convention                | Example                           |
| -------------- | ------------------------- | --------------------------------- |
| Entity         | PascalCase, singular      | `User.cs`, `Conversation.cs`      |
| DTO            | `{Entity}Dto`             | `UserDto.cs`, `MessageDto.cs`     |
| Command        | `{Action}{Entity}Command` | `RegisterUserCommand.cs`          |
| Query          | `Get{Entity}Query`        | `GetMyProfileQuery.cs`            |
| Handler        | `{Command/Query}Handler`  | `RegisterUserCommandHandler.cs`   |
| Validator      | `{Command}Validator`      | `RegisterUserCommandValidator.cs` |
| Repository (I) | `I{Entity}Repository`     | `IUserRepository.cs`              |
| Repository     | `{Entity}Repository`      | `UserRepository.cs`               |
| Controller     | `{Feature}Controller`     | `AuthController.cs`               |
| Middleware     | `{Purpose}Middleware`     | `ExceptionHandlingMiddleware.cs`  |

### Properties & Methods

```csharp
// Properties: PascalCase
public string Username { get; set; }
public DateTime CreatedAt { get; set; }

// Private fields: _camelCase
private readonly AppDbContext _context;

// Methods: PascalCase, async suffix
public async Task<User?> GetByIdAsync(Guid id);
public async Task AddAsync(User user);
```

### Database

- Tables: PascalCase, plural (EF convention) → `Users`, `Conversations`, `Messages`
- Columns: PascalCase → `Username`, `CreatedAt`, `IsActive`
- Foreign Keys: `{Entity}Id` → `UserId`, `ConversationId`

## 11. Performance Rules

### Query Optimization

```csharp
// ✅ Sử dụng AsNoTracking cho read-only queries
var users = await _context.Users.AsNoTracking().ToListAsync();

// ✅ Select chỉ những fields cần thiết
var userNames = await _context.Users
    .AsNoTracking()
    .Select(u => new { u.Id, u.Username })
    .ToListAsync();

// ✅ Include navigation properties khi cần (tránh N+1)
var conversation = await _context.Conversations
    .Include(c => c.Members)
    .Include(c => c.LastMessage)
    .FirstOrDefaultAsync(c => c.Id == id);

// ❌ Tránh: Load toàn bộ rồi filter trên memory
var users = await _context.Users.ToListAsync();
var filtered = users.Where(u => u.IsActive); // ❌ Filter trên memory
```

### Pagination

```csharp
// ✅ Luôn sử dụng pagination cho list endpoints
var items = await query
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();
```

### Indexing

- Tạo index cho các cột thường xuyên query/filter
- Composite index cho multi-column queries
- Unique index cho email, username

### Caching Strategy (Future)

- Response caching cho static data
- Distributed cache (Redis) cho frequently accessed data
- In-memory cache cho reference data

## 12. Transaction Rules

### Explicit Transaction (khi cần)

```csharp
// Sử dụng khi cần update nhiều aggregate
using var transaction = await _context.Database.BeginTransactionAsync();
try
{
    await _messageRepository.AddAsync(message, ct);
    await _conversationRepository.UpdateAsync(conversation, ct);
    await transaction.CommitAsync(ct);
}
catch
{
    await transaction.RollbackAsync(ct);
    throw;
}
```

### SaveChanges Pattern

```csharp
// ✅ Mỗi repository method tự gọi SaveChangesAsync
public async Task AddAsync(User user)
{
    _context.Users.Add(user);
    await _context.SaveChangesAsync();
}

// Hoặc dùng Unit of Work pattern (optional advanced)
```

## 13. Security Rules

### JWT Configuration

```csharp
// appsettings.json
{
    "Jwt": {
        "Key": "your-256-bit-secret-key-here",
        "Issuer": "CoongChat",
        "Audience": "CoongChat",
        "AccessTokenExpirationMinutes": 60,
        "RefreshTokenExpirationDays": 7
    }
}
```

### Authorization

```csharp
// Controller level
[Authorize]  // Yêu cầu authenticated
[Authorize(Roles = "Admin")]  // Yêu cầu Admin role
[AllowAnonymous]  // Public endpoint

// Policy-based (trong Program.cs)
options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
```

### Password Hashing

```csharp
// Sử dụng BCrypt hoặc PBKDF2 qua IPasswordHasher
public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}
```

## 14. Testing Guidelines (Recommended)

### Unit Tests

- Test Handlers riêng biệt với mocked repositories
- Test Validators với các edge cases
- Test Domain logic (nếu có)

### Integration Tests

- Test API endpoints với TestServer
- Test Repository với InMemory hoặc TestContainers
- Test full CQRS flow

### Test Naming

```
{MethodName}_Should{ExpectedBehavior}_When{Condition}

Examples:
- RegisterUserCommand_ShouldCreateUser_WhenValidData
- GetByIdAsync_ShouldReturnNull_WhenUserNotExists
```

---

## Quick Reference

### Thêm Feature mới

1. Tạo folder trong `Features/{FeatureName}/`
2. Tạo Command/Query class (implement `IRequest<T>`)
3. Tạo Handler (implement `IRequestHandler<TRequest, TResponse>`)
4. Tạo Validator (extend `AbstractValidator<T>`)
5. Tạo DTO nếu cần
6. Thêm interface Repository nếu cần (trong `Interfaces/`)
7. Implement Repository (trong `Infrastructure/Repositories/`)
8. Register DI trong `Program.cs`
9. Tạo Controller endpoint

### Thêm Entity mới

1. Tạo Entity trong `Domain/Entities/`
2. Thêm DbSet trong `AppDbContext`
3. Configure trong `OnModelCreating`
4. Tạo Migration: `dotnet ef migrations add {Name}`
5. Apply Migration: `dotnet ef database update`

using CoongChat.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CoongChat.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
       : base(options)
        {
        }
         


        #region DbSets  
        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        #endregion


    }
}

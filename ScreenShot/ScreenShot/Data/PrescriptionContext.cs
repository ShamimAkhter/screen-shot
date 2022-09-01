using Microsoft.EntityFrameworkCore;
using ScreenShot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScreenShot.Data
{
  public class PrescriptionContext : DbContext
  {
    //public PrescriptionContext(DbContextOptions<PrescriptionContext> dbContextOptions) : base(dbContextOptions) { }

    //protected PrescriptionContext()
    //{
    //}

    public DbSet<PrescriptionImage> prescriptionImages { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      //optionsBuilder.UseSqlServer(@"Server=localhost\SQLEXPRESS;Database=ScreenshotImageDB;Trusted_Connection=True");
      optionsBuilder.UseSqlServer(@"Server=localhost\SQLEXPRESS;Database=ScreenshotImageDB;Trusted_Connection=True");
    }


  }
}

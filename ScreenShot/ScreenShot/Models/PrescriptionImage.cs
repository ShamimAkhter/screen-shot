using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ScreenShot.Models
{
  public class PrescriptionImage
  {
    public int Id { get; set; }
    public string DoctorName { get; set; }
    public byte[] ImageFile { get; set; }
  }

  public class PrescriptionImageDto
  {
    public int Id { get; set; }
    public string DoctorName { get; set; }
    public IFormFile ImageFile { get; set; }
  }
}

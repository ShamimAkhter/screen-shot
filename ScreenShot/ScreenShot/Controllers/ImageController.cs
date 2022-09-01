using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ScreenShot.Data;
using ScreenShot.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ScreenShot.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ImageController : ControllerBase
  {
    [HttpGet]
    public ActionResult<List<PrescriptionImage>> GetByAll()
    {
      var prescriptionImages = new List<PrescriptionImage>();

      using (var db = new PrescriptionContext())
      {
        prescriptionImages = db.prescriptionImages.ToList();
      }

      return prescriptionImages;
    }

    [HttpPost]
    public IActionResult Create([FromForm] PrescriptionImageDto presImg)
    {
      // Converting IFormFile to byte[] 
      IFormFile file = presImg.ImageFile;

      long length = file.Length;
      if (length < 0)
        return BadRequest();

      using var fileStream = file.OpenReadStream();
      byte[] bytes = new byte[length];
      fileStream.Read(bytes, 0, (int)file.Length);

      // PrescriptionImageDto to PrescriptionImage
      var prescriptionData = new PrescriptionImage();
      prescriptionData.DoctorName = presImg.DoctorName;
      prescriptionData.ImageFile = bytes;

      // inserting PrescriptionImage into database
      using (var db = new PrescriptionContext())
      {
        db.prescriptionImages.Add(prescriptionData);
        db.SaveChanges();
      }

      return Ok();
    }

    // Utilities

    private void Base64ToFileOnDisk(string base64)
    {
      string filePath = $"F:/DummyImages/Name0002.png";
      var bytes = Convert.FromBase64String(base64);
      using (var fs = new FileStream(filePath, FileMode.Create))
      {
        fs.Write(bytes, 0, bytes.Length);
        fs.Flush();
      }
    }

    private void IFormFileToFileOnDisk(IFormFile imageFile)
    {
      string filePath = $"F:/DummyImages/Name003.png";

      using (Stream fileName = new FileStream(filePath, FileMode.Create))
      {
        imageFile.CopyTo(fileName);
      }
    }

    private void ByteArrayToFileDisk(byte[] bytes)
    {
      string filePath = $"F:/DummyImages/Name001.png";
      using (var fs = new FileStream(filePath, FileMode.Create, FileAccess.Write))
      {
        fs.Write(bytes, 0, bytes.Length);
      }
    }
  }
}

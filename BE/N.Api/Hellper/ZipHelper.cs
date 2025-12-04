using System.IO;
using System.IO.Compression;
using System.Text.Json;

namespace N.Api.Hellper
{
    public static class ZipHelper
    {
        public static byte[] CreateZipFromListFile(List<string> paths)
        {
            using var stream = new MemoryStream();
            using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, true))
            {
                foreach (var file in paths)
                {
                    var entryName = Path.GetFileName(file);
                    var entry = archive.CreateEntry(entryName);
                    using var entryStream = entry.Open();
                    using var fileStream = File.OpenRead(file);
                    fileStream.CopyTo(entryStream);
                }
            }
            var zipBytes = stream.ToArray();
            using var compressStream = new MemoryStream();
            using (var gzipStream = new GZipStream(compressStream, CompressionLevel.Optimal, true))
            {
                gzipStream.Write(zipBytes, 0, zipBytes.Length);
                //gzipStream.Dispose();
            }
            return compressStream.ToArray();

        }


        public static byte[] CreateZipDataAndFile(List<string> paths, object data)
        {
            using var stream = new MemoryStream();
            using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, true))
            {
                // Serialize object to JSON and add to zip as "data.json"
                var jsonData = JsonSerializer.Serialize(data);
                var jsonEntry = archive.CreateEntry("data.json");
                using (var entryStream = jsonEntry.Open())
                using (var streamWriter = new StreamWriter(entryStream))
                {
                    streamWriter.Write(jsonData);
                }

                // Add files to the zip archive
                foreach (var file in paths)
                {
                    if (!File.Exists(file))
                    {
                        continue;
                    }

                    try
                    {
                        var entryName = Path.GetFileName(file);
                        var entry = archive.CreateEntry(entryName);
                        using var entryStream = entry.Open();
                        using var fileStream = File.OpenRead(file);
                        fileStream.CopyTo(entryStream);
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
            }

            // Convert to byte array
            var zipBytes = stream.ToArray();

            // Compress using GZip
            using var compressStream = new MemoryStream();
            using (var gzipStream = new GZipStream(compressStream, CompressionLevel.Optimal, leaveOpen: true))
            {
                gzipStream.Write(zipBytes, 0, zipBytes.Length);
            }

            return compressStream.ToArray();
        }

    }
}

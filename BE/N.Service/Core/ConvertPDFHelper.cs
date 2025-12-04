using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using Microsoft.Office.Interop.Word;
using System.Runtime.InteropServices;

namespace N.Service.Core
{
    public class ConvertPDFHelper
    {
        public static void ConvertWordToPDF(string docxPath, string pdfPath)
        {
            Application wordApp = null;
            Document document = null;
            try
            {
                wordApp = new Application();
                document = wordApp.Documents.Open(docxPath, ReadOnly: false, Visible: false);
                document.SaveAs2(pdfPath, WdSaveFormat.wdFormatPDF);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error converting Word to PDF: " + ex.Message);
            }
            finally
            {
                // Đóng tài liệu để giải phóng file
                if (document != null)
                {
                    document.Close(WdSaveOptions.wdDoNotSaveChanges);
                    Marshal.ReleaseComObject(document);
                }

                // Thoát Word để giải phóng bộ nhớ
                if (wordApp != null)
                {
                    wordApp.Quit();
                    Marshal.ReleaseComObject(wordApp);
                }

                // Gọi Garbage Collector để dọn dẹp tài nguyên không dùng
                GC.Collect();
                GC.WaitForPendingFinalizers();
            }
        }


    }
}

using System.Globalization;
using System.Text;

namespace N.Api.Helper
{
    public class InvoiceHelper
    {

        public static async Task<string> ImportAndPublishInvAsync(
            IConfiguration _config,
            string xmlInvData)
        {
            string serviceUrl = _config["InvoiceApi:ServiceUrl"];
            string account = _config["InvoiceApi:Account"];
            string acPass = _config["InvoiceApi:AcPass"];

            string wsAcc = _config["InvoiceApi:WsUsername"];
            string wsPass = _config["InvoiceApi:WsPassword"];

            string pattern = _config["InvoiceApi:Pattern"];
            string serial = _config["InvoiceApi:Serial"];

            try
            {
                var template = Path.Combine(Directory.GetCurrentDirectory(), "Templates/TaoMoiBienLai.xml");
                var soapBody = SoapHelper.BuildSoapRequest(template, new Dictionary<string, string>
                {
                    ["ACCOUNT"] = account,
                    ["ACPASS"] = acPass,
                    ["XML_DATA"] = xmlInvData,
                    ["USER"] = wsAcc,
                    ["PASS"] = wsPass,
                    ["PATTERN"] = pattern,
                    ["SERIAL"] = serial
                });

                using var client = new HttpClient();
                var content = new StringContent(soapBody, Encoding.UTF8, "text/xml");

                var response = await client.PostAsync(serviceUrl, content);
                var xmlResponse = await response.Content.ReadAsStringAsync();

                const string start = "<ImportAndPublishInvResult>";
                const string end = "</ImportAndPublishInvResult>";

                int s = xmlResponse.IndexOf(start);
                int e = xmlResponse.IndexOf(end);

                if (s < 0 || e < 0)
                {
                    throw new Exception("Không tìm thấy kết quả");
                }
                s += start.Length;

                string result = xmlResponse.Substring(s, e - s).Trim();

                if (result.StartsWith("ERR:"))
                {
                    if (ErrorMessages.TryGetValue(result, out string message))
                    {
                        throw new Exception($"[{result}] {message}");
                    }

                    throw new Exception($"[{result}] Lỗi không xác định từ hệ thống hóa đơn");
                }

                return result;
            }
            catch (Exception ex)
            {
                return $"ERR:EX-{ex.Message}";
            }
        }


        public static async Task<string> DownloadInvoicePdfBase64(IConfiguration _config, string fkey)
        {
            string serviceUrl = _config["InvoiceApi:ServiceDownloadUrl"];
            string wsAcc = _config["InvoiceApi:WsUsername"];
            string wsPass = _config["InvoiceApi:WsPassword"];
            string soapEnvelope = $@"
                <soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance""
                               xmlns:xsd=""http://www.w3.org/2001/XMLSchema""
                               xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                    <soap:Body>
                        <downloadInvPDFFkeyNoPay xmlns=""http://tempuri.org/"">
                            <fkey>{fkey}</fkey>
                            <userName>{wsAcc}</userName>
                            <userPass>{wsPass}</userPass>
                        </downloadInvPDFFkeyNoPay>
                    </soap:Body>
                </soap:Envelope>";

            using var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, serviceUrl);

            request.Content = new StringContent(soapEnvelope, Encoding.UTF8, "text/xml");
            request.Headers.Add("SOAPAction", "http://tempuri.org/downloadInvPDFFkeyNoPay");

            var response = await client.SendAsync(request);
            var result = await response.Content.ReadAsStringAsync();

            const string start = "<downloadInvPDFFkeyNoPayResult>";
            const string end = "</downloadInvPDFFkeyNoPayResult>";

            int s = result.IndexOf(start);
            int e = result.IndexOf(end);

            if (s < 0 || e < 0)
                throw new Exception("Không tìm thấy PDF Base64 trong SOAP response");

            s += start.Length;

            return result.Substring(s, e - s).Trim(); // base64 PDF
        }

        public static class SoapHelper
        {
            public static string BuildSoapRequest(string templatePath, Dictionary<string, string> values)
            {
                var xml = File.ReadAllText(templatePath);

                foreach (var kv in values)
                {
                    xml = xml.Replace("{" + kv.Key + "}", kv.Value);
                }

                return xml;
            }
        }

        static string[] ChuSo = { "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín" };
        static readonly string[] DonVi = { "", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ" };

        public static string ChuyenSoSangChu(decimal so)
        {
            if (so == 0) return "không đồng";

            string strSo = so.ToString("0.##", CultureInfo.InvariantCulture);
            int len = strSo.Length;
            int donViIndex = 0;
            string result = "";

            while (len > 0)
            {
                int start = Math.Max(0, len - 3);
                int n = int.Parse(strSo.Substring(start, len - start));
                string str = BaChuSo(n).Trim();
                if (str != "")
                {
                    result = str + " " + DonVi[donViIndex] + " " + result;
                }
                donViIndex++;
                len -= 3;
            }

            return result.Trim() + " đồng";
        }

        static string BaChuSo(int n)
        {
            int tram = n / 100;
            int chuc = (n % 100) / 10;
            int donVi = n % 10;
            string str = "";
            bool isLeadingGroup = n < 100;
            if (tram > 0)
            {
                str += ChuSo[tram] + " trăm ";
            }
            else if (!isLeadingGroup && (chuc > 0 || donVi > 0))
            {
                str += "không trăm ";
            }

            if (chuc > 1)
            {
                str += ChuSo[chuc] + " mươi ";
            }
            else if (chuc == 1)
            {
                str += "mười ";
            }
            else if (chuc == 0 && donVi > 0 && tram > 0)
            {
                str += "linh ";
            }

            if (donVi > 0)
            {
                if (chuc >= 1 && donVi == 5)
                    str += "lăm ";
                else if (chuc > 1 && donVi == 1)
                    str += "mốt ";
                else
                    str += ChuSo[donVi] + " ";
            }

            return str;
        }

        static readonly Dictionary<string, string> ErrorMessages = new()
        {
            { "ERR:01", "Tài khoản đăng nhập sai hoặc không có quyền" },
            { "ERR:03", "Dữ liệu xml đầu vào không đúng quy định" },
            { "ERR:05", "Không phát hành được hóa đơn" },
            { "ERR:06", "Không đủ số hóa đơn cho lô phát hành" },
            { "ERR:07", "User name không phù hợp, không tìm thấy doanh nghiệp tương ứng cho người dùng" },
            { "ERR:10", "Lô có số hóa đơn vượt quá cho phép" },
            { "ERR:13", "Lỗi trùng FKey" },
            { "ERR:20", "Pattern và serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng kí có sử dụng Pattern và serial truyền vào" },
        };
    }
}

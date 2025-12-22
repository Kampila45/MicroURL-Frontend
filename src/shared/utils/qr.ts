import QRCode from "qrcode";

export async function generateQRCodeDataURL(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    type: "image/png",
    margin: 1,
    width: 256,
  });
}


const QRCode = require('qrcode');

module.exports = async (req, res) => {
  try {
    const pa = req.query.pa;
    const am = req.query.am;
    const tn = req.query.tn;

    if (!pa || !am || !tn) {
      return res.status(400).send("Missing parameters: pa, am, tn required");
    }

    // UPI URL
    const upi_url = `upi://pay?pa=${encodeURIComponent(pa)}&pn=YourName&am=${encodeURIComponent(am)}&cu=INR&tn=${encodeURIComponent(tn)}`;

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(upi_url);
    const img = Buffer.from(qrDataUrl.split(",")[1], "base64");

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
      "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    res.end(img);
  } catch (err) {
    console.error("QR generation error:", err);
    res.status(500).send("Error generating QR");
  }
};

export default function handler(req, res) {
  // Log header untuk melihat User-Agent dan IP internal Google
  console.log("Headers dari Google:", req.headers);

  // Set header yang sering dibutuhkan layanan internal Google
  res.setHeader('Metadata-Flavor', 'Google');
  
  // Lakukan redirect ke target metadata
  // Anda bisa mengganti URL ini dengan target internal lainnya
  const target = "http://169.254.169.254/computeMetadata/v1/instance/hostname";
  
  res.status(302).redirect(target);
}

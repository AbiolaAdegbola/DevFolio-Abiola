<?php
/**
 * Contact Form Handler — PHPMailer + Gmail SMTP
 *
 * UTILISATION (hébergement PHP uniquement, pas Vercel) :
 * 1. Installez PHPMailer : composer require phpmailer/phpmailer
 * 2. Configurez les constantes ci-dessous
 * 3. Sur Gmail : activez "Mot de passe d'application" dans
 *    Compte Google > Sécurité > Validation en 2 étapes > Mots de passe d'application
 */

// ── Configuration ────────────────────────────────────────────
define('SMTP_HOST',     'smtp.gmail.com');
define('SMTP_PORT',     587);
define('SMTP_USER',     'abiole68@gmail.com');   // Votre adresse Gmail
define('SMTP_PASS',     'VOTRE_MOT_DE_PASSE_APP'); // Mot de passe d'application Gmail
define('MAIL_FROM',     'abiole68@gmail.com');
define('MAIL_FROM_NAME','DevFolio — Abiola Adegbola');
define('MAIL_TO',       'abiole68@gmail.com');
// ─────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Sanitize inputs
$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$subject = trim(strip_tags($_POST['subject'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

// Validate
if (!$name || !$subject || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

// Load PHPMailer
$autoload = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoload)) {
    // Fallback to native mail() if PHPMailer not installed
    $headers  = "From: " . MAIL_FROM . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $body  = "Nouveau message depuis votre DevFolio\n";
    $body .= "==========================================\n\n";
    $body .= "Nom     : $name\n";
    $body .= "Email   : $email\n";
    $body .= "Sujet   : $subject\n\n";
    $body .= "Message :\n$message\n";

    $sent = mail(MAIL_TO, "[$subject] Message de $name", $body, $headers);
    http_response_code($sent ? 200 : 500);
    echo json_encode(['success' => $sent]);
    exit;
}

require $autoload;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    // SMTP config
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    // From / To
    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress(MAIL_TO, 'Abiola Adegbola');
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "[$subject] — Message de $name";
    $mail->Body    = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family:Inter,sans-serif;background:#f4f7fb;padding:30px'>
  <div style='max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)'>
    <div style='background:linear-gradient(135deg,#163753,#2d8dc5);padding:28px 32px'>
      <h1 style='color:#fff;margin:0;font-size:1.4rem;font-weight:800'>Nouveau message — DevFolio</h1>
    </div>
    <div style='padding:32px'>
      <table style='width:100%;border-collapse:collapse'>
        <tr><td style='padding:10px 0;color:#64748b;font-size:0.85rem;width:80px'>NOM</td>
            <td style='padding:10px 0;font-weight:600;color:#1e293b'>$name</td></tr>
        <tr style='border-top:1px solid #f1f5f9'>
            <td style='padding:10px 0;color:#64748b;font-size:0.85rem'>EMAIL</td>
            <td style='padding:10px 0;font-weight:600;color:#2d8dc5'><a href='mailto:$email' style='color:#2d8dc5'>$email</a></td></tr>
        <tr style='border-top:1px solid #f1f5f9'>
            <td style='padding:10px 0;color:#64748b;font-size:0.85rem'>SUJET</td>
            <td style='padding:10px 0;font-weight:600;color:#1e293b'>$subject</td></tr>
      </table>
      <div style='margin-top:24px;padding:20px;background:#f8faff;border-left:3px solid #2d8dc5;border-radius:0 8px 8px 0'>
        <p style='color:#64748b;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px'>MESSAGE</p>
        <p style='color:#334155;line-height:1.7;margin:0'>" . nl2br(htmlspecialchars($message)) . "</p>
      </div>
      <p style='margin-top:28px;padding-top:20px;border-top:1px solid #f1f5f9;color:#94a3b8;font-size:0.78rem;text-align:center'>
        Envoyé depuis le formulaire de contact de <strong>dev-folio-abiola.vercel.app</strong>
      </p>
    </div>
  </div>
</body>
</html>";

    $mail->AltBody = "Nouveau message depuis votre DevFolio\n\nNom: $name\nEmail: $email\nSujet: $subject\n\nMessage:\n$message";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Email envoyé avec succès']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Erreur: {$mail->ErrorInfo}"]);
}

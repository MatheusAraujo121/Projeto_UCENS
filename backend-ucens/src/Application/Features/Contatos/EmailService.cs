using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MimeKit;

namespace Application.Features.Contato
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task EnviarEmailContato(ContatoDTO dto)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(emailSettings["From"]));
            email.To.Add(MailboxAddress.Parse(emailSettings["To"])); 
            email.Subject = $"Nova Mensagem de Contato de: {dto.Nome}";

            email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = $@"
                    <h2>Nova mensagem recebida pelo formulário de contato</h2>
                    <p><strong>Nome:</strong> {dto.Nome}</p>
                    <p><strong>E-mail para retorno:</strong> {dto.Email}</p>
                    <hr>
                    <p><strong>Mensagem:</strong></p>
                    <p>{dto.Mensagem}</p>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]!), MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(emailSettings["Username"], emailSettings["Password"]);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
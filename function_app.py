import os
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from requests_toolbelt.multipart import decoder
import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

def send_email(recipient_email, subject, body, file_content=None, file_name=None):
    # Obtener las credenciales de las variables de entorno o usarlas directamente
    sender_email = os.getenv('SMTP_USER', 'davor@tabacaleraespert.com')
    sender_password = os.getenv('SMTP_PASS', 'ifzr ills cbbm ktkr')

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587

    # Crear el mensaje de correo
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = subject

    # Adjuntar el cuerpo del correo
    msg.attach(MIMEText(body, 'plain'))

    # Adjuntar el archivo PDF si se proporciona
    if file_content and file_name:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(file_content)
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename="{file_name}"')
        msg.attach(part)

    try:
        # Conectar al servidor SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Usar TLS para seguridad
        server.login(sender_email, sender_password)  # Iniciar sesión en la cuenta

        # Enviar el correo
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()  # Cerrar la conexión
        return "Correo enviado exitosamente"
    except Exception as e:
        return f"Error al enviar el correo: {e}"

@app.route(route="http_trigger")
def http_trigger1(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Entra al endpoint')

    try:
        # Obtener el cuerpo de la solicitud
        content_type = req.headers.get('Content-Type')
        if 'multipart/form-data' in content_type:
            # Decodificar el cuerpo de la solicitud
            form_data = decoder.MultipartDecoder(req.get_body(), content_type)

            recipient_email = None
            subject = None
            body = None
            file_content = None
            file_name = None

            # Procesar cada parte del formulario
            for part in form_data.parts:
                content_disposition = part.headers.get(b'Content-Disposition', b'').decode()

                if 'name="nombreApellido"' in content_disposition:
                    recipient_email = part.text
                elif 'name="cargo"' in content_disposition:
                    subject = part.text
                elif 'name="pais"' in content_disposition:
                    body = part.text
                elif 'name="constanciaCuit"' in content_disposition:
                    file_content = part.content
                    file_name = part.headers.get(b'Content-Disposition').decode().split('filename="')[1].strip('"')

            # Validar que se hayan recibido los datos necesarios
            if not recipient_email or not subject or not body:
                return func.HttpResponse("Faltan datos en la solicitud", status_code=400)

            # Enviar el correo con el archivo adjunto
            result = send_email(recipient_email, subject, body, file_content, file_name)

            return func.HttpResponse(result, status_code=200 if "exitosamente" in result else 500)
        else:
            return func.HttpResponse("Content-Type no es multipart/form-data", status_code=400)

    except Exception as e:
        logging.error(f"Error: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)


@app.route(route="sendMail", auth_level=func.AuthLevel.FUNCTION)
def sendMail(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

@app.route(route="http_trigger", auth_level=func.AuthLevel.FUNCTION)
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
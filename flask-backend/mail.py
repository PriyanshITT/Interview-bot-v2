import smtplib
from email.mime.text import MIMEText

def send_email(user_email, contact_number, user_message):
    try:
        sender_email = "ai4interview.itt@gmail.com"
        receiver_email = "ai4interview.itt@gmail.com"
        app_password = "vxhr qrib nkjm kntc"  # Use env variable in production!

        # Create email content
        email_body = f"""
        New Support Request:
        
        Email: {user_email}
        Contact Number: {contact_number}
        Message: {user_message}
        """

        msg = MIMEText(email_body)
        msg["Subject"] = "Support Request from Interview Bot Website"
        msg["From"] = sender_email
        msg["To"] = receiver_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())

        return True, "Email sent successfully!"
    
    except Exception as e:
        return False, str(e)

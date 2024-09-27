from django.conf import settings
from django.core.mail import send_mail


def send_email_to_client():
    subject = 'Testing'
    message = 'Django Testing'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = ['abdullahashfaq.ds@gmail.com']
    send_mail(subject, message, from_email, recipient_list)

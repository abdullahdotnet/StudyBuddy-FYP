# Generated by Django 5.1.1 on 2024-09-24 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='tc',
        ),
        migrations.AddField(
            model_name='user',
            name='classlevel',
            field=models.CharField(default='9th', max_length=200),
        ),
    ]
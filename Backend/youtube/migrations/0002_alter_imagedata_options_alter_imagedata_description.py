# Generated by Django 5.1 on 2024-09-20 04:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='imagedata',
            options={'verbose_name_plural': 'ImageData'},
        ),
        migrations.AlterField(
            model_name='imagedata',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
# Generated by Django 3.1.7 on 2021-05-27 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0002_uploadfile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadfile',
            name='cover',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='uploadfile',
            name='title',
            field=models.TextField(default='texte par defaut'),
        ),
    ]

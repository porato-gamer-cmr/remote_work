# Generated by Django 3.1.7 on 2021-06-23 10:41

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='approv',
            name='instant',
            field=models.DateTimeField(default=datetime.datetime(2021, 6, 23, 11, 41, 17, 464656)),
        ),
    ]
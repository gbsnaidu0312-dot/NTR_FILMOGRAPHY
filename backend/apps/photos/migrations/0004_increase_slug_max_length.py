from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photos', '0003_alter_photofolder_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photofolder',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, unique=True),
        ),
    ]

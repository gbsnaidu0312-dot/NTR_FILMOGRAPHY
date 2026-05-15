"""
Management command to discover R2 bucket contents
Lists all objects in the Cloudflare R2 bucket for verification
"""
import boto3
from botocore.config import Config as BotoConfig
from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Discover and list all objects in Cloudflare R2 bucket'

    def add_arguments(self, parser):
        parser.add_argument(
            '--prefix',
            type=str,
            default='',
            help='Filter objects by prefix (e.g., Audio/, Movies/)',
        )

    def handle(self, *args, **options):
        prefix = options['prefix']

        if not settings.USE_CLOUDFLARE_R2:
            self.stderr.write(self.style.ERROR('USE_CLOUDFLARE_R2 is not enabled in settings'))
            return

        self.stdout.write(self.style.NOTICE(f'Connecting to R2 bucket: {settings.CLOUDFLARE_R2_BUCKET}'))
        self.stdout.write(self.style.NOTICE(f'Endpoint: {settings.CLOUDFLARE_R2_ENDPOINT}'))

        # Initialize S3 client for R2 with SSL workaround for Python 3.14+
        boto_config = BotoConfig(
            max_pool_connections=10,
            retries={'max_attempts': 3},
        )
        s3 = boto3.client(
            's3',
            endpoint_url=settings.CLOUDFLARE_R2_ENDPOINT,
            aws_access_key_id=settings.CLOUDFLARE_R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            region_name='auto',
            config=boto_config,
            verify=False,
        )

        try:
            # List objects with pagination
            all_objects = []
            paginator = s3.get_paginator('list_objects_v2')

            params = {
                'Bucket': settings.CLOUDFLARE_R2_BUCKET,
                'MaxKeys': 1000,
            }
            if prefix:
                params['Prefix'] = prefix

            page_count = 0
            for page in paginator.paginate(**params):
                page_count += 1
                if 'Contents' in page:
                    all_objects.extend(page['Contents'])

            if not all_objects:
                self.stdout.write(self.style.WARNING('No objects found in the bucket'))
                return

            # Group by top-level prefix
            from collections import defaultdict
            grouped = defaultdict(list)
            for obj in all_objects:
                key = obj['Key']
                parts = key.split('/')
                top_level = parts[0] if parts else 'root'
                grouped[top_level].append(key)

            self.stdout.write(self.style.SUCCESS(f'\nFound {len(all_objects)} total objects in bucket\n'))

            # Display structure
            for top_level in sorted(grouped.keys()):
                objects = grouped[top_level]
                self.stdout.write(self.style.NOTICE(f'\n{top_level}/  ({len(objects)} objects)'))

                # Show sub-structure
                sub_structure = defaultdict(list)
                for key in objects:
                    relative = key[len(top_level):].lstrip('/')
                    sub_parts = relative.split('/')
                    if len(sub_parts) > 1:
                        sub_folder = sub_parts[0]
                        sub_structure[sub_folder].append(sub_parts[-1])
                    else:
                        sub_structure['(root)'].append(sub_parts[0])

                for folder, files in sorted(sub_structure.items()):
                    if folder == '(root)':
                        for f in sorted(files):
                            self.stdout.write(f'    {f}')
                    else:
                        self.stdout.write(f'  {folder}/  ({len(files)} files)')
                        if len(files) <= 10:
                            for f in sorted(files):
                                self.stdout.write(f'    {f}')

        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error: {str(e)}'))

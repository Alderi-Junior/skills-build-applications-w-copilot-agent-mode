from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.db import transaction

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        with transaction.atomic():
            self.stdout.write(self.style.WARNING('Deleting old data...'))
            Leaderboard.objects.all().delete()
            Activity.objects.all().delete()
            Workout.objects.all().delete()
            User.objects.all().delete()
            Team.objects.all().delete()

            self.stdout.write(self.style.SUCCESS('Creating teams...'))
            marvel = Team.objects.create(name='Marvel', description='Marvel Team')
            dc = Team.objects.create(name='DC', description='DC Team')

            self.stdout.write(self.style.SUCCESS('Creating users...'))
            tony = User.objects.create(name='Tony Stark', email='tony@marvel.com', team=marvel)
            steve = User.objects.create(name='Steve Rogers', email='steve@marvel.com', team=marvel)
            bruce = User.objects.create(name='Bruce Wayne', email='bruce@dc.com', team=dc)
            clark = User.objects.create(name='Clark Kent', email='clark@dc.com', team=dc)

            self.stdout.write(self.style.SUCCESS('Creating activities...'))
            Activity.objects.create(user=tony, type='Run', duration=30, date='2024-01-01')
            Activity.objects.create(user=steve, type='Swim', duration=45, date='2024-01-02')
            Activity.objects.create(user=bruce, type='Cycle', duration=60, date='2024-01-03')
            Activity.objects.create(user=clark, type='Fly', duration=120, date='2024-01-04')

            self.stdout.write(self.style.SUCCESS('Creating workouts...'))
            w1 = Workout.objects.create(name='Pushups', description='Upper body')
            w2 = Workout.objects.create(name='Sprints', description='Speed training')
            w1.suggested_for.set([tony, steve])
            w2.suggested_for.set([bruce, clark])

            self.stdout.write(self.style.SUCCESS('Creating leaderboard...'))
            Leaderboard.objects.create(user=tony, score=100)
            Leaderboard.objects.create(user=steve, score=90)
            Leaderboard.objects.create(user=bruce, score=110)
            Leaderboard.objects.create(user=clark, score=120)

            self.stdout.write(self.style.SUCCESS('Test data created successfully!'))

        # Garantir índice único em email
        from djongo.database import connect
        db = connect().client['octofit_db']
        db.users.create_index('email', unique=True)
        self.stdout.write(self.style.SUCCESS('Unique index on email ensured for users collection.'))

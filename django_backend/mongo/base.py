from datetime import datetime
from mongoengine import Document, DateTimeField


# yo chai base class ho, yeslai argument ma halne
# if created)at empty xaina vaney dont change create_at
# only change updated_at field
# Also, yesko collection create hudaina

class TimeStampedDocument(Document):
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {'abstract': True}

    def save(self, *args, **kwargs):
        now = datetime.utcnow()
        if not self.created_at:
            self.created_at = now
        self.updated_at = now
        return super().save(*args, **kwargs)
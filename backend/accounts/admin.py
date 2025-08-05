from django.contrib import admin
from .models import User,Animals,Category,Bid
# Register your models here.


admin.site.register(User)
admin.site.register(Animals)
admin.site.register(Category)
admin.site.register(Bid)
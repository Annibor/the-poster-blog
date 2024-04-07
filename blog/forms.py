from allauth.account.forms import SignupForm
from .models import Comment
from django import forms


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('body',)
        widgets = {
            'body': forms.Textarea(attrs={'class': 'form-control',
                                          'placeholder': 'Leave a comment'}),
        }

class RegisterForm(SignupForm):
    """
    Adapted Form for custom signup page from
    https://docs.allauth.org/en/latest/account/forms.html
    """
    first_name = forms.CharField(
        max_length=45,
        label="First Name",
        widget=forms.TextInput(attrs={"placeholder": "First Name"}),
    )
    username = forms.CharField(
        max_length=45,
        label="Username",
        widget=forms.TextInput(attrs={"placeholder": "Username"}),
    )
    
    def register(self, request, user):
        # Changes allauth form to costume form
        user = super(RegisterForm, self).save(request)
        user.first_name = self.cleaned_data["first_name"]
        user.last_name = self.cleaned_data["last_name"]
        user.username = self.cleaned_data["username"]
        user.save()
        return user
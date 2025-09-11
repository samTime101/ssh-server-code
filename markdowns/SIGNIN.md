## API RESPONSE

`API ENDPOINT:/api/signin/`

## RESPONSE FOR GET REQUEST(405)
```json
{
    "detail": "Method \"GET\" not allowed."
}
```

## REQUEST FOR POST REQUEST

```json
{
    "email": "<email>",
    "password": "<correctpassword>"
}

```

## RESPONSE FOR THE FOLLOWING POST REQUEST(200)

```json
{
    "message": "User signed in successfully",
    "user": {
        "userId": 1,
        "email": "<email>",
        "username": "samipregminp",
        "phonenumber": "<phonenumber>",
        "firstname": "samip",
        "lastname": "regmi",
        "is_active": true,
        "is_staff": true,
        "is_superuser": true
    },
    "tokens": {
        "access": "<token>",
        "refresh": "<token>"
    }
}
```

## RESPONSE FOR WRONG CREDENTIALS(401)

```json
{
    "non_field_errors": [
        "Invalid email or password"
    ]
}
```
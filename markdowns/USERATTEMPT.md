## API RESPONSE(THIS ROUTE REQUIRES AUTHENTICATION TOKEN)

`API ENDPOINT:api/user/attempt/`

`
Authorization Bearer:<access_token>
`

```json
{
  "questionId": "68b43e90849a793eafa3c01c",
  "selectedAnswers": ["A"]
}
```

## RESPONSE (201)

```json
{
	"message": "Attempt recorded"
}
```
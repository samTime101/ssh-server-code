## API RESPONSE(THIS ROUTE REQUIRES AUTHENTICATION TOKEN)

`API ENDPOINT:/api/user/attempt/history/`

`
Authorization Bearer:<access_token>
`


## GET REQUEST RESPONSE

```json
{
	"userId": "4",
	"started_at": "2025-09-19T14:55:55.663000",
	"attempts": [
		{
			"questionId": "68b43e90849a793eafa3c01c",
			"selectedAnswers": [
				"A"
			],
			"isCorrect": true,
			"attemptedAt": "2025-09-19T14:55:55.661000"
		},
		{
			"questionId": "68b43e90849a793eafa3c01c",
			"selectedAnswers": [
				"A"
			],
			"isCorrect": true,
			"attemptedAt": "2025-09-19T15:06:03.939000"
		}
	]
}   
```
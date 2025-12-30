def verified_email():
    return {"detail": "Email is verified successfully."}

def email_already_verified():
    return {"detail": "Email is already verified."}

def invalid_verification_token():
    return {"detail": "Invalid verification token."}
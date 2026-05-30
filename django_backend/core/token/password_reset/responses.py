def verified_password_reset():
    return {"detail": "Password reset link sent successfully."}
    
def invalid_password_reset_token():
    return {"detail": "Invalid reset password token."}

def reset_password_success():
    return {"detail": "Password has been reset successfully."}
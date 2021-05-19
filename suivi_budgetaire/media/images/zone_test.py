import bcrypt

passwd = 's$cret12'

salt = bcrypt.gensalt(5)
hashed = bcrypt.hashpw(passwd.encode(), salt)

if bcrypt.checkpw(passwd.encode(), hashed):
    print("Password match!")
    print(passwd)
    print(hashed)
    # Log the user in ...
else:
    print("Password didn't match")
    flash("Invalid credentials", "warning")

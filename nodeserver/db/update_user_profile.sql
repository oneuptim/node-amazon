UPDATE customers SET given_name = ($1), fullname = ($2), address = ($3), city = ($4), state = ($5), zip = ($6) WHERE id = ($7);
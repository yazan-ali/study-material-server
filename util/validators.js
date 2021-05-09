module.exports.validateRegisterInput = (
    first_name,
    last_name,
    username,
    password,
) => {
    const errors = {};
    if (first_name.trim() === "") {
        errors.first_name = "First name must not be empty";
    }
    if (last_name.trim() === "") {
        errors.last_name = "Last name must not be empty";
    }
    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    }
    if (password.trim() === "") {
        errors.password = "Password must not be empty";
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {}
    if (username.trim() === "") {
        errors.username = "Username must not be empty";
    }
    if (password.trim() === "") {
        errors.password = "Password must not be empty";
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}
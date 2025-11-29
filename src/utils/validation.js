import validator from "validator"

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("firstName and lastName are required")
    }
    else if (firstName.length < 2 || firstName.length > 50) {
        throw new Error("firstName and lastName must be between 2 to 50 characters")
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email id")
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password")
    }
}
export default validateSignupData;
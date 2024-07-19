import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'
import User from '../../models/User.mjs'// @route:   GET api/users
// @desc:    Test route
// @access:  Public
router.get('/', (req, res) => res.send('User Route'));router.post('/', [
    // Validation array: parameter, error message, validation function
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {    //Check if any validation errors
    const errors = validationResult(req) // check the request agains the validation array    // if errors, send them as a 400 error
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }    //Destructure our req
    const { name, email, password } = req.body    try {
        //check if user already exist        let user = await User.findOne({ email })        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User Already Exist' }] })
        }        // Create user if there is not errors        user = new User({
            name,
            email,
            password
        })
        // Encrypt password
        // salt : how many times is going to go through (no less than 6 nor more than 12)
        const salt = await bcrypt.genSalt(10)        user.password = await bcrypt.hash(password, salt)        await user.save()        // Creating payload (data for the front end) for jwt
        const payload = {
            user: {
                id: user.id,
                name: user.name
            }
        }        jwt.sign(
            payload,
            process.env.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;                res.json({ token })
            }
        )
    } catch (err) {
        console.error(err)
        res.status(500).json({ msg: 'Server Error' })
    }})
// imports
import express from 'express';
import User from '../../models/User.mjs';
import auth from '../../middleware/auth.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {check, validationResult} from 'express-validator';

// set up using express router
const router = express.Router();

// @route:   GET api/auth
// @desc:    Test route
// @access:  Public
// router.get('/', (req, res) => res.send('Auth Route'));

// @route:   GET api/auth
// @desc:    Auth route
// @access:  Private
router.get('/', auth, async (req, res) => {
    try {
        // get user info from database using token but without the password for security reasons
        const user = await User.findById(req.user.id).select('-password');

        // send user info
        res.json(user);
    // error handling
    } catch (error) {
        console.error(error);
        res.status(500).json({errors: [{msg: 'Server Error'}]})
    }
});


// @route:   POST api/auth

// @desc:    Login and Authenticate User

// @access:  Public

router.post(

    '/',
  
    [
  
      check('email', 'Please include a valid email').isEmail(),
  
      check('password', 'Password Required').not().isEmpty(),
  
    ],
  
    async (req, res) => {
  
      //Check if any validation errors
  
      const errors = validationResult(req);
  
      //If errors return/respond
  
      if (!errors.isEmpty()) {
  
        return res.status(400).json({ errors: errors.array() });
  
      }
  
      //destructure the req
  
      const { email, password } = req.body;
  
      try {
  
        //Find user and check if they exist
  
        let user = await User.findOne({ email });
  
        //If they DONT exist return
  
        if(!user){
  
          return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
  
        }
  
        //Check if password match
  
        const isMatch = await bcrypt.compare(password, user.password)
  
      } catch (err) {
  
        console.error(err);
  
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  
      }
  
    }
  
  )
export default router;

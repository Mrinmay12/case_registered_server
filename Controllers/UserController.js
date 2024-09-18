import User from '../Models/UserLogin.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import { SensSms } from '../Helpers/Sms.js';

  function generateId(){
    return Date.now().toString(36)+Math.random().toString(36).substring(2,5)
}
const secretKey = "MYPRODUCT"
export const Creatuser = async (req, res, next) => {
    const { email, password } = req.body;
    let username =email.split(' ')[0]
    let user_id = username + generateId() + new Date().getSeconds()
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).send({ error: 'User already exists' });
        }
       

        const token = jwt.sign({ userId: user_id }, secretKey, { expiresIn: '30m' });
     
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({
            user_id,
            email,
            password: hashedPassword,
            otp:'',
            number:'',
            username:''
        });

        await newUser.save();
       
        res.status(201).send({ message: 'User created successfully', user_id: user_id, token: token });

      

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
}

export const Login = async (req, res) => {
    const { email, password,username } = req.body;

     let match = {};
            if (email) match.email = email;
            if (username) match.username = username;
    try {
     
        const user = await User.findOne(match);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

    
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ error: 'Invalid password' });
        }

        function generateOTP() {
            const otpLength = 6;
            const digits = '0123456789';
            let otp = '';
    
            for (let i = 0; i < otpLength; i++) {
                otp += digits[Math.floor(Math.random() * 10)];
            }
    
            return otp;
        }
        const otp = generateOTP();
        const user_otp = await User.findOneAndUpdate(match, { otp: otp });
        
        if(user_otp.number && otp){
        SensSms(otp,user_otp.number)
        }
        // const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '87600h' });
     
        res.status(200).send({ message: 'Login successful', user_id: user.user_id });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
}


export const LoginNext = async (req, res) => {
    const { email, otp,username } = req.body;
    let match = {};
    if (email) match.email = email;
    if (username) match.username = username;
    if (otp) match.otp = otp;
    // Find the user by email and reset the password
    try {
        if (!otp) {
            return res.status(404).send({ error: 'please valid otp'});
        }
        const user = await User.findOne(match);

        if (!user) {
            return res.status(404).send({ error: 'Invalid OTP or email' });
        }
        const token = jwt.sign({ userId: user.user_id }, secretKey, { expiresIn: '30m' });
        // Update the password and clear the reset token
    

        res.status(200).send({ message: 'Password reset successful' ,token, user_id: user.user_id });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal server error' });
    }
}


export const verifyTokenAndUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({ message: 'Token not provided' });
        }

        jwt.verify(token, secretKey, async (err, decoded) => {
            if (err) {
                return res.status(403).send({ message: 'Invalid token', logout: true });
            }

            const userId = decoded.userId;
         

            try {
                if (userId) {
                    return res.status(200).send({ user_id: userId })
                  
                } else {
                    return res.status(403).send({ message: 'Invalid token', logout: true });
                }
            } catch (error) {
                console.error('Error finding user:', error);
                res.status(500).send({ error: 'An error occurred while finding user' });
            }
        });
    } catch (error) {
        console.error('Error verifying token and user:', error);
        res.status(500).send({ error: 'An error occurred during token and user verification' });
    }
};



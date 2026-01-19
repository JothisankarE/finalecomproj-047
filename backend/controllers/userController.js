const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const userModel = require("../models/userModel.js");
const crypto = require('crypto');
// removed sendConfirmationEmail logic per request

//create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        // Update last login timestamp
        await userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        const token = createToken(user._id)
        res.json({ success: true, token })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//register user

// const registerUser = async (req,res) => {
//     const {name, email, password} = req.body;
//     try{
//         //check if user already exists
//         const exists = await userModel.findOne({email})
//         if(exists){
//             return res.json({success:false,message: "User already exists"})
//         }

//         // validating email format & strong password
//         if(!validator.isEmail(email)){
//             return res.json({success:false,message: "Please enter a valid email"})
//         }
//         if(password.length<8){
//             return res.json({success:false,message: "Please enter a strong password"})
//         }

//         // hashing user password
//         const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
//         const hashedPassword = await bcrypt.hash(password, salt)

//         const newUser = new userModel({name, email, password: hashedPassword})
//         const user = await newUser.save()
//         const token = createToken(user._id)
//         res.json({success:true,token})

//     } catch(error){
//         console.log(error);
//         res.json({success:false,message:"Error"})
//     }
// }


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Basic presence checks to avoid passing undefined to validator
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields (name, email, password) are required" });
        }
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validating email format & strong password
        if (!validator.isEmail(String(email))) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user and activate immediately (no email confirmation)
        const newUser = new userModel({ name, email, password: hashedPassword, isActive: true });
        const user = await newUser.save();

        // create auth token so user can login immediately
        const token = createToken(user._id);
        res.json({ success: true, token, message: 'Registration successful.' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};




const getConfirmationToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Find user by confirmation token
        const user = await userModel.findOne({ confirmationToken: token });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid confirmation token." });
        }

        // Activate the user account
        user.isActive = true;
        user.confirmationToken = null; // Clear the token after confirmation
        await user.save();

        res.json({ success: true, message: "Your account has been confirmed!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error confirming account." });
    }
};

const getUserActivity = async (req, res) => {
    try {
        const users = await userModel.find({ lastLogin: { $exists: true } })
            .sort({ lastLogin: -1 })
            .limit(5)
            .select('name email lastLogin');
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching activity" });
    }
};


// logout user: set lastLogout so tokens issued earlier become invalid
const logoutUser = async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.body.userId, { lastLogout: new Date() });
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error logging out' });
    }
};

const removeUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "User Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const suspendUser = async (req, res) => {
    try {
        const { id, days } = req.body;
        const suspensionDate = new Date();
        suspensionDate.setDate(suspensionDate.getDate() + parseInt(days));

        await userModel.findByIdAndUpdate(id, { suspendedUntil: suspensionDate });
        res.json({ success: true, message: `User suspended for ${days} days` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error suspending user" });
    }
}

const forceLogoutUser = async (req, res) => {
    try {
        await userModel.findByIdAndUpdate(req.body.id, { lastLogout: new Date() });
        res.json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error forcing logout" });
    }
}


module.exports = {
    loginUser,
    registerUser,
    getConfirmationToken,
    getUserActivity,
    logoutUser,
    removeUser,
    suspendUser,
    forceLogoutUser
}
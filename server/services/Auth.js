const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async(_,args) => {
        const {fname, lname, role, mobile, email, password, confirmPassword} = args;

        if(!fname || !lname || !role || !mobile || !email || !password || !confirmPassword){
            throw Error("All fields are required...");
        }

        if(password !== confirmPassword){
            throw Error("password and confirmpassword must be same...");
        }

        let user = await User.findOne({email});

        if(user){
            throw Error("User already exists...");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({fname, lname, role, mobile, email, password: hashedPassword});


        return {
            message: "User signed up successfully",
            data: user
        }

}

const login = async(_,args,{res}) => {
    const {email, password} = args;

    if(!email || !password){
        throw Error("All fields are required...");
    }

    const user = await User.findOne({email});

    if(!user){
        throw Error("Invalid user...");
    }

    if(!(await bcrypt.compare(password, user.password))){
        throw Error("Password incorrect...");
    }

    const payload = {
        id: user._id,
        email: user.email,
        role: user.role
    }

    const token = await jwt.sign(payload, "sarag-clinic", {expiresIn: '1d'});

        // 🍪 Set JWT cookie
    // res.cookie("sarag_clinic_token", token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     maxAge: 24 * 60 * 60 * 1000,
    //     path: "/",
    // });

    res.cookie("sarag_clinic_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("TOKEN...\n", token)

    return {
    message: "Login successful2",
    token: token,
    user: {
      id: user._id.toString(),
      fname: user.fname,
      lname: user.lname,
      role: user.role,
      mobile: user.mobile,
      email: user.email,
    },
  };

}



module.exports = {
    signup, login
}
import { Request, Response, NextFunction } from "express";
import user from '../models/userModel'; 
import bcryptjs from 'bcryptjs';
import jwt , { Secret } from 'jsonwebtoken';

export class UserController {
    
    async home(req: Request, res: Response, next: NextFunction) {
        return res.json({ success: true, message: "user home page!" });
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
      console.log(req.body);
  
      const { name, email, password } = req.body;
      try {
        if (!name || !email || !password) {
          return res.status(400).json({
            success: false,
            message: "Name, email, and password are required fields.",
          });
        }
  
        if (!isValidEmail(email)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid email format." });
        }
  
        let ExistEmail = await user.findOne({ email: email });
        if (ExistEmail) {
          return res.json({
            success: false,
            message: "user already exist!",
          });
        }
  
        // if (!isValidPassword(password)) {
        //   console.log(password);
        //   return res.status(400).json({
        //     success: false,
        //     message:
        //       "Password must be at least 6 characters long and include alphabets, special characters, and numbers.",
        //   });
        // }
  
        if (!isValidUsername(name)) {
          return res.status(400).json({
            success: false,
            message:
              "Username must have at least 3 alphabets and only alphabets are allowed.",
          });
        }
  
        const HashPass = bcryptjs.hashSync(password, 10);
  
        const allDetails = new user({
          name: name,
          email: email,
          password: HashPass,
        });
        await allDetails.save();
        return res.status(200).json({ success: true, message: "user created!" });
      } catch (error) {
        next(error);
      }
    }
  
    async signIn(req: Request, res: Response, next: NextFunction) {
      const { email, password } = req.body;
      let ExistUser = await user.findOne({ email: email });
      if (ExistUser == null) {
        return res.status(301).json({ success: false, message: "no user exist!" });
      }
  
      const validPassword = bcryptjs.compareSync(password, ExistUser.password);
      if (!validPassword) {
        return res.status(400).json({ success: false, message: "password doesn't matched" });
      }
  
      let token = jwt.sign(
        { id: ExistUser._id },
        process.env.JWT_SECRET as Secret
      );
  
      console.log(token);
      
      const expiryDate: Date = new Date(Date.now() + 3600000);
    // const { password: hashPass, ...rest } = ExistUser._doc;
  
      res.cookie("access_token", token || "", {
        httpOnly:true,
        secure: true,
        sameSite:'none',
        // credentials: "include",
        domain:"productecom.dev",
        expires: expiryDate,
      });
  
      res.status(200).json({ success: true, userDetail: ExistUser });
    }
  }
  
  const isValidEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isValidPassword = (password: string): boolean => {
    console.log(password);
  
    const passwordRegex: RegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };
  
  const isValidUsername = (username: string): boolean => {
    const usernameRegex: RegExp = /^[a-zA-Z]{3,}$/;
    return usernameRegex.test(username);
  };
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
    try {
        console.log("🔍 Clerk Secret Key:", process.env.CLERK_SECRET_KEY); // Debugging check

        if (!process.env.CLERK_SECRET_KEY) {
            console.error("❌ Missing Clerk Secret Key in .env file");
            return res.status(500).json({ message: "❌ Internal Server Error: Missing Clerk Secret Key" });
        }

        const svixHeaders = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        if (!svixHeaders["svix-id"] || !svixHeaders["svix-signature"]) {
            return res.status(400).json({ message: "❌ Missing Svix headers" });
        }

        const whook = new Webhook(process.env.CLERK_SECRET_KEY);

        // Verify webhook signature
        const payload = JSON.stringify(req.body);
        await whook.verify(payload, svixHeaders);

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const existingUser = await User.findOne({ email: data.email_addresses[0].email_address });

                if (existingUser) {
                    console.log(`⚠️ User with email ${data.email_addresses[0].email_address} already exists`);
                    return res.status(409).json({ message: "⚠️ User already exists" });
                }

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: ''
                };

                await User.create(userData);
                return res.status(201).json({ message: "✅ User created successfully" });
            }

            case 'user.updated': {
                const updatedUser = await User.findByIdAndUpdate(
                    data.id,
                    {
                        email: data.email_addresses[0].email_address,
                        name: `${data.first_name} ${data.last_name}`,
                        image: data.image_url
                    },
                    { new: true, runValidators: true }
                );

                if (!updatedUser) {
                    return res.status(404).json({ message: "❌ User not found" });
                }

                return res.status(200).json({ message: "✅ User updated successfully", user: updatedUser });
            }

            case 'user.deleted': {
                const deletedUser = await User.findByIdAndDelete(data.id);

                if (!deletedUser) {
                    return res.status(404).json({ message: "❌ User not found" });
                }

                return res.status(200).json({ message: "✅ User deleted successfully" });
            }

            default:
                return res.status(400).json({ message: "❌ Unknown webhook event" });
        }

    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        return res.status(500).json({ message: "❌ Internal Server Error", error: error.message });
    }
};

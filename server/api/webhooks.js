import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_SECRET_KEY);

        // Verify webhook signature
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address, // Fixed typo
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: ''
                };

                await User.create(userData);
                return res.status(201).json({ message: "User created successfully" });
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
                    return res.status(404).json({ message: "User not found" });
                }

                return res.status(200).json({ message: "User updated successfully", user: updatedUser });
            }

            case 'user.deleted': {
                const deletedUser = await User.findByIdAndDelete(data.id);

                if (!deletedUser) {
                    return res.status(404).json({ message: "User not found" });
                }

                return res.status(200).json({ message: "User deleted successfully" });
            }

            default:
                return res.status(400).json({ message: "Unknown webhook event" });
        }

    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

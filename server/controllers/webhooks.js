import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
    try {
        console.log("Webhook received:", JSON.stringify(req.body, null, 2));

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify webhook
        const verifiedPayload = webhook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = verifiedPayload;

        switch (type) {
            case "user.created": {
                try {
                    console.log("Creating user in database:", data);

                    const userdata = {
                        _id: data.id, // Clerk user ID
                        email: data.email_addresses?.[0]?.email_address || "", // Ensure email exists
                        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(), // Handle missing names
                        image: data.image_url || "", // Default empty string if no image
                        resume: "" // Default empty string for resume
                    };

                    const newUser = await User.create(userdata);
                    console.log("User created successfully:", newUser);

                    return res.status(201).json({ success: true, user: newUser });
                } catch (error) {
                    console.error("Error creating user:", error);
                    return res.status(500).json({ success: false, error: "Internal Server Error" });
                }
            }

            case "user.updated": {
                try {
                    console.log("Updating user in database:", data);

                    const userdata = {
                        email: data.email_addresses?.[0]?.email_address || "",
                        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                        image: data.image_url || ""
                    };

                    const updatedUser = await User.findByIdAndUpdate(data.id, userdata, { new: true });
                    console.log("User updated successfully:", updatedUser);

                    return res.json({ success: true, user: updatedUser });
                } catch (error) {
                    console.error("Error updating user:", error);
                    return res.status(500).json({ success: false, error: "Internal Server Error" });
                }
            }

            case "user.deleted": {
                try {
                    console.log("Deleting user:", data.id);
                    await User.findByIdAndDelete(data.id);
                    console.log("User deleted successfully");

                    return res.json({ success: true });
                } catch (error) {
                    console.error("Error deleting user:", error);
                    return res.status(500).json({ success: false, error: "Internal Server Error" });
                }
            }

            default:
                console.log("Unhandled webhook type:", type);
                return res.status(400).json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        console.error("Webhook processing error:", error.message);
        return res.status(500).json({ success: false, message: "Webhooks error" });
    }
};

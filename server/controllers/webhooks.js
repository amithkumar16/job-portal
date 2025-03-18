import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
    try {
        console.log("🔹 Headers:", req.headers);
        console.log("🔹 Raw Body:", req.body.toString()); // Convert buffer to string for debugging

        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify webhook payload
        const verifiedPayload = webhook.verify(req.body.toString(), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        console.log("✅ Webhook verified:", verifiedPayload);
        const { data, type } = verifiedPayload;

        switch (type) {
            case "user.created": {
                console.log("🔹 Creating user in database:", data);

                const userdata = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                    resume: ""
                };

                const newUser = await User.create(userdata);
                console.log("✅ User created successfully:", newUser);
                return res.status(201).json({ success: true, user: newUser });
            }

            case "user.updated": {
                console.log("🔹 Updating user in database:", data);

                const userdata = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || ""
                };

                const updatedUser = await User.findByIdAndUpdate(data.id, userdata, { new: true });
                console.log("✅ User updated successfully:", updatedUser);
                return res.json({ success: true, user: updatedUser });
            }

            case "user.deleted": {
                console.log("🔹 Deleting user:", data.id);
                await User.findByIdAndDelete(data.id);
                console.log("✅ User deleted successfully");
                return res.json({ success: true });
            }

            default:
                console.log("Unhandled webhook type:", type);
                return res.status(400).json({ success: false, message: "Unhandled event type" });
        }
    } catch (error) {
        console.error(" Webhook processing error:", error.message);
        return res.status(500).json({ success: false, message: "Webhooks error" });
    }
};

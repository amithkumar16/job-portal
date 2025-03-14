import { Webhook } from "svix";
import User from "../models/User";

//api controller  function to manage the clerk user with database
export const clerkwebhooks = async (req,res)=>{
 try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    //verifing headers
    await webhook.verify(JSON.stringify(req.body),{
        "svix-id":req.headers["svix-id"],
        "svix-timestamp":req.headers["svix-timestamp"],
        "svix-signature":req.headers["svix-signature"]
    })
    const {data,type}  = req.body
    //switvh cases for differeent events
    switch(type){
        case 'user.created':{
            const userdata = {
                _id:data.id,
                email:data.email_addresses[0].email_address,
                name:data.first_name + " " + data.last_name,
                image:data.image_url,
                resume:''

            }
            await User.create(userdata)
            res.json({})
            break;
        }
        case 'user.updated':{
            const userdata = {
               
                email:data.email_addresses[0].email_address,
                name:data.first_name + " " + data.last_name,
                image:data.image_url,
            }
            await User.findByIdAndUpdate(data.id,userdata)
            res.json({})
            break;
        }
        case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;

        }
        default:
            break
    }

 } catch (error) {
    console.log(error.message)
    res.json({success:false,message:'webhooks error'})
 }
}
import User from '../models/userModel.js';
import Message from '../models/messageModel.js';
import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from '../lib/socket.js';

// ************* GET USERS FOR SIDEBAR CONTROLLER  *************


export const getUsersForSidebar = async(req, res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id : {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUser for side bar controller", error.message);
        res.status(500).json({message : "Internal Servor error" });

    }
}



// ************* GET MESSAGES CONTROLLER  *************



export const getMessages = async(req, res) => {
    try {
        const {id: userToChatId}  = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId : userToChatId},
                {senderId: userToChatId, receiverId: myId}, 
            ]
        });
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in get messages controller", error);
        res.status(500).json({message: "Internal Servor Error"});
    }
}



// ************* SEND MESSAGES CONTROLLER  *************



export const sendMessage = async(req, res) => {
    try {
        const {text, image} = req.body;
        const{ id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            // Upload base 64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        // todo: realtime functionality goes here => socket.io

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("new  Message", newMessage)
        }

        res.status(200).json(newMessage)
    } catch (error) {
        console.log("Error in send message controller", error);
        res.status(500).json({message: "Internal Servor Error"});
    }
}
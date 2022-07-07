const { User } = require("../models/user");

const findUserByUsername = async (username) => {
    try {
        let user = await User.findOne({username : username}).exec();
        return user;
    } catch (error) {
        console.error(error.message);
        return false;
    }
    
}

const addUser = async (username) => {
    try {
        let user = new User({username : username});
        await user.save();
        return user;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

module.exports = {
    findUserByUsername, addUser
};
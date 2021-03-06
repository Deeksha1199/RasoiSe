const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    phoneNo: {
        type: String
    },
    address: {
        type: String,
        default: "mumbai,maharashtra,india"
    },
    geometry: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
            default: [72.83308, 18.92763]
        }
    },
    secretToken: {
        type: String
    },
    active: {
        type: Boolean
    },
    otp: {
        type: String,
        default: null
    }
});


// userSchema.pre('save', function(next){
//     const user = this;
//     if(!user.isModified){
//         return next();
//     }

//     // console.log(user);
//     bcrypt.genSalt(10, (err, salt) => {
//         if(err){
//             return next(err);
//         }

//         bcrypt.hash(user.password, salt, (err, hash) => {
//             if(err) {
//                 return next(err);
//             }

//             user.password = hash;
//             next();

//         })
//     });
// });


userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            console.log(isMatch);
            console.log(user.password);
            console.log(candidatePassword);
            if (!isMatch) {
                console.log('hey');
                return reject(false);
            }

            resolve(true);
        });
    });

}


const User = mongoose.model('User', userSchema);

module.exports = { User };


module.exports.hashPassword = async function (password) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Hashing failed", error);
    }
};




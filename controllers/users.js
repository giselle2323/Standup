const { User } = require("../models/users");
const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');

const _ = require("lodash");


exports.getAllUsers = async (req, res) => {

    try {
        let users = await User.find();
        if (users) {

            res.render("allusers", { users, deleteHandler: "deleteUser();" });
        }
        else {
            req.flash("error", { message: " Sorry Cannot find users" });
        }
    } catch (error) {
        console.log(error.message);
    }


}

exports.createUserPage = async (req, res) => {
    res.render("create user");
}

exports.registerUser = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            req.flash("error", { message: "User already registered" });
            res.redirect("/users/create");
        } else {
            const errors = validationResult(req);
            // req.errors = validationResult(req).errors;
            if (!errors.isEmpty()) {
                req.flash("error", { message: JSON.stringify(errors.msg) })
                res.redirect("/users/create");
            } else {
                user = new User(
                    _.pick(req.body, [
                        "firstname",
                        "lastname",
                        "email",
                        "password",
                        "gender",
                        "department",
                        "role"
                    ])
                );
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);

                await user.save();
                req.flash("success", { message: `${user.firstname}'s account created successfully!` });
                res.redirect("/users/all");
            }

        }

    } catch (error) {
        req.flash("error", { message: "error saving user" });

        console.log(`Error saving user: ${error.message}`);
    }
}
exports.loginUserPage = (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error.message)
    }

}
exports.loginUser = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash("error", { message: "Invalid email" });
            res.redirect("/users/login");

        } else {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                req.flash("error", { message: "Invalid password." });
                res.redirect("/users/login");
            } else if (user.role == "Admin") {
                req.session.user = user;
                res.redirect("/admin/dashboard");
            } else {
                req.session.user = user;
                res.redirect("/events");
            }
        }

    }
    catch (error) {
        console.log(error.message);
    }

}
exports.getUserProfile = function (req, res) {
    try {
        console.log(req.session);
        res.render("profile", { user: req.session.user });
    } catch (error) {
        console.log(error.message);
    }

}
exports.updateUserByUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", { message: errors.array() });
        }
        const body = {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            department: req.body.department
        };

        await User.findByIdAndUpdate(req.body.id, body, function (err) {
            if (err) {
                req.flash("error", { message: "Could not update user." });
            }
            req.flash("success", { message: "User updated succesfully." });
            res.redirect("/users/profile");
        });
    } catch (error) {
        req.flash("error", { message: "Error updating user" });
        console.log(error.message);
    }

}
exports.getEditUserDetailsPage = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, function (err) {
            if (err) {
                console.log(err);
            }
            res.redirect("/");
        });
        res.render("edit", { user });
    } catch (errror) {
        console.log(error.message);
    }

}
exports.editUserDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const body = {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            address: req.body.address,
            status: req.body.status,
            department: req.body.department
        };

        await User.findByIdAndUpdate(req.body.id, body, function (err) {
            if (err) {
                req.flash("error", { message: "User cannot be updated." });
                console.log(err);
            }
            req.flash("success", { message: "User updated succesfully." });
            res.redirect(302, "/users/all");
        });
    } catch (error) {
        console.log(error.message);
    }

}
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.redirect("/users/all");
    } catch (error) {
        console.log(error.message)
    }

}
exports.logoutUser = async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy(
                res.redirect('/users/login'));
        }
    } catch (err) {
        console.log(err.message);
    }
}
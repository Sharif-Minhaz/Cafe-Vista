const Profile = require("../models/Profile.model");
const Flash = require("../utils/Flash");
const { validationResult } = require("express-validator");
const errorFormatter = require("../utils/validatorErrorFormatter");

exports.createProfileGetController = async (req, res, next) => {
	try {
		const profile = await Profile.findOne({ user: req.user._id });
		if (profile) {
			return res.redirect("/profile/show-profile");
		}
		res.render("pages/profile/create-profile", {
			title: "Coffee Shop | Create Profile",
			flashMessage: {},
			errors: {},
			values: {},
			orders: {},
		});
	} catch (err) {
		next(err);
	}
};

exports.createProfilePostController = async (req, res, next) => {
	const { name, email, title, bio, website } = req.body;

	let errors = validationResult(req).formatWith(errorFormatter);
	if (!errors.isEmpty()) {
		req.flash("fail", "Please check your fields");
		return res.render("pages/profile/create-profile", {
			title: "Coffee Shop | Create Profile",
			flashMessage: Flash.getMessage(req),
			errors: errors.mapped(),
			values: req.body,
			orders: {},
		});
	}

	const profile = new Profile({
		user: req.user._id,
		name,
		email,
		title,
		bio: bio || "",
		website: website || "",
	});
	try {
		await profile.save();
		req.flash("success", "Profile created successfully");
		return res.redirect("/profile/show-profile");
	} catch (err) {
		next(err);
	}
	res.send("Profile");
};

exports.profileGetController = async (req, res, next) => {
	try {
		const profile = await Profile.findOne({ user: req.user._id });
		if (!profile) {
			return res.redirect("/profile/create-profile");
		}
		res.render("pages/profile/show-profile", {
			title: "Coffee Shop | Profile",
			errors: {},
			flashMessage: Flash.getMessage(req),
			values: {},
			profile,
			orders: {},
		});
	} catch (err) {
		next(err);
	}
};

exports.updateProfileGetController = async (req, res, next) => {
	try {
		const profile = await Profile.findOne({ user: req.user._id });
		if (!profile) {
			return res.redirect("/profile/create-profile");
		}
		res.render("pages/profile/edit-profile", {
			title: "Coffee Shop | Edit Profile",
			errors: {},
			flashMessage: {},
			values: {},
			profile,
			orders: {},
		});
	} catch (err) {
		next(err);
	}
};

exports.updateProfilePostController = async (req, res, next) => {
	const { name, title, bio, website } = req.body;
	let errors = validationResult(req).formatWith(errorFormatter);
	if (!errors.isEmpty()) {
		req.flash("fail", "Please check your fields");
		return res.render("pages/profile/create-profile", {
			title: "Coffee Shop | Create Profile",
			flashMessage: Flash.getMessage(req),
			errors: errors.mapped(),
			values: req.body,
			orders: {},
		});
	}

	let profile = {
		name,
		title,
		bio: bio || "",
		website: website || "",
	};

	try {
		await Profile.findOneAndUpdate({ user: req.user._id }, profile);

		req.flash("success", "Profile updated successfully");
		return res.redirect("/profile/show-profile");
	} catch (err) {
		next(err);
	}
};

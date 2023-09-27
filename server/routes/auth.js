const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profileImage: profile.photos[0].value,
            };

            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (error) {
                console.log(error);
            }
        }
    )
);

// GOOGLE LOGIN
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

// RETRIEVE USER DATA
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login-failure",
        successRedirect: "/dashboard",
    })
);

// LOGIN FAILURE
router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...');
});

// LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send('Error loggin out');
        } else {
            res.redirect('/')
        }
    })
});


// PERSIST USER DATA AFTER SUCCESSFUL AUTHENTICATION
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// RETRIEVE USER DATA FROM SESSION
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = router;
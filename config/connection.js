const SpotifyStrategy = require('passport-spotify').Strategy;

















passport.use(
    new SpotifyStrategy(
        {
            clientID:  a5db0c08702e4ff4a09336b64996505f,
            clientSecret:   b45f965b45934b2d9ed8295ace736448,
            callbackURL: 'http://localhost:3001/auth/spotify/callback'


        },
        function(accessToken, refreshToken, expires_in, profile, done){
            userInfo.findOrCreate({ spotifyId: profile.id }), function(err, user) {
                return done(err, user);
            }
        }
    )
)
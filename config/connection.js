
const SpotifyStrategy = require('passport-spotify').Strategy;


















passport.use(
    new SpotifyStrategy(
        {
            clientID:  process.env.client_id,
            clientSecret:   process.env.client_secret,
            callbackURL: 'http://localhost:3001/auth/spotify/callback'


        },
        function(accessToken, refreshToken, expires_in, profile, done){
            userInfo.findOrCreate({ spotifyId: profile.id }), function(err, user) {
                return done(err, user);
            }
        }
    )
)
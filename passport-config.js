const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize(passport){
    // function to authenticate patients
    const authenticatePatients = async (email,password,done) => {
        // Get patient by email 
        const patient = getUserByEmail(email)
        if (patient == null){
            return done(null,false,{message: "No user found"})

        }
        try{
            if (await bcrypt.compare(password,this.password)){
                return done(null,patient)
            }
        }
        catch(e){
            console.log(e)
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField:'email'}))
    passport.serializeUser((user,done) => {})
    passport.deserializeUser((id,done) => {})
}
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({

    session: {
        strategy: "jwt"
    },

    providers: [
        CredentialsProvider({
            credentials: {
                contactNumber: {},
                password: {}
            },

            async authorize(credentials) {

                const response = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contactNumber: credentials.contactNumber,
                        password: credentials.password
                    })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    console.log("Reachiong here");
                    return null
                }

                const user = data.loginUser

                console.log({
                    id: user._id,
                    name: user.name,
                    contactNumber: user.contactNumber,
                    status: user.status
                });
                return {
                    id: user._id,
                    name: user.name,
                    contactNumber: user.contactNumber,
                    status: user.status
                }
            }
        })


    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.contactNumber = user.contactNumber;
                token.status = user.status
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.contactNumber = token.contactNumber;
            session.user.status = token.status
            return session;
        }
    }
});


export { handler as GET, handler as POST }
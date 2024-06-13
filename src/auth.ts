import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { connectDB } from "./libs/db"
import { User } from "./libs/schema"
import { compare } from "bcryptjs"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("credentials", credentials)
        const { email, password } = credentials
        if (!email || !password) {
          throw new CredentialsSignin("입력값이 부족합니다.")
        }
        //DB 연동
        connectDB()
        // User 스키마에서 email에 맞는 유저를 데려오는데 이때 패스워드와 롤은 누락시키지 말고 꼭 데려와라
        const user = await User.findOne({ email }).select("+password +role")
        if (!user) {
          throw new CredentialsSignin("가입되지 않은 회원입니다.")
        }

        //사용자가 입력한 비밀번호와 데이터 베이스의 비밀번호가 일치하는지 확인 (bcryptjs가 해줌 )
        //password 타입오류 String으로 지정해줘라조
        const isMatched = await compare(String(password), user.password)
        if (!isMatched) {
          throw new CredentialsSignin("비밀번호가 일치하지 않습니다.")
        }

        // 유효한 사용자면???
        return {
          name: user.name,
          email: user.email,
          // auth.js는 name,email, firstname,lastname 같은것만 갖고 있음 아래것들은 없음 그래서 확장해줘야함
          role: user.role,
          id: user._id, // 몽고db에서 생성해주는 아이디 _id MongoDB _id // ObjectId("")
        }
        // return null
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Google({
    //   clientId: process.env.AUTH_GOOGLE_ID,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET,
    // }),
  ],
  callbacks: {
    signIn: async ({ user, account }: { user: any; account: any }) => {
      console.log("signIn", user, account)
      if (account?.provider === "github") {
        // 로직을 구현할꺼니까..
        const { name, email } = user
        await connectDB() // mongodb 연결
        const existingUser = await User.findOne({
          email,
          authProviderId: "github",
        })
        if (!existingUser) {
          // 소셜 가입
          await new User({
            name,
            email,
            authProviderId: "github",
            role: "user",
          }).save()
        }
        const socialUser = await User.findOne({
          email,
          authProviderId: "github",
        })
        user.role = socialUser?.role || "user"
        user.id = socialUser?._id || null
        return true
      } else {
        // 크레덴셜 통과
        return true
      }
    },
    async jwt({ token, user }: { token: any; user: any }) {
      console.log("jwt", token, user)
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.role) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
})

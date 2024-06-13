import { githubLogin, login } from "@/libs/action"

export default function LoginForm() {
  return (
    <>
      <form action={login}>
        <input type="email" name="email" placeholder="Enter Your Email" />
        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
        />
        <button type="submit">로그인</button>
      </form>
      <form action={githubLogin}>
        <button type="submit">github 로그인</button>
      </form>
    </>
  )
}

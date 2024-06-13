// import TodoEditor from "@/components/TodoEditor"
// import TodoList from "@/components/TodoList"
// import { fetchTodosDB } from "@/libs/action"

import { getSession } from "@/libs/getSession"

// export default function page() {
//   console.log(fetchTodosDB())
//   return (
//     <>
//       <div className="w-[375px] bg-white py-10 px-6 text-[#4b4b4b]">
//         <h1 className="text-xl font-bold mb-[10px]"> Todo Into App</h1>
//         <p className="text-sm mb-5">Please enter your details to continue.</p>
//         {/* 등록 */}
//         <TodoEditor />
//         {/* 리스트 */}
//         <TodoList />
//       </div>
//     </>
//   )
// }

export default async function Home() {
  const session = await getSession()
  console.log(session)
  return (
    <>
      <h1>Home Component</h1>
      <h1>{JSON.stringify(session, null, 2)}</h1>
    </>
  )
}

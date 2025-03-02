// "use client"
 
// import { useSearchParams } from "next/navigation"
// import Image from "next/image";
// enum Error {
//   Configuration = "Configuration",
// }
 
// const errorMap = {
//   [Error.Configuration]: (
//     <p>
//       There was a problem when trying to authenticate. Please contact us if this
//       error persists. Unique error code:{" "}
//       <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
//     </p>
//   ),
// }
 
// export default function page() {
//   const search = useSearchParams()
//   const error = search.get("error") as Error
 
//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center">
//         <div className="flex justify-center">
//           <Image src="/images/ht241.png" height={100} width={100} alt="not-found" className="w-44 h-44 mb-4" />  
//         </div>
//       <div
//         className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
//       >
//         <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
//           une erreur est parvenu
//         </h5>
//         <div className="font-normal text-gray-700 dark:text-gray-400">
//           {errorMap[error] || "Please contact us if this error persists."}
//         </div>
//       </div>
//     </div>
//   )
// }
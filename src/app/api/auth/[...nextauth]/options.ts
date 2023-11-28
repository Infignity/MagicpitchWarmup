// import axios from 'axios'
// import type { NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import FormData from 'form-data'
// import { API_BASE } from '@/app/constants'


// export const options: NextAuthOptions = {
// 	providers: [
// 		CredentialsProvider({
// 			name: "Credentials",
// 			credentials: {
// 				username: {
// 					label: "Username",
// 					type: "text",
// 					placeholder: "Enter your username"
// 				},
// 				customerID: {
// 					label: "CustomerId",
// 					type: "text",
// 				},
// 				password: {
// 					label: "password",
// 					type: "password",
// 					placeholder: "Enter your password"
// 				}
// 			},
// 			async authorize(credentials) {
// 				try {
// 					const formData = new FormData()
// 					formData.append("username", credentials?.username)
// 					formData.append("password", credentials?.password)
// 					const { data } = await axios.post(`${API_BASE}/auth/token`, formData)
// 					return data
// 				} catch (err: any) {
// 					if (err.response) {
// 						if (err.response.data.message === "Authorization Error") {
// 							// console.log("Invalid Credentials")
// 						}
// 					} else {
// 						// console.log("authorize error: ", err)
// 					}
// 					return null
// 				}
// 			}
// 		})
// 	],
// 	pages: {
// 		signIn: '/login'
// 	},
// 	callbacks: {
// 		async session({ session, token }) {
// 			session.user = token.user as any;
// 			return session;
// 		},
// 		async jwt({ token, user }) {
// 			if (user) {
// 				token.user = user
// 			}
// 			return token
// 		},
// 	},
// 	secret: process.env.NEXTAUTH_SECRET
// }

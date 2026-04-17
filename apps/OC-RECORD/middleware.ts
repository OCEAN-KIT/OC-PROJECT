// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("ACCESS_TOKEN")?.value;
//   const { pathname } = request.nextUrl;

//   // 로그인 된 상태로 로그인/회원가입 페이지 접근 시도시 "/home"으로 리다이렉트
//   if (
//     token &&
//     (pathname.startsWith("/login") || pathname.startsWith("/register"))
//   ) {
//     return NextResponse.redirect(new URL("/home", request.url));
//   }

//   // 로그인 되지 않은 상태로 "/login" 이나 "/register"외의 페이지 접근 시도 시 거부 후 "/login"으로 리다이렉트
//   if (
//     !token &&
//     !pathname.startsWith("/login") &&
//     !pathname.startsWith("/register")
//   ) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };

// 추후 커스텀 도메인 붙여야 정상 작동함. 현재는 클라이언트 페이지 가드로 구현되어 있음.

# Food Store Managagement App

## 1. Technologies:

- Fontend: `nextjs`, `shadcn/ui`, `zod`
- Backend: `fastify`

## 2. Set up project

- Framework: `nextjs`
- Libraries: `shadcn/ui`, `zod`

## 3. Set up Postman collection to test API

- create collection & environment variables on postman
- add requests (according to info from api)

## 4. Create http client to call api

- add `normalizePath` function to `utils.ts` in `lib`
- create file `http.ts` in `src/lib` folder
- create `src/schemaValidations` folder in root folder (copy from server)
- create `type.ts` in `src/constants` folder

## 5. Create Login Route Handler (Nextjs Server)

- install `jswebtoken` package
- define `authApiRequest` in `src/apiRequests/auth` including `sLogin` which is call from Nextjs Server to Server Backend), and `login` which is call from Client Component to Nextjs Server (Server Component)

## 6. Code UI Login/Toggle Mode

- add `dark-mode-toggle` and `them-provider` components
- create `/src/(public)` folder
- create `layout` for `/src/(public)` UI
- create `auth` UI, and `nav-items` in `/src/(public)`
- install `toast` package

## 7. Login Logic

- flow: goes first to root layout, then go through layout of `public` folder with `NavItems` -> go to `page` of `/src/(public)` -> go to `(auth)/login/login-form`.
- in `login-form`, use `react-query`
- install `React Query`

```bash
npm i @tanstack/react-query
npm i -D @tanstack/eslint-plugin-query
```

- Note: error of failed Hydration because use of check browser -> server rendering will be different from client rendering => one of solutions is use `useEffect`

```ts
// Check if the code is running in the browser
// => this can cause error of Hydration failed because the server rendered HTML didn't match the client
const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};
```

## 8. Use middleware to redirect user

- use `middleware.ts` in root project, in this app is inside `/src` folder. If put in worng place, this middleware will not function correctly

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  //console.log(pathname);

  const isAuth = Boolean(request.cookies.get("accessToken")?.value);

  // if user is not logined, cann not get access to private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if user is Logined, can not get access to login page
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/manage/:path*", "/login"],
};
```

## Get Profile

- use Tanstack Query => define hook `useAccount` in `queries` folder , where contains hooks related to account
- 

## Reference:

[Project-schema-DBML](https://dbdiagram.io/d/679ff485263d6cf9a0c8616d)
[Emojipedia](https://emojipedia.org/activity)
[Json-web-token](https://jwt.io/)
[Switch-node-version-through-nvm](https://www.getfishtank.com/insights/use-nvm-to-install-multiple-node-versions)
[Caphe-chem-gio-ve-cookie-&-session](https://www.youtube.com/f8)
[Nguyen-ly-hoat-dong-cua-jwt](https://www.youtube/f8)
[CORS-policy-la-gi](https://www.youtube/f8)
[Tanstack-query](kenh youtube Easy Fontend)

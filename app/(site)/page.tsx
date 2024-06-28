import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "./components/PageContent";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { Separator } from "@/components/ui/separator";

export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  var userName: string = " Back, ";
  const token = getCookie("token", { cookies });
  if (token) {
    const decodedToken = jwtDecode(token);
    userName += decodedToken.username;
  } else {
    userName = "";
  }

  return (
    <div className="dark:bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto bg-opacity-80">
      <Header>
        <div className="mb-2">
          <h1 className="scroll-m-20 text-4xl font-black tracking-tight lg:text-5xl">
            Welcome{userName}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image="/liked.jpeg"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <Separator />
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items center">
          <h1 className="text-2xl font-semibolc">Newest Songs</h1>
        </div>
        <PageContent songs={songs} />
      </div>
    </div>
  );
}

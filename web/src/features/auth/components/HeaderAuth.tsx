import { signOut } from "firebase/auth";

import { auth } from "@/shared/firebase";
import { Button } from "@/shared/components/ui/button";

import { useUserContext } from "@/entities/user/UserContext";

import { signIn } from "../auth";

function HeaderAuth({ className }: { className?: string }) {
  const ctx = useUserContext();
  const userProfile = ctx.profile;
  const isLoggedIn = ctx?.user?.uid ? true : false;

  return (
    <div className={className}>
      {ctx?.loading ? (
        "loading.."
      ) : isLoggedIn ? (
        userProfile ? (
          <LoggedIn />
        ) : (
          "loading..."
        )
      ) : (
        <NotLoggedIn />
      )}
    </div>
  );
}

export default HeaderAuth;

function NotLoggedIn() {
  const handleSignIn = async () => await signIn();
  return (
    <div>
      <Button className="" onClick={handleSignIn}>
        התחבר
      </Button>
    </div>
  );
}

function LoggedIn() {
  return (
    <div className="">
      <Button className="" onClick={() => signOut(auth)} variant={"outline"}>
        התנתק
      </Button>
      <div className=""></div>
    </div>
  );
}

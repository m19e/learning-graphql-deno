import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthMutation, UserInfoFragment } from "../gql";
import Svg from "./Svg";

type UserInfo = UserInfoFragment | null | undefined;
interface AuthorizedUserProps {
  me: UserInfo;
}
export const AuthorizedUser = ({ me }: AuthorizedUserProps) => {
  const navigate = useNavigate();
  const [githubCode, setGitHubCode] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);

  const [, authMutate] = useAuthMutation();

  const login = async (code: string) => {
    const { data } = await authMutate({ code });
    if (data) {
      localStorage.setItem("token", data.githubAuth.token);
    }
    navigate("/");
    setIsSignIn(false);
  };

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setIsSignIn(true);
      const code = window.location.search.replace("?code=", "");
      login(code);
    }
  }, [githubCode]);

  const requestCode = () => {
    const clientID = import.meta.env.VITE_CLIENT_ID;
    window.location.href =
      `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return <Me me={me} logout={logout} requestCode={requestCode} isSignIn={isSignIn} />;
};

interface MeProps {
  me: UserInfo;
  logout: () => void;
  requestCode: () => void;
  isSignIn: boolean;
}

const Me = ({ me, logout, requestCode, isSignIn }: MeProps) => {
  if (me !== null) {
    return <CurrentUser {...me} logout={logout} />;
  }

  return (
    <button
      onClick={requestCode}
      disabled={isSignIn}
      className="flex gap-2 items-center bg-gray-800 p-2 text-white"
    >
      <div className="w-6 h-6">
        <Svg.Github />
      </div>
      <span>
        Sign In with GitHub
      </span>
    </button>
  );
};

interface CurrentUserProps {
  name?: string | null;
  avatar?: string | null;
  logout: () => void;
}

const CurrentUser = ({ name, avatar, logout }: CurrentUserProps) => {
  return (
    <div>
      <h1>{name}</h1>
      <img
        src={avatar || "https://placehold.jp/48x48.png"}
        width={48}
        height={48}
        alt="me avatar"
      />
      <button onClick={logout}>logout</button>
    </div>
  );
};

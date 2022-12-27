import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthMutation, UserInfoFragment } from "../gql";
import Svg from "./Svg";

type UserInfo = UserInfoFragment | null | undefined;
interface AuthorizedUserProps {
  me: UserInfo;
  refetchUsers: (token?: string | null) => void;
  fetchingUsers: boolean;
}
export const AuthorizedUser = ({ me, refetchUsers, fetchingUsers }: AuthorizedUserProps) => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(false);

  const [, authMutate] = useAuthMutation();

  const login = async (code: string) => {
    const { data } = await authMutate({ code });
    if (data) {
      const { token } = data.githubAuth;
      localStorage.setItem("token", token);
      refetchUsers(token);
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
  }, []);

  const requestCode = () => {
    const clientID = import.meta.env.VITE_CLIENT_ID;
    window.location.href =
      `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    refetchUsers();
  };

  return (
    <Me
      me={me}
      logout={logout}
      requestCode={requestCode}
      isSignIn={isSignIn}
      fetching={fetchingUsers}
    />
  );
};

interface MeProps {
  me: UserInfo;
  logout: () => void;
  requestCode: () => void;
  isSignIn: boolean;
  fetching: boolean;
}

const Me = ({ me, logout, requestCode, isSignIn, fetching }: MeProps) => {
  if (me === null || fetching) {
    return (
      <button
        onClick={requestCode}
        disabled={isSignIn}
        className="flex gap-2 items-center bg-gray-800 p-2 text-white rounded"
      >
        <div className="w-6 h-6">
          <Svg.Github />
        </div>
        <span className="text-sm">
          Sign In with GitHub
        </span>
      </button>
    );
  }

  return <CurrentUser {...me} logout={logout} />;
};

interface CurrentUserProps {
  name?: string | null;
  avatar?: string | null;
  logout: () => void;
}

const CurrentUser = ({ avatar, logout }: CurrentUserProps) => {
  return (
    <div className="flex items-center gap-1">
      <img
        src={avatar || "https://placehold.jp/40x40.png"}
        width={40}
        height={40}
        alt="me { avatar }"
      />
      <button onClick={logout} className="bg-gray-700 p-2 text-gray-200 rounded">
        <span className="text-sm">Logout</span>
      </button>
    </div>
  );
};

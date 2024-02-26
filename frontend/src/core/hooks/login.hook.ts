import { useEffect, useState } from "react";
import { local } from "../helpers/localStorage";

export const useLogin = (): [boolean, string | null | void] => {
  const [token, setToken] = useState<string | null | void>(null);

  useEffect(() => {
    const localToken: string | null | void = local("token");

    setToken(localToken);
  }, []);

  return [token !== null && token !== undefined && token !== "", token];
};

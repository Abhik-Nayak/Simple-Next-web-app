import Cookies from "js-cookie";

export function setAuthToken(token: string) {
  Cookies.set("token", token, { expires: 1 });
}

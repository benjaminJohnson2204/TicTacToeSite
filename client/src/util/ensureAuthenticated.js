import fetchEndpoint from "./fetchEndpoint";

export default async function ensureAuthenticated(navigate) {
  let data = await fetchEndpoint("/api/authenticated");
  if (!data.authenticated) {
    navigate("/login");
  }
}

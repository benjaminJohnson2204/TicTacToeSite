export default function fetchEndpoint(endpointName) {
  return fetch(endpointName, {
    credentials: "include",
  }).then((res) => res.json());
}

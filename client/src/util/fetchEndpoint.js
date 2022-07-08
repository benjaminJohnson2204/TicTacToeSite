export default function fetchEndpoint(endpointName, after) {
    return fetch(endpointName, {
        credentials : "include"
    })
    .then(res => res.json());
}
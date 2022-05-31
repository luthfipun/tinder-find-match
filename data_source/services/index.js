import axios from "axios";
import { CORE, LIKED, LIKES, LOGIN, PASS } from "../path_url";

const defaultHeaders = (token) => {
    return {
        headers: {
            platform: "ios",
            "user-agent": " Tinder/13.8.0 (iPhone; iOS 15.3.1; Scale/2.00)",
            "x-auth-token": token,
        },
    };
};

const getData = (url, token) => {
    return axios.get(url, defaultHeaders(token));
};

const postData = (url, token) => {
    return axios.post(url, null, defaultHeaders(token));
};

export const serviceLogin = (token) => {
    return getData(LOGIN, token);
};

export const serviceLikesYou = (token) => {
    return getData(LIKED, token);
};

export const serviceFindMatch = (token) => {
    return getData(CORE, token);
};

export const serviceLikeMatch = (token, id) => {
    return postData(LIKES + id, token);
};

export const servicePassMatch = (token, id, s_number, content_hash) => {
    return getData(
        PASS + `${id}?s_number=${s_number}&content_hash=${content_hash}`,
        token
    );
};

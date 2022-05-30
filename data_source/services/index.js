import axios from "axios";
import { LIKED, LOGIN } from "../path_url";

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

import { serviceLikesYou } from "../../data_source/services/index.js";
import { Liked } from "../../domain/data/likes_you/index.js";
import { logLoading } from "../../domain/util/logs/index.js";

const loading = logLoading("Try find who likes you..");

export class LikesYou {
    constructor(token) {
        this.token = token;
    }

    findLikesYou() {
        loading.start();
        return serviceLikesYou(this.token)
            .then((res) => {
                let data = res.data;
                let results = data.data;

                if (results.length === 0) {
                    loading.warn({
                        text: "Successfully but no one likes you 😭",
                    });
                    return false;
                }

                let likedData = new Liked(res.data);
                likedData.save();

                loading.success({
                    text: "Successfully finding who likes you 😍",
                });
                return true;
            })
            .catch((err) => {
                if (err.response) {
                    loading.error({
                        text:
                            err.response.status === 401
                                ? "Token is invalid"
                                : "☠️ Internal Server Error!",
                    });
                }
                return false;
            });
    }
}

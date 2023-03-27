import { serviceFindMatch } from "../../data_source/services/index.js";
import { logLoading } from "../../domain/util/logs/index.js";

const loading = logLoading("Try find people on tinder...");

export class FindMatch {
    constructor(token) {
        this.token = token;
    }

    findMatchPeople() {
        loading.start();
        return serviceFindMatch(this.token)
            .then((res) => {
                loading.success({
                    text: "Successfully to find people..",
                });
                return res.data;
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
                return null;
            });
    }
}

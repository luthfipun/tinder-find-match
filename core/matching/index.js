import {
    serviceLikeMatch,
    servicePassMatch,
} from "../../data_source/services/index.js";
import { logLoading } from "../../domain/util/logs/index.js";

export class Matching {
    constructor(token, data) {
        this.token = token;
        this.data = data;
    }

    like() {
        let loading = logLoading(`Try match with ${this.data.name}...`);
        loading.start();
        return serviceLikeMatch(this.token, this.data.id)
            .then((res) => {
                loading.success(`Successfully match with ${this.data.name} 😍`);
                return true;
            })
            .catch((err) => {
                console.log(err);
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

    pass() {
        let loading = logLoading(`Try pass with ${this.data.name}...`);
        loading.start();
        return servicePassMatch(
            this.token,
            this.data.id,
            this.data.s_number,
            this.data.content_hash
        )
            .then((res) => {
                loading.success(`Successfully pass with ${this.data.name} 😓`);
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

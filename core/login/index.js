import { serviceLogin } from "../../data_source/services/index.js";
import { User } from "../../domain/data/user/index.js";
import { logLoading } from "../../domain/util/logs/index.js";

const loading = logLoading("Try login to your account...");

export class Login {
    constructor(token) {
        this.token = token;
    }

    loginUser() {
        loading.start();
        return serviceLogin(this.token)
            .then((res) => {
                let user = new User(res.data);
                user.save();

                loading.success({
                    text: "🥳 Successfully login to your account!",
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

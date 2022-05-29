import { serviceLogin } from "../../data_source/services";
import { User } from "../../domain/data/user";
import { logLoading } from "../../domain/util/logs";

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
}

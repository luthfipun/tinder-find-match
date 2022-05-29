import { LocalStorage } from "node-localstorage";
import readlineSync from "readline-sync";
import { LOGIN_SESSION } from "../../domain/util/constant";
import { Login } from "../login";
var localstorage = new LocalStorage("./tmp");

const isCurrentSession = localstorage.getItem(LOGIN_SESSION) !== null;

export class Authorize {
    async checkAuth() {
        let token;

        if (isCurrentSession) {
            token = localstorage.getItem(LOGIN_SESSION);
            let isLoggedInSession = await this.checkSession(token);

            if (!isLoggedInSession) {
                await this.checkAuth();
            } else {
                return true;
            }
        } else {
            token = readlineSync.question("Input your account token : ");
            let isLogin = await this.checkLogin(token);

            if (isLogin) {
                localstorage.setItem(LOGIN_SESSION, token);
                return true;
            } else {
                return false;
            }
        }
    }

    async checkSession(token) {
        let isLogin = await this.checkLogin(token);
        if (isLogin) {
            return true;
        } else {
            // remove expired token
            localstorage.removeItem(LOGIN_SESSION);
            return false;
        }
    }

    async checkLogin(token) {
        let login = new Login(token);
        return await login.loginUser();
    }
}

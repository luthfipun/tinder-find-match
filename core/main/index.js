import readLineSync from "readline-sync";
import { User } from "../../domain/data/user";
import { logSuccess } from "../../domain/util/logs";
import { Authorize } from "../authorize";
import {
    menu_find_match,
    menu_likes_you,
    menu_logout,
    menu_profile,
} from "../menu";

export class Main {
    async #checkAuth() {
        let auth = new Authorize();
        return auth.checkAuth();
    }

    async route() {
        let user = new User().get();

        if (user === null) {
            await this.mainMenu();
        }

        let msg = `\n
                ❤️❤️❤️ Tinder Find Match ❤️❤️❤️
                Hi ${user.name}, welcome to the Tinder Find Match App
                You can choose menu below to find and match who likes you... 
            `;

        logSuccess(msg);

        let menus = [
            "Your Profile",
            "Who likes you?",
            "Find & Match who likes you",
            "Logout",
        ];

        let index = readLineSync.keyInSelect(menus, "Choose menu:");

        switch (index) {
            case 0:
                await menu_profile();
                break;
            case 1:
                await menu_likes_you();
                break;
            case 2:
                await menu_find_match();
                break;
            case 3:
                await menu_logout();
                break;
            default:
                break;
        }
    }

    async mainMenu() {
        let isLogin = await this.#checkAuth();

        if (!isLogin) {
            process.exit(0);
        }

        await this.route();
    }
}

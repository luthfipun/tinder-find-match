import { LocalStorage } from "node-localstorage";
import { User } from "../../domain/data/user";
import { logInfo, logWarning } from "../../domain/util/logs";
import { Main } from "../main";
var localstorage = new LocalStorage("./tmp");
import readlineSync from "readline-sync";
import moment from "moment";

const backToMenu = async () => {
    let msgBackMenu = "Back to the menu?";
    if (readlineSync.keyInYN(msgBackMenu)) {
        await new Main().route();
    } else {
        process.exit(0);
    }
};

export const menu_profile = async () => {
    let user = new User().get();

    if (user === null) {
        logWarning("User not found please try re-login");
        process.exit(0);
    }

    let msg = `\n
            Your Profile
            ==========================
            id : ${user.id}
            name : ${user.name}
            email : ${user.email}
            phone : ${user.phone}
            gender : ${user.gender}
            date of birth : ${moment(user.dob).format("LL")}
            likes remaining : ${user.likes_remaining}
            joined : ${moment(user.created_at).format("llll")}
            last login : ${moment(user.ping).format("llll")}
            location : https://www.google.com/search?q=${user.lat},${user.lon}
        `;
    logInfo(msg);
    backToMenu();
};

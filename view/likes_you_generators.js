import { LocalStorage } from "node-localstorage";
import { LIKED_DATA } from "../domain/util/constant";
import { logError, logSuccess } from "../domain/util/logs";
var localstorage = new LocalStorage("./tmp");
import fs from "fs";

export const likesYouGenerators = async () => {
    let likedData = localstorage.getItem(LIKED_DATA);

    if (likedData === null) {
        logError("Can't find who likes you data");
        return false;
    }

    let viewData = JSON.parse(likedData);

    return await fs.writeFileSync(
        "./view/liked.html",
        generateViewData(viewData),
        (err) => {
            if (err) {
                logError("Error generate who likes you data");
                return false;
            }
            logSuccess("Successfully generated who likes you data");
            return true;
        }
    );
};

const generateViewData = (data) => {
    let listData = data.map((e) => {
        return `
            <div class="group relative">
                <div class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img src="${e.processing_photo}" alt="Front of men&#039;s Basic Tee in black." class="w-full h-full object-center object-cover lg:w-full lg:h-full">
                </div>
            </div>
        `;
    });

    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Who Likes You</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <div class="py-12 bg-white">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="lg:text-center">
                        <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Who Likes You</p>
                    </div>
                    </div>
                    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                        <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        ${listData}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
};

import fs from "fs";
import moment from "moment";
import { logError, logSuccess } from "../domain/util/logs";

export const matchesGenerator = async (data) => {
    await fs.writeFileSync(
        "./view/matched.html",
        generateViewData(data),
        (err) => {
            if (err) {
                logError("Failed generate matches data");
            }
            logSuccess("Successfully generate matches data");
        }
    );
};

const generateViewData = (data) => {
    const listData = data.map((e) => {
        return `
        <div class="group relative">
            <div class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
            <img src="${e.url}" alt="${
            e.name
        }" class="w-full h-full object-center object-cover lg:w-full lg:h-full">
            </div>
            <div class="mt-4 flex justify-between">
                <div>
                <h3 class="text-lg text-gray-700">
                    <a href="#">
                    <span aria-hidden="true" class="absolute inset-0"></span>
                    <div class="w-3 h-3 bg-${
                        e.online_now ? "blue" : "gray"
                    }-500 rounded-full"></div> ${e.name}
                    </a>
                </h3>
                <p class="mt-1 text-sm text-gray-500">Birth Day : ${moment(
                    e.birth_date
                ).format("LL")}</p>
                </div>
                <p class="text-sm font-medium text-gray-900">${
                    e.distance
                } km</p>
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
    <title>Matches Who Likes You</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
                <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Matches Who Likes You</p>
            </div>
        </div>
        <div class="max-w-full mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-full lg:px-8">
            <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            
                ${listData.join("\r\n")}

            </div>
        </div>
    </div>
</body>
</html>

    `;
};

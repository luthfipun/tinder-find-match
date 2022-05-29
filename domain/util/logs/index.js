import logSymbols from "log-symbols";
import chalk from "chalk";
import { createSpinner } from "nanospinner";

export const logInfo = (msg) => {
    console.log(logSymbols.info, chalk.blue(msg));
};

export const logWarning = (msg) => {
    console.log(logSymbols.warning, chalk.yellow(msg));
};

export const logSuccess = (msg) => {
    console.log(logSymbols.success, chalk.green(msg));
};

export const logError = (msg) => {
    console.log(logSymbols.error, chalk.red(msg));
};

export const logLoading = (msg) => {
    return createSpinner(msg);
};

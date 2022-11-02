import fs from "fs";
import * as csv from "fast-csv";

export const createCsvStream = (directory, fileName) => {
    const csvStream = csv
        .format({
            headers: false,
            delimiter: " ",
            rowDelimiter: " \n",
        })
        .on("error", (error) => {
            throw error
        });

    const outputStream = fs.createWriteStream(`${directory}/${fileName}`);

    csvStream.pipe(outputStream);
    return csvStream;
}

import { connection } from "./config/connection.js";
import fs from "fs";
import { createCsvStream } from "./utils.js";
import { DateTime } from "luxon";
import {tenantsShort} from "./config/common.js";
import SubscriptionRepository from "./repositories/subscription-repository.js";
import BpAddressRepository from "./repositories/bp-address-repository.js";
import DeliveryDetailsRepository from "./repositories/delivery-details-repository.js";

connection.connect();
const subsRepository = new SubscriptionRepository(connection);
const bpAddressRepository = new BpAddressRepository(connection);
const deliveryDetailsRepository = new DeliveryDetailsRepository(connection);

for (const tenant of tenantsShort) {
    const file = `${tenant.padEnd(3, 'x')}_POS_${DateTime.now().toFormat("yyyyMMdd")}.csv`;
    const exportDirectory = process.cwd() + '/tenants/';

    fs.writeFileSync(exportDirectory + file, '');
    const stream = createCsvStream(exportDirectory, file);


    const subscriptions = await subsRepository.getByTimeAndTenant('19/10/2022', tenant);
    console.log(subscriptions.length);
    for (const subscription of subscriptions) {
        const data = [];

        const [bpAddress] = await bpAddressRepository.getFieldsBySubscription(['TITEL', 'NAME1', 'NAME2', 'NAME3', 'ORT01', 'GPNR', 'LAND1', 'PSTLZ', 'ADDRESS_ID'], subscription);
        if(!bpAddress) continue;

        const [deliveryDetails] = await deliveryDetailsRepository.getFieldsBySubscription(['QUANTITY'], subscription);
        if(!deliveryDetails) continue;

        const { TITEL: title,
                GPNR: reference,
                LAND1: countryCode,
                PSTLZ: zip,
                ORT01: city
        } = bpAddress;

        const name = [ bpAddress.NAME1, bpAddress.NAME2, bpAddress.NAME3 ].filter(name => name).join(' ');
        const { QUANTITY: quantity } = deliveryDetails;

        data.push(
            subscription.BRAND,
            ''.padEnd(3, '0'),
            reference,
            quantity.padStart(7, '0'),
            title ?? '',
            name,
            countryCode,
            zip,
            city
        );

        stream.write(data);
    }

    stream.end();
}

connection.end();



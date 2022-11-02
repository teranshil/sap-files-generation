export default class SubscriptionRepository {

    connection = null;

    constructor(connection) {
        this.connection = connection;
    }

    async getByTimeAndTenant(time, tenant) {
        const [rows, field] = await this.connection.promise().query(
            'select item.* ' +
            'from item join header on item.SUBSCRIPTION_ID = header.SUBSCRIPTION_ID ' +
            `where header.START_DATE <= '${time}' and '${time}' >= header.END_DATE and item.BRAND = '${tenant}'`,
        );

        return rows;
    }
}

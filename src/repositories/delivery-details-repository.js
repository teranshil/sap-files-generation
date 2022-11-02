export default class DeliveryDetailsRepository {
    connection = null;

    constructor(connection) {
        this.connection = connection;
    }

    async getFieldsBySubscription(fields = ['*'], subscription) {
        const fieldsToSelect = fields.map(field => `delivery_details.${field}`).join(',');

        const [rows, field] = await this.connection.promise().query(
            `select ${fieldsToSelect} ` +
            `from delivery_details where delivery_details.SUBSCRIPTION_ID = ${subscription.SUBSCRIPTION_ID};`
        );

        return rows;
    }
}

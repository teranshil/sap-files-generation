export default class BpAddressRepository {
    connection = null;

    constructor(connection) {
        this.connection = connection;
    }

    async getFieldsBySubscription(fields = ['*'], subscription) {
        const fieldsToSelect = fields.map(field => `bp_address.${field}`).join(',');

        const [rows, field] = await this.connection.promise().query(
            `select ${fieldsToSelect} ` +
            'from billing JOIN bp_address on bp_address.ADDRESS_ID = billing.BILL_TO_PARTY_ADDRESS_ID ' +
            `where billing.SUBSCRIPTION_ID = ${subscription.SUBSCRIPTION_ID};`
        );

        return rows;
    }
}

/**
 * Created by Le Reveur on 2017-05-04.
 */
module.exports = {
    db: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '1234',
        database: 'wiki',
        dateStrings: 'date',
        connectionLimit: 5,
        connectTimeout: 5000
    },
    session: {
        secret: '123142132'
    },
    bookshelf: {
        aladinApiKey: '1234',
        daumApiKey: '1234'
    }
};

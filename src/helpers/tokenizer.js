// helper function to refresh token
var jwt    = require('jsonwebtoken'); // Used to create, sign and verify tokens
var path = require('path'); // Handling and transforming file paths

var env       = process.env.NODE_ENV || 'development'; // Environment
var config    = require(path.join(__dirname, '', '../config', 'pfstracker.json'))[env];

exports.refreshToken = function(tokenDecoded, res) {

    if (tokenDecoded.iat !== undefined) {
        var iat = tokenDecoded.iat; // issued token timestamp
        var currentTimestamp = Math.floor(Date.now() / 1000);

        if ((currentTimestamp - iat) > config.jwtRefresh) {
            var account = {
                'username' : tokenDecoded.username,
                'email' : tokenDecoded.email,
                'id' : tokenDecoded.account_id
            };

            var payload = {
                username: account.username,
                email: account.email,
                account_id: account.id
            };
            var token = jwt.sign(payload, config.apiSecret, {
                expiresIn: config.jwtExpire // expires in 24 hours
            });

            res.header('Authorization-Renewal', token);
        }
    }
};

exports.getNewToken = function(account) {
    var payload = {};

    if (account.Roles.length > 0) {
        // when account has overriding rights
        payload = {
            username: account.username,
            email: account.email,
            account_id: account.id,
            role_id: account.Roles[0].id // role_id
        };
    } else {
        payload = {
            username: account.username,
            email: account.email,
            account_id: account.id
        };
    }


    var token = jwt.sign(payload, config.apiSecret, {
        expiresIn: config.jwtExpire // expires in 24 hours
    });

    return token;
};
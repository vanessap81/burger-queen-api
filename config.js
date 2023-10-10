exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.DB_URL || 'mongodb+srv://gabrielafaria806:TO9r1WGlRqAvtpP6@burguer-queen-api.uzcyqxa.mongodb.net/burger-queen?retryWrites=true&w=majority&appName=AtlasApp';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';

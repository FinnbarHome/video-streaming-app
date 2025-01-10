module.exports = (requiredEnvVars) => {
    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            console.error(`ERROR: ${key} not specified in .env`);
            process.exit(1);
        }
    });
};

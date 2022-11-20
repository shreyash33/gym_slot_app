db.createUser(
    {
        user: "admin",
        pwd: "pass123",
        roles: [
            {
                role: "readWrite",
                db: "gym"
            }
        ]
    }
);
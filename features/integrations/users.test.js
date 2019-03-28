const userController = require("../../controllers/users.js");
const connection = require("../../database/connection.js");
let responseSent;
let res = {getHeader: ()=> {},setHeader: {call: () => {}},
    send: (response)=> {responseSent = response}};

describe("adding a user", () => {
    beforeAll(async () => {
        await connection.pool.query("truncate table users, votes, trips, stages, comments, polls, stages_users, trips_users restart identity");
        await userController.addUser({body: {
                email: 'email@email.com',
                firstName: 'Tom',
                lastName: 'D',
                phoneNumber: '000',
                password: 'password'
            }, connection: {encrypted: false}
        },res )

    });
    it("user is added to db", async () => {
        let result = await connection.pool.query("select * from users");
        await expect(result.rows.length).toEqual(1);
        await expect(result.rows[0].first_name).toEqual("Tom");
        await expect(result.rows[0].last_name).toEqual("D");
        await expect(result.rows[0].phone_number).toEqual("000")
    });
    it("duplicate emails can't be added", async () => {
        await userController.addUser(
            {body: {
                    email: 'email@email.com',
                    firstName: 'Tom',
                    lastName: 'D',
                    phoneNumber: '000',
                    password: 'password'
                }, connection: {encrypted: false}
            }, res);
        expect(responseSent).toEqual('user already exists')

    })
});

describe("authenticating a user", async () => {
    it("authenticates if correct details", async () => {
        await userController.authLogin({body: {
                email: 'email@email.com',
                password: 'password'
            }, connection: {encrypted: false}
        }, res);
        await expect(responseSent).toEqual("successfully authenticated")
    });

    it("doesn't authenticate if wrong email", async () => {
        await userController.authLogin({body: {
                email: 'wrong@email.com',
                password: 'password'
            }, connection: {encrypted: false}
        }, res);
        await expect(responseSent).toEqual("failed to authenticate")
    });
    it("doesn't authenticate if wrong email", async () => {
        await userController.authLogin({body: {
                email: 'email@email.com',
                password: 'wrongpassword'
            }, connection: {encrypted: false}
        }, res);
        await expect(responseSent).toEqual("failed to authenticate")
    })
});

describe("getUserById", async () => {
    it ("can get the user", async () => {
        await userController.getUserById({
            params: {id: 1}}, res);
        expect(responseSent.first_name).toEqual("Tom");
        expect(responseSent.last_name).toEqual("D")
    })
});

describe("getUser", async() => {
    it("can get user by cookie", async () => {
        await userController.getUser({cookies: {user: 1}}, res);
        expect(responseSent[0].first_name).toEqual("Tom");
        expect(responseSent[0].last_name).toEqual("D")
    })
})

// test controller functions as integration test

const ReminderFinder = require("../lib/reminderService.js");
const Stage = require("../../models/lib/stage.js");
const StagesUsers = require("../../models/lib/stagesUsers.js");
const Trip = require("../../models/lib/trips.js");
const User = require("../../models/lib/users.js");
const connection = require("../../database/connection");
const fakeClientClass = require ("./fakeTextSender.js");
const fakeClient = new fakeClientClass();

describe("Text", function() {
    var today = new Date();
    var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    var tomorrowDate = `0${tomorrow.getMonth()+1}-${tomorrow.getDate()}-${tomorrow.getFullYear()}`;

    beforeAll( async function() {
        await connection.pool.query("TRUNCATE TABLE stages, trips, users, trips_users, stages_users, comments, votes, polls RESTART IDENTITY");
        await User.addUser("Tom", "D", "t@d", 111, "tom");
        await User.addUser("Isa", "I", "isa@isa", 222, "isa");
        await User.addUser("Cat", "Cat", "cat@cat", 333, "cat");
        await Trip.saveToDB("Trip", "blabla", 1);
        await Trip.addUserToTrip(1, 1);
        await Trip.addUserToTrip(1, 2);
        await Trip.addUserToTrip(1, 3);
        await Stage.addStage("First Stage", "please confirm your attendance", tomorrowDate, 1);
        await Stage.addStage("Second Stage", "another task", '05-09-2020', 1);
        await StagesUsers.addStageToUsers( 1 , 1);
        await StagesUsers.addStageToUsers( 2 , 1);
    });

    // describe("getStagesDueTomorrow", () => {
    //
    //     it("return list of all stages due tomorrow", async () => {
    //         let result = await ReminderFinder.getStagesDueTomorrow(tomorrowDate);
    //         expect(result.length).toEqual(1);
    //         expect(result[0].name).toEqual("First Stage")
    //     });
    // });
    describe("textCoordinator", () => {
        // it("sends texts to appropriate events", async () => {
        //    await ReminderFinder.textCoordinator(fakeClient);
        //    expect(fakeClient.messages.sent).toEqual([
        //        {
        //            to: '111',
        //            from: process.env.TWILIO_NUMBER,
        //             body: "please confirm your attendance"
        //        },
        //        {
        //            to: '222',
        //            from: process.env.TWILIO_NUMBER,
        //             body: "please confirm your attendance"
        //        },
        //        {
        //            to: '333',
        //            from: process.env.TWILIO_NUMBER,
        //             body: "please confirm your attendance"
        //        }
        //    ]);
        // });
        it("sends texts when new stages added", async () => {
            fakeClient.messages.sent =[]
            await Stage.addStage("Third stage", "pay me", tomorrowDate, 1);
            await StagesUsers.addStageToUsers(3, 1);
            await ReminderFinder.textCoordinator(fakeClient);
            expect(fakeClient.messages.sent).toEqual([
                {
                    to: '111',
                    from: process.env.TWILIO_NUMBER,
                    body: "please confirm your attendance"
                },
                {
                    to: '222',
                    from: process.env.TWILIO_NUMBER,
                    body: "please confirm your attendance"
                },
                {
                    to: '333',
                    from: process.env.TWILIO_NUMBER,
                    body: "please confirm your attendance"
                },
                {
                    to: '111',
                    from: process.env.TWILIO_NUMBER,
                    body: "pay me"
                },
                {
                    to: '222',
                    from: process.env.TWILIO_NUMBER,
                    body: "pay me"
                },
                {
                    to: '333',
                    from: process.env.TWILIO_NUMBER,
                    body: "pay me"
                }
            ])

        })
    });
});
import { Selector } from 'testcafe';

fixture `SpeedScore Interactions`
    .page `http://127.0.0.1:5500/index.html`;

test('LoginGoesToActivityFeed', async t => {
    await t
        .typeText('#emailInput', 'hundhaus@wsu.edu')
        .typeText('#passwordInput', '123#Eejl;')
        .click('#loginBtn')
        .expect(Selector('#feedModeDiv').visible).eql(true)
        .expect(Selector('#feedMode').classNames).contains("menuItemSelected")
        .click('#menuBtn')
        .expect(Selector('.feedModeItem').visible).eql(true)
        .expect(Selector('#topBarTitle').textContent).eql("Activity Feed")
});

test('AboutBoxCloses', async t => {
    await t
        .typeText('#emailInput', 'hundhaus@wsu.edu')
        .typeText('#passwordInput', '123#Eejl;')
        .click('#loginBtn')
        .wait(2000)
        .click('#menuBtn')
        .click('#aboutItem')
        .click('#modalClose')
        .expect(Selector('#aboutModal').visible).eql(false)
        .click('#menuBtn')
        .click('#aboutItem')
        .click('#aboutOK')
        .expect(Selector('#aboutModal').visible).eql(false)
});

test('AboutBoxCloseBtnAligned', async t => {
    await t
        .typeText('#emailInput', 'hundhaus@wsu.edu')
        .typeText('#passwordInput', '123#Eejl;')
        .click('#loginBtn')
        .wait(2000)
        .click('#menuBtn')
        .click('#aboutItem')
        .expect((Selector('.modal-title').child("#modalClose")).exists).eql(true)
});
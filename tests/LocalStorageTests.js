import { Selector, ClientFunction } from 'testcafe';

const getLocalStorageItem = ClientFunction(prop => {
    return localStorage.getItem(prop);
});

fixture `Local Storage Tests`
    .page `http://127.0.0.1:5500/index.html`;

//The first test 
test('LoginAndLogRound', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#emailInput', 'chris@gmail.com')
        .typeText('#passwordInput', '123#Eejl;')
        .click('#loginBtn')
        .click('#roundsMode')
        .click('#menuBtn')
        .click('#logRoundItem')
        .expect(Selector('#logRoundDiv').visible).eql(true)
        .typeText('#roundCourse','Palouse Ridge')
        .click("#roundType")
        .click(Selector('#roundType').find('option').withText('Tournament'))
        .typeText('#roundStrokes','84',{replace: true})
        .typeText('#roundMinutes','48',{replace: true})
        .typeText('#roundSeconds','24',{replace: true})
        .typeText('#roundNotes','Gorgeous day. Three birdies!',{replace: true})
        .click("#logRoundBtn") //Submit data
        .wait(1000)
        .expect(getLocalStorageItem('chris@gmail.com')).notEql(null)
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"roundNum":1')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"course":"Palouse Ridge"')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"type":"tournament"')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"strokes":"84"')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"minutes":"48"')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"seconds":"24"')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"SGS":"132:24"')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"notes":"Gorgeous day. Three birdies!"')
        .expect(getLocalStorageItem('chris@gmail.com')).contains('"roundCount":1');

        let data = await getLocalStorageItem('chris@gmail.com');
        console.log('Data for chris@gmail.com: ' + data);
});
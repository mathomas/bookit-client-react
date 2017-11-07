import { defineSupportCode } from 'cucumber'
import { By, until } from 'selenium-webdriver'
import faker from 'faker'
import { driver, url } from '../support/hooks'

defineSupportCode(({Given, When, Then}) => {
  Given('I am on the bookit website form', async () => {
    await driver.get(`${url}/book`)
  })

  When('I book a room', async () => {
    const start = faker.date.future(2)
    const end = new Date(start)
    end.setMinutes(start.getMinutes() + 1)
    const startForForm = start.toISOString().split('.')[0]
    const endForForm = end.toISOString().split('.')[0]
    const subjectInput = await driver.findElement(By.name('subject'))
    await subjectInput.sendKeys('My Bookable')
    const startInput = await driver.findElement(By.name('start'))
    await driver.wait(async () => (await startInput.getAttribute('value')).includes('T'))
    await startInput.clear()
    await startInput.sendKeys(startForForm)
    const endInput = await driver.findElement(By.name('end'))
    await driver.wait(async () => (await endInput.getAttribute('value')).includes('T'))
    await endInput.clear()
    await endInput.sendKeys(endForForm)
    const createButton = await driver.findElement(By.tagName('button'))
    await createButton.click()
  })

  Then('It\'s booked', async () => {
    const xpath = "//*[contains(text(),'Booking Created')]"
    const condition = until.elementLocated({ xpath: xpath })
    await driver.wait(condition)
  })
})

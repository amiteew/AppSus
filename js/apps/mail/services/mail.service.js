import { utilService } from "../../../services/util.service.js";
import { storageService } from "../../../services/storage.service.js";

export const mailService = {
    query,
    getMailById,
    setMailAsRead,
    removeMail,
    toggleReadMailPreview,
    addMail,
    toggleMailIsStarred,
    sendMailToInbox
}

const KEY = 'mailDB'

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

let gMails = storageService.loadFromStorage(KEY) || [{
        id: 'e101',
        from: 'Dominos Pizza',
        subject: 'Order Status',
        body: 'Your order is ready and will be delivered to you shortley!',
        isRead: true,
        sentAt: Date.now(),
        to: 'momo@momo.com',
        status: ['inbox'],
        isStarred: false

    },
    {
        id: 'e102',
        from: 'Bird Person',
        subject: 'Yo!',
        body: 'Would love to catch up sometimes',
        isRead: false,
        sentAt: Date.now(),
        to: 'momo@momo.com',
        status: ['sent'],
        isStarred: false
    },
    {
        id: 'e103',
        from: 'Rick Sanchez',
        subject: 'Wubba Lubba Dub Dub!',
        body: 'This is my new catchphrase!! check it out *burp*',
        isRead: false,
        sentAt: Date.now(),
        to: 'momo@momo.com',
        status: ['trash', 'starred'],
        isStarred: true
    },
    {
        id: 'e104',
        from: 'Beth Smith',
        subject: 'Holy Crap!',
        body: 'What did you do to my house??! we need to have a serious talk about this..',
        isRead: false,
        sentAt: Date.now(),
        to: 'momo@momo.com',
        status: ['inbox'],
        isStarred: false
    },
    {
        id: 'e105',
        from: 'Netflix',
        subject: 'Enjoying our content?',
        body: 'Log in to your account soon to get new recommendations and add more shows to your playlist',
        isRead: true,
        sentAt: Date.now(),
        to: 'momo@momo.com',
        status: ['inbox'],
        isStarred: false
    },
    {
        id: 'e106',
        from: 'Brian from Jofibo',
        subject: 'Fresh new templates for your job search 📄‏‏',
        body: 'An eye for detail can mean many things. But when it comes to your job search documents, nothing beats a matching professional look.',
        isRead: false,
        sentAt: Date.now(),
        to: 'momo@momo.com',
        status: ['inbox'],
        isStarred: false
    },
    {
        id: 'e107',
        from: 'Jerry Smith',
        subject: 'New job offer',
        body: `Hi, I noticed that you are starting to learn new abilities and skills,
                 and would like to offer you to come over for a job interview`,
        isRead: false,
        sentAt: Date.now(),
        to: 'momo@momo.com',
        status: ['inbox'],
        isStarred: false
    }
]

function query(criteria) {
    const { status, txt, isRead } = criteria
    let mailsToDisplay = gMails.filter(mail => {
        return mail.status.includes(status) &&
            (mail.body.toLowerCase().includes(txt.toLowerCase()) ||
                mail.subject.toLowerCase().includes(txt.toLowerCase()) ||
                mail.from.toLowerCase().includes(txt.toLowerCase()))
    })
    if (isRead === 'read') mailsToDisplay = mailsToDisplay.filter(mail => mail.isRead)
    else if (isRead === 'unread') mailsToDisplay = mailsToDisplay.filter(mail => !mail.isRead)
    return Promise.resolve(mailsToDisplay)

}

function setMailAsRead(mailId) {
    const mailIdx = gMails.findIndex(mail => mail.id === mailId)
    if (!gMails[mailIdx] || gMails[mailIdx].isRead === true) return
    gMails[mailIdx].isRead = true
    _saveMailsToStorage()
}

function toggleMailIsStarred(mailId) {
    const mailIdx = gMails.findIndex(mail => mail.id === mailId)
    gMails[mailIdx].isStarred = !gMails[mailIdx].isStarred
    if (gMails[mailIdx].isStarred) gMails[mailIdx].status.push('starred')
    else gMails[mailIdx].status.splice(1)
    _saveMailsToStorage()
}

function sendMailToInbox(mailId) {
    const mailIdx = gMails.findIndex(mail => mail.id === mailId)
    gMails[mailIdx].status = ['inbox']
    _saveMailsToStorage()
}

function toggleReadMailPreview(mailId) {
    const mailIdx = gMails.findIndex(mail => mail.id === mailId)
    gMails[mailIdx].isRead = !gMails[mailIdx].isRead
    _saveMailsToStorage()
}

function _createMail(subject, body, to) {
    return {
        id: utilService.makeId(),
        from: loggedinUser.fullname,
        subject,
        body,
        isRead: true,
        sentAt: utilService.timestampConverter(Date.now()),
        isStarred: false,
        to,
        status: ['sent']
    }
}

function addMail(mailData) {
    const mail = _createMail(mailData.subject, mailData.body, mailData.to)
    gMails.unshift(mail)
    _saveMailsToStorage()
    return Promise.resolve()
}

function removeMail(mailId) {
    let mailIdx = gMails.findIndex(mail => mail.id === mailId)
    if (gMails[mailIdx].status.includes('trash')) {
        gMails.splice(mailIdx, 1)
        _saveMailsToStorage
        return Promise.resolve()
    } else gMails[mailIdx].status = ['trash']
}

function getMailById(mailId) {
    const mail = gMails.find(mail => mail.id === mailId)
    return Promise.resolve(mail)
}

function _saveMailsToStorage() {
    storageService.saveToStorage(KEY, gMails)
}
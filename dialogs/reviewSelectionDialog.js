// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TextPrompt, ComponentDialog, WaterfallDialog } = require('botbuilder-dialogs');

const REVIEW_SELECTION_DIALOG = 'REVIEW_SELECTION_DIALOG';

const TEXT_PROMPT = 'TEXT_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class ReviewSelectionDialog extends ComponentDialog {
    constructor() {
        super(REVIEW_SELECTION_DIALOG);

        this.questionsAndAnswers = {
            'remote work': 'Our remote work policy allows for flexible work arrangements. Details depend on the department and role.',
            'absence': 'Absences and time-off requests should be reported through the HR portal or your immediate supervisor.',
            'time off': 'Absences and time-off requests should be reported through the HR portal or your immediate supervisor.',
            'dress code': 'Our dress code is business casual. However, some departments may have specific requirements.',
            'workplace harassment': 'We have a zero-tolerance policy for harassment. Detailed guidelines are available in the employee handbook.',
            'update personal information': 'Personal information can be updated through the HR portal or by contacting the HR department directly.',
            'first paycheck': 'Paychecks are issued bi-weekly/monthly, with the first check typically arriving within the first month of employment.',
            'benefits': 'Our benefits package includes health insurance, retirement plans, paid time off, and wellness programs.',
            'health insurance': 'Enrollment instructions will be provided during your onboarding process. You can also access details through the HR portal.',
            'bonuses': 'Bonuses are performance-based and typically awarded annually. Details are outlined in the employee handbook.',
            'payroll error': 'Report payroll errors to the HR or payroll department as soon as possible for correction.',
            'training opportunities': 'We offer various training programs, including online courses, workshops, and seminars. Check the HR portal for upcoming sessions.',
            'mentorship program': 'Yes, we have a mentorship program that pairs new employees with experienced colleagues. Sign-up details are available through HR.',
            'professional development': 'Applications for professional development courses can be submitted through the HR portal or your supervisor.',
            'career advancement': 'Yes, we encourage internal promotions and career growth. Discuss your career goals with your manager.',
            'performance reviews': 'Performance reviews are conducted annually and include self-assessment, peer reviews, and manager evaluations.',
            'intranet': 'Access to the intranet will be provided during your onboarding process, along with login credentials.',
            'organizational structure': 'The organizational structure is available on the intranet under the "About Us" section.',
            'technical support': 'For technical support, contact the IT helpdesk via phone or the IT support portal.',
            'meeting room': 'Meeting rooms can be booked through the company’s calendar system or intranet.',
            'expense reimbursement': 'Expense reimbursement policies and procedures are detailed in the employee handbook and on the HR portal.',
            'company events': 'Upcoming events and activities are posted on the intranet and company bulletin boards. Join our social committees for more involvement.',
            'employee resource groups': 'Yes, we have several ERGs focused on diversity, wellness, and professional interests. Information on joining is available through HR.',
            'work-life balance': 'We promote work-life balance through flexible work hours, remote work options, and wellness programs.',
            'feedback to management': 'Feedback can be provided through anonymous surveys, suggestion boxes, or directly to your manager.',
            'company newsletter': 'Yes, the company newsletter is published monthly and contains updates, news, and upcoming events.',
            'emergency': 'In case of an emergency, follow the emergency procedures outlined in the employee handbook and posted in work areas.',
            'building access': 'After-hours access is granted via your employee ID card. Ensure you have the necessary permissions from security.',
            'COVID-19 protocols': 'Our COVID-19 protocols include mandatory masks, social distancing, and regular sanitization. Detailed guidelines are on the intranet.',
            'first aid': 'For first aid or medical emergencies, contact the on-site medical staff or dial the emergency number provided in your orientation.',
            'security measures': 'We use encryption, firewalls, and secure access protocols to protect employee data. Detailed measures are outlined in our IT policy.'
        };

        this.questionsList = [
            'What is the company\'s policy on remote work?',
            'How do I report an absence or request time off?',
            'What is the dress code?',
            'Can you explain the company\'s policy on workplace harassment?',
            'How do I update my personal information in the company records?',
            'When will I receive my first paycheck?',
            'What benefits are offered by the company?',
            'How do I enroll in the company\'s health insurance plan?',
            'What is the company\'s policy on bonuses?',
            'How do I report a payroll error?',
            'What training opportunities are available?',
            'Is there a mentorship program?',
            'How can I apply for professional development courses?',
            'Are there opportunities for career advancement?',
            'What is the process for performance reviews?',
            'How do I access the company\'s intranet?',
            'Where can I find information on the company\'s organizational structure?',
            'Who should I contact for technical support?',
            'How do I book a meeting room?',
            'What is the company\'s policy on expense reimbursement?',
            'How do I get involved in company events and activities?',
            'Are there employee resource groups (ERGs)?',
            'What is the company\'s approach to work-life balance?',
            'How do I provide feedback to management?',
            'Is there a company newsletter?',
            'What should I do in case of an emergency?',
            'How do I access the building after hours?',
            'What are the company\'s COVID-19 protocols?',
            'Who do I contact for first aid or medical emergencies?',
            'What security measures are in place to protect employee data?'
        ];

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.askQuestionStep.bind(this),
            this.provideAnswerStep.bind(this),
            this.loopStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async askQuestionStep(stepContext) {
        const promptOptions = { prompt: 'Please type your question, or type "all" to see all questions.' };
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }

    async provideAnswerStep(stepContext) {
        const userQuestion = stepContext.result.toLowerCase();
        let response = '';

        if (userQuestion === 'all') {
            response = 'Here are all the questions you can ask:\n' + this.questionsList.map((q, index) => `${index + 1}. ${q}`).join('\n');
        } else {
            const matchedAnswer = Object.entries(this.questionsAndAnswers).find(([key]) => userQuestion.includes(key));
            response = matchedAnswer ? matchedAnswer[1] : 'Sorry, I do not have an answer for that. Please try asking something else or type "all" to see all available questions.';
        }

        await stepContext.context.sendActivity(response);
        return await stepContext.next();
    }

    async loopStep(stepContext) {
        return await stepContext.replaceDialog(REVIEW_SELECTION_DIALOG);
    }
}

module.exports.ReviewSelectionDialog = ReviewSelectionDialog;
module.exports.REVIEW_SELECTION_DIALOG = REVIEW_SELECTION_DIALOG;

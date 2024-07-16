// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog, NumberPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { ReviewSelectionDialog, REVIEW_SELECTION_DIALOG } = require('./reviewSelectionDialog');
const { UserProfile } = require('../userProfile');

const TOP_LEVEL_DIALOG = 'TOP_LEVEL_DIALOG';

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const NUMBER_PROMPT = 'NUMBER_PROMPT';

class TopLevelDialog extends ComponentDialog {
    constructor() {
        super(TOP_LEVEL_DIALOG);
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new ReviewSelectionDialog());

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.empIdStep.bind(this),
            this.startSelectionStep.bind(this),
            this.acknowledgementStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async empIdStep(stepContext) {
        stepContext.values.userInfo = new UserProfile();
        const promptOptions = { prompt: 'Please enter your EMPID.' };
        return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    }

    async startSelectionStep(stepContext) {
        stepContext.values.userInfo.empId = stepContext.result;
        return await stepContext.beginDialog(REVIEW_SELECTION_DIALOG);
    }

    async acknowledgementStep(stepContext) {
        const userProfile = stepContext.values.userInfo;
        userProfile.questions = stepContext.result || [];
        await stepContext.context.sendActivity(`Thanks for participating. Your EMPID is ${userProfile.empId}.`);
        return await stepContext.endDialog(userProfile);
    }
}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;

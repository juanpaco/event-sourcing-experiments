import emailTemplates from 'email-templates';
import nodemailer from 'nodemailer';
import Promise from 'bluebird';

const emailTemplatesP = Promise.promisify(emailTemplates);

// Just for security reasons, let's REALLY make sure that we're not just
//   requiring arbitrary things.  This function will eventually actually
//   compare the transportType against accepted transport types. But for now it
//   is just a placeholder.
// function transportTypeToTransportFactory(transportType) {
function transportTypeToTransportFactory() {
    // eslint-disable-next-line global-require
    return require('nodemailer-pickup-transport');
}

// templates is a function that did a callback with 2 arguments, so the Bluebird
//   one can't handle what we need
function promisifyTemplates(templates) {
    return (template, context) => new Promise((resolve, reject) => {
        templates(
            template,
            context,
            (err, html, text) => {
                if (err) {
                    return reject(err);
                }

                return resolve({ html, text });
            },
        );
    });
}

export default ({ directory, from, transportType }) => {
    const options = { directory };
    const createTransport = transportTypeToTransportFactory(transportType);
    const transport = createTransport(options);
    const mailer = nodemailer.createTransport(transport);
    const send = Promise.promisify(mailer.sendMail.bind(mailer));

    return (templatesPath, template, context, subject, to) =>
        emailTemplatesP(templatesPath)
            .then(promisifyTemplates)
            .then(templates => templates(template, context))
            .then(({ html, text }) => ({ from, html, subject, text, to }))
            .then(send);
};

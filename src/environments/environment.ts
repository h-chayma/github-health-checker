import * as dotenv from 'dotenv';
dotenv.config();

export const environment = {
    production: false,
    githubToken: process.env['GITHUB_TOKEN']
};

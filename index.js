// TODO: Include packages needed for this application
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';


// TODO: Create an array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'Enter the project title:',
    },
    {
        type: 'input',
        name: 'description',
        message: 'Enter the project description:',
    },
    {
        type: 'input',
        name: 'installation',
        message: 'Enter installation instructions (use full stops to separate steps):',
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Enter usage information (use full stops to separate steps):',
    },
    {
        type: 'confirm',
        name: 'addScreenshot',
        message: 'Do you want to include a screenshot?',
        default: false,
    },
    {
        type: 'input',
        name: 'screenshotPath',
        message: 'Enter the relative path to the screenshot:',
        when: (answers) => answers.addScreenshot,
        default: 'assets/images/screenshot.png',
        filter: (input) => {
            createImageDirectory(); // Ensure directory exists
            return input;
        },
    },
    {
        type: 'input',
        name: 'features',
        message: 'Enter your project features:',
    },
    {
        type: 'input',
        name: 'contributing',
        message: 'Enter contribution guidelines:',
    },
    {
        type: 'input',
        name: 'tests',
        message: 'Enter test instructions:',
    },
    {
        type: 'list',
        name: 'license',
        message: 'Choose a license:',
        choices: ['MIT', 'GPLv3', 'Apache 2.0', 'BSD 3-Clause', 'None'],
    },
    {
        type: 'input',
        name: 'github',
        message: 'Enter your GitHub username:',
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter your email address:',
    },
];

// Function to create assets/images directory if it doesn't exist
function createImageDirectory() {
    const imagePath = path.join(process.cwd(), 'assets', 'images');

    if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true });
        console.log('📂 Created directory: assets/images');
    }
}

// Function to format sections (Installation & Usage) while handling quotes
function formatSection(sectionText, sectionTitle) {
    if (!sectionText) return '';

    // Regular expression to match dots that are sentence delimiters
    const sentenceRegex = /(?<!\w['"])\. (?!['"]\w)/g;

    const sentences = sectionText.split(sentenceRegex).map(s => s.trim()).filter(s => s);
    if (sentences.length === 0) return '';

    const header = `## ${sectionTitle}\n\n`;
    const steps = sentences.map(step => `- ${step}`).join('\n');

    return `${header}${steps}\n`;
}

// Function to format the Usage section with screenshot
function formatUsage(usageText, addScreenshot, screenshotPath) {
    let usageContent = formatSection(usageText, 'Usage');

    if (addScreenshot) {
        usageContent += `\n### Screenshot\n\n\`\`\`md\n![alt text](${screenshotPath})\n\`\`\`\n`;
    }

    return usageContent;
}

// Function to generate README content
function generateReadme(answers) {
    return `# ${answers.title}


## Description
${answers.description}

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Badges](#badges)
- [Features](#features)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

${formatSection(answers.installation, 'Installation')}

${formatUsage(answers.usage, answers.addScreenshot, answers.screenshotPath)}

## License
This project is licensed under the **${answers.license}** license.

## Badges
![License](https://img.shields.io/badge/license-${answers.license}-blue.svg)

## Features
${answers.features}

## Contributing
${answers.contributing}

## Tests
${answers.tests}

## Questions
For any questions, reach out to me:

- GitHub: [${answers.github}](https://github.com/${answers.github})
- Email: ${answers.email}
`;
}

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, (err) => {
        if (err) {
            console.error(' Error writing file:', err);
        } else {
            console.log(' README.md successfully created!');
        }
    });
}

// TODO: Create a function to initialize app
function init() {

    console.log("App is running!");
    inquirer.prompt(questions)
    .then(answers => {
        const readmeContent = generateReadme(answers);
        writeToFile('README.md', readmeContent);
    })
    .catch(error => {
        console.error(' Error during prompt:', error);
    });
}

// Function call to initialize app
init();
